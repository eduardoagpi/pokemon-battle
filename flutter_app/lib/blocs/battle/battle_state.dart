import 'package:equatable/equatable.dart';

enum BattleStatus { initial, inProgress, finished, error }

class BattleState extends Equatable {
  final BattleStatus status;
  final double myHp;
  final double opponentHp;
  final String? message;

  const BattleState({
    this.status = BattleStatus.initial,
    this.myHp = 1.0,
    this.opponentHp = 1.0,
    this.message,
  });

  BattleState copyWith({
    BattleStatus? status,
    double? myHp,
    double? opponentHp,
    String? message,
  }) {
    return BattleState(
      status: status ?? this.status,
      myHp: myHp ?? this.myHp,
      opponentHp: opponentHp ?? this.opponentHp,
      message: message ?? this.message,
    );
  }

  @override
  List<Object?> get props => [status, myHp, opponentHp, message];
}
