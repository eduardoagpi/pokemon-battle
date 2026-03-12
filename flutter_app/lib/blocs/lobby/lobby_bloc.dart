import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/battle_repository.dart';
import '../../domain/entities/battle_event.dart';
import '../../domain/usecases/connect_to_battle_use_case.dart';
import '../../domain/usecases/get_active_session.dart';
import 'lobby_event.dart';
import 'lobby_state.dart';

class LobbyBloc extends Bloc<LobbyEvent, LobbyState> {
  final GetActiveSessionUseCase getActiveSessionUseCase;
  final ConnectToBattleUseCase connectToBattleUseCase;
  final BattleRepository battleRepository;
  StreamSubscription? _battleSubscription;

  LobbyBloc({
    required this.getActiveSessionUseCase,
    required this.connectToBattleUseCase,
    required this.battleRepository,
  }) : super(const LobbyState()) {
    on<StartWaiting>(_onStartWaiting);
    on<OpponentJoined>(_onOpponentJoined);
  }

  void _onStartWaiting(StartWaiting event, Emitter<LobbyState> emit) async {
    final session = getActiveSessionUseCase.execute();

    if (session == null ||
        session.nickname.isEmpty ||
        session.pokemons.isEmpty) {
      emit(
        state.copyWith(
          status: LobbyStatus.unauthorized,
          errorMessage: 'Nickname or Pokemons not set',
        ),
      );
      return;
    }

    emit(state.copyWith(status: LobbyStatus.waiting, session: session));

    try {
      // Connect to the battle server
      await connectToBattleUseCase.call(session.nickname, session.pokemons);

      // Listen for the start_battle event
      _battleSubscription?.cancel();
      _battleSubscription = battleRepository.subscribeEvents().listen((
        battleEvent,
      ) {
        if (battleEvent is StartBattleEvent) {
          add(const OpponentJoined());
        }
      });
    } catch (e) {
      emit(
        state.copyWith(
          status: LobbyStatus.failure,
          errorMessage: 'Failed to connect to battle server: $e',
        ),
      );
    }
  }

  void _onOpponentJoined(OpponentJoined event, Emitter<LobbyState> emit) {
    emit(state.copyWith(status: LobbyStatus.opponentFound));
  }

  @override
  Future<void> close() {
    _battleSubscription?.cancel();
    battleRepository.disconnect();
    return super.close();
  }
}
