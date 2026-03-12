import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/battle_repository.dart';
import '../../domain/repositories/general_repository.dart';
import '../../domain/entities/battle_event.dart' as domain;
import 'battle_event.dart';
import 'battle_state.dart';

class BattleBloc extends Bloc<BattleEvent, BattleState> {
  final BattleRepository battleRepository;
  final GeneralRepository generalRepository;
  StreamSubscription? _stateSubscription;
  StreamSubscription? _eventSubscription;

  BattleBloc({required this.battleRepository, required this.generalRepository})
    : super(const BattleState()) {
    on<StartBattle>(_onStartBattle);
    on<Attack>(_onAttack);
    on<ExitFight>(_onExitFight);
    on<UpdateBattleState>(_onUpdateBattleState);
    on<ShowBattleMessage>(_onShowBattleMessage);
  }

  void _onStartBattle(StartBattle event, Emitter<BattleState> emit) {
    final session = generalRepository.getSession();

    if (session == null || !battleRepository.isConnected) {
      emit(
        state.copyWith(
          status: BattleStatus.unauthorized,
          message: 'Sesión o conexión no encontrada',
          shouldExit: true,
        ),
      );
      return;
    }

    emit(state.copyWith(status: BattleStatus.inProgress));

    _stateSubscription?.cancel();
    _stateSubscription = battleRepository.subscribeState().listen((
      domainState,
    ) {
      add(UpdateBattleState(domainState));
    });

    _eventSubscription?.cancel();
    _eventSubscription = battleRepository.subscribeEvents().listen((
      domainEvent,
    ) {
      if (domainEvent is domain.MyPokemonDefeatedEvent) {
        add(
          ShowBattleMessage(
            '¡Tu pokemon ${domainEvent.pokemonName} ha sido derrotado!',
          ),
        );
      } else if (domainEvent is domain.OpponentPokemonDefeatedEvent) {
        add(
          ShowBattleMessage(
            "¡El ${domainEvent.pokemonName} del oponente ha sido derrotado!",
          ),
        );
      } else if (domainEvent is domain.BattleWonEvent) {
        if (domainEvent.reason == 'desertion') {
          add(
            const ShowBattleMessage(
              'El oponente huyó, has ganado!!',
              result: BattleResult.opponentDesertion,
            ),
          );
        } else {
          add(
            const ShowBattleMessage(
              'Enhorabuena, ganaste!!',
              result: BattleResult.won,
            ),
          );
        }
      } else if (domainEvent is domain.BattleLostEvent) {
        add(
          const ShowBattleMessage(
            'On no, Perdiste!',
            result: BattleResult.lost,
          ),
        );
      }
    });
  }

  void _onUpdateBattleState(
    UpdateBattleState event,
    Emitter<BattleState> emit,
  ) {
    final domainState = event.battleState;
    emit(
      state.copyWith(
        myHp: (domainState.myPokemon?.hp ?? 0) / 100.0,
        opponentHp: (domainState.opponent?.hp ?? 0) / 100.0,
        myPokemonName: domainState.myPokemon?.name,
        opponentPokemonName: domainState.opponent?.name,
        myPokemonGraphicUrl: domainState.myPokemon?.pokemonGraphicUrl,
        opponentPokemonGraphicUrl: domainState.opponent?.pokemonGraphicUrl,
        myRemainingPokemons: domainState.myPokemon?.remainingPokemonCount ?? 0,
        opponentRemainingPokemons:
            domainState.opponent?.remainingPokemonCount ?? 0,
        attackEnabled: domainState.attackEnabled,
      ),
    );
  }

  void _onShowBattleMessage(
    ShowBattleMessage event,
    Emitter<BattleState> emit,
  ) {
    final result = event.result != BattleResult.none
        ? event.result
        : state.battleResult;
    emit(state.copyWith(message: event.message, battleResult: result));
  }

  void _onAttack(Attack event, Emitter<BattleState> emit) {
    battleRepository.attack();
  }

  void _onExitFight(ExitFight event, Emitter<BattleState> emit) {
    generalRepository.clearSession();
    emit(state.copyWith(status: BattleStatus.finished, shouldExit: true));
  }

  @override
  Future<void> close() {
    _stateSubscription?.cancel();
    _eventSubscription?.cancel();
    return super.close();
  }
}
