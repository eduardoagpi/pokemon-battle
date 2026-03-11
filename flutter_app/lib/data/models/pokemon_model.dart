import '../../domain/entities/pokemon.dart';

class PokemonResponse {
  final int id;
  final String name;
  final List<String> types;
  final int hp;
  final int attack;
  final int defense;
  final int speed;
  final String spriteUrl;

  const PokemonResponse({
    required this.id,
    required this.name,
    required this.types,
    required this.hp,
    required this.attack,
    required this.defense,
    required this.speed,
    required this.spriteUrl,
  });

  factory PokemonResponse.fromJson(Map<String, dynamic> json) {
    return PokemonResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      types: (json['type'] as List<dynamic>).map((e) => e as String).toList(),
      hp: json['hp'] as int,
      attack: json['attack'] as int,
      defense: json['defense'] as int,
      speed: json['speed'] as int,
      spriteUrl: json['sprite'] as String,
    );
  }

  factory PokemonResponse.fromDomain(Pokemon pokemon) {
    return PokemonResponse(
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      speed: pokemon.speed,
      spriteUrl: pokemon.spriteUrl,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': types,
      'hp': hp,
      'attack': attack,
      'defense': defense,
      'speed': speed,
      'sprite': spriteUrl,
    };
  }

  Pokemon toDomain() {
    return Pokemon(
      id: id,
      name: name,
      types: types,
      hp: hp,
      attack: attack,
      defense: defense,
      speed: speed,
      spriteUrl: spriteUrl,
    );
  }
}

class PokemonListItemResponse {
  final int id;
  final String name;

  const PokemonListItemResponse({required this.id, required this.name});

  factory PokemonListItemResponse.fromJson(Map<String, dynamic> json) {
    return PokemonListItemResponse(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }

  factory PokemonListItemResponse.fromDomain(PokemonListItem item) {
    return PokemonListItemResponse(id: item.id, name: item.name);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }

  PokemonListItem toDomain() {
    return PokemonListItem(id: id, name: name);
  }
}
