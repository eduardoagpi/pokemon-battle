import 'package:equatable/equatable.dart';

class FighterState extends Equatable {
  final int pokemonId;
  final String pokemonGraphicUrl;
  final String name;
  final int hp;
  final int remainingPokemonCount;

  const FighterState({
    required this.pokemonId,
    required this.pokemonGraphicUrl,
    required this.name,
    required this.hp,
    required this.remainingPokemonCount,
  });

  factory FighterState.fromJson(Map<String, dynamic> json) {
    return FighterState(
      pokemonId: json['pokemonId'],
      pokemonGraphicUrl: json['pokemonGraphicUrl'],
      name: json['name'],
      hp: json['hp'],
      remainingPokemonCount: json['remainingPokemonCount'],
    );
  }

  @override
  List<Object?> get props => [
    pokemonId,
    pokemonGraphicUrl,
    name,
    hp,
    remainingPokemonCount,
  ];
}

class BattleState extends Equatable {
  final FighterState? opponent;
  final FighterState? myPokemon;
  final bool attackEnabled;

  const BattleState({
    this.opponent,
    this.myPokemon,
    required this.attackEnabled,
  });

  factory BattleState.fromJson(Map<String, dynamic> json) {
    return BattleState(
      opponent: json['oponent'] != null
          ? FighterState.fromJson(json['oponent'])
          : null,
      myPokemon: json['myPokemon'] != null
          ? FighterState.fromJson(json['myPokemon'])
          : null,
      attackEnabled: json['attackEnabled'] ?? false,
    );
  }

  @override
  List<Object?> get props => [opponent, myPokemon, attackEnabled];
}
