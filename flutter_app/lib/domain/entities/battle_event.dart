import 'package:equatable/equatable.dart';
import 'battle_state.dart';

abstract class BattleEvent extends Equatable {
  const BattleEvent();

  @override
  List<Object?> get props => [];
}

class StartBattleEvent extends BattleEvent {
  const StartBattleEvent();
}

class UpdateBattleStatusEvent extends BattleEvent {
  final BattleState battleState;

  const UpdateBattleStatusEvent(this.battleState);

  @override
  List<Object?> get props => [battleState];
}

class MyPokemonDefeatedEvent extends BattleEvent {
  final String pokemonName;

  const MyPokemonDefeatedEvent(this.pokemonName);

  @override
  List<Object?> get props => [pokemonName];
}

class OpponentPokemonDefeatedEvent extends BattleEvent {
  final String pokemonName;

  const OpponentPokemonDefeatedEvent(this.pokemonName);

  @override
  List<Object?> get props => [pokemonName];
}

class BattleWonEvent extends BattleEvent {
  final String reason;

  const BattleWonEvent(this.reason);

  @override
  List<Object?> get props => [reason];
}

class BattleLostEvent extends BattleEvent {
  const BattleLostEvent();
}
