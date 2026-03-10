import 'package:equatable/equatable.dart';

abstract class NicknameEvent extends Equatable {
  const NicknameEvent();

  @override
  List<Object> get props => [];
}

class NicknameChanged extends NicknameEvent {
  final String nickname;
  const NicknameChanged(this.nickname);

  @override
  List<Object> get props => [nickname];
}

class NicknameSubmitted extends NicknameEvent {
  const NicknameSubmitted();
}
