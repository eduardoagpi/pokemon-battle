import 'package:equatable/equatable.dart';
import '../../domain/entities/user_session.dart';

enum LobbyStatus { initial, waiting, opponentFound, failure, unauthorized }

class LobbyState extends Equatable {
  final LobbyStatus status;
  final UserSession? session;
  final String? errorMessage;

  const LobbyState({
    this.status = LobbyStatus.initial,
    this.session,
    this.errorMessage,
  });

  LobbyState copyWith({
    LobbyStatus? status,
    UserSession? session,
    String? errorMessage,
  }) {
    return LobbyState(
      status: status ?? this.status,
      session: session ?? this.session,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, session, errorMessage];
}
