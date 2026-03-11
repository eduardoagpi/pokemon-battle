import 'package:equatable/equatable.dart';
import 'pokemon.dart';

class UserSession extends Equatable {
  final String nickname;
  final List<Pokemon> pokemons;

  const UserSession({required this.nickname, required this.pokemons});

  @override
  List<Object?> get props => [nickname, pokemons];
}
