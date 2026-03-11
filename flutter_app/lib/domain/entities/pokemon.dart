import 'package:equatable/equatable.dart';

class Pokemon extends Equatable {
  final int id;
  final String name;
  final List<String> types;
  final int hp;
  final int attack;
  final int defense;
  final int speed;
  final String spriteUrl;

  const Pokemon({
    required this.id,
    required this.name,
    required this.types,
    required this.hp,
    required this.attack,
    required this.defense,
    required this.speed,
    required this.spriteUrl,
  });

  @override
  List<Object?> get props => [
    id,
    name,
    types,
    hp,
    attack,
    defense,
    speed,
    spriteUrl,
  ];
}

class PokemonListItem extends Equatable {
  final int id;
  final String name;

  const PokemonListItem({required this.id, required this.name});

  @override
  List<Object?> get props => [id, name];
}
