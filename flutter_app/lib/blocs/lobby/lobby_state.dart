import 'package:equatable/equatable.dart';

enum LobbyStatus { initial, waiting, opponentFound, failure }

class LobbyState extends Equatable {
  final LobbyStatus status;
  final List<String> team;
  final String? errorMessage;

  const LobbyState({
    this.status = LobbyStatus.initial,
    this.team = const [],
    this.errorMessage,
  });

  LobbyState copyWith({
    LobbyStatus? status,
    List<String>? team,
    String? errorMessage,
  }) {
    return LobbyState(
      status: status ?? this.status,
      team: team ?? this.team,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, team, errorMessage];
}
