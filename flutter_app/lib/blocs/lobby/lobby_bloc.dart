import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/usecases/get_active_session.dart';
import 'lobby_event.dart';
import 'lobby_state.dart';

class LobbyBloc extends Bloc<LobbyEvent, LobbyState> {
  final GetActiveSessionUseCase getActiveSessionUseCase;

  LobbyBloc({required this.getActiveSessionUseCase})
    : super(const LobbyState()) {
    on<StartWaiting>(_onStartWaiting);
    on<OpponentJoined>(_onOpponentJoined);
  }

  void _onStartWaiting(StartWaiting event, Emitter<LobbyState> emit) async {
    final session = getActiveSessionUseCase.execute();

    if (session == null) {
      emit(
        state.copyWith(
          status: LobbyStatus.failure,
          errorMessage: 'No active session found',
        ),
      );
      return;
    }

    emit(state.copyWith(status: LobbyStatus.waiting, session: session));

    // Simulate waiting for an opponent
    await Future.delayed(const Duration(seconds: 3));
    add(const OpponentJoined());
  }

  void _onOpponentJoined(OpponentJoined event, Emitter<LobbyState> emit) {
    emit(state.copyWith(status: LobbyStatus.opponentFound));
  }
}
