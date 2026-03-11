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
        add(ShowBattleMessage('Your ${domainEvent.pokemonName} was defeated!'));
      } else if (domainEvent is domain.OpponentPokemonDefeatedEvent) {
        add(
          ShowBattleMessage(
            "Opponent's ${domainEvent.pokemonName} was defeated!",
          ),
        );
      } else if (domainEvent is domain.BattleWonEvent) {
        add(ShowBattleMessage('You won! ${domainEvent.reason}'));
        // Status is handled by state subscription usually, but we can set it here too if needed
      } else if (domainEvent is domain.BattleLostEvent) {
        add(ShowBattleMessage('You lost the battle!'));
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
    emit(state.copyWith(message: event.message));
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
