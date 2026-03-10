import 'package:equatable/equatable.dart';

abstract class BattleEvent extends Equatable {
  const BattleEvent();

  @override
  List<Object> get props => [];
}

class StartBattle extends BattleEvent {
  const StartBattle();
}

class Attack extends BattleEvent {
  const Attack();
}

class ExitFight extends BattleEvent {
  const ExitFight();
}
