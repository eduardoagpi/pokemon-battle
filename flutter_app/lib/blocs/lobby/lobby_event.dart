import 'package:equatable/equatable.dart';

abstract class LobbyEvent extends Equatable {
  const LobbyEvent();

  @override
  List<Object> get props => [];
}

class StartWaiting extends LobbyEvent {
  const StartWaiting();
}

class OpponentJoined extends LobbyEvent {
  const OpponentJoined();
}
