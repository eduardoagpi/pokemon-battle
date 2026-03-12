import 'package:equatable/equatable.dart';
import '../../domain/entities/battle_state.dart' as domain;
import 'battle_state.dart';

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

class UpdateBattleState extends BattleEvent {
  final domain.BattleState battleState;
  const UpdateBattleState(this.battleState);

  @override
  List<Object> get props => [battleState];
}

class ShowBattleMessage extends BattleEvent {
  final String message;
  final BattleResult result;

  const ShowBattleMessage(this.message, {this.result = BattleResult.none});

  @override
  List<Object> get props => [message, result];
}
