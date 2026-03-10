import 'package:equatable/equatable.dart';

enum NicknameStatus { initial, loading, success, failure }

class NicknameState extends Equatable {
  final String nickname;
  final NicknameStatus status;
  final String? errorMessage;

  const NicknameState({
    this.nickname = '',
    this.status = NicknameStatus.initial,
    this.errorMessage,
  });

  NicknameState copyWith({
    String? nickname,
    NicknameStatus? status,
    String? errorMessage,
  }) {
    return NicknameState(
      nickname: nickname ?? this.nickname,
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [nickname, status, errorMessage];
}
