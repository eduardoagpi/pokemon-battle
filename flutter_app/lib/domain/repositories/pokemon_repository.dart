import '../entities/pokemon.dart';

abstract class PokemonRepository {
  Future<List<PokemonListItem>> getPokemonList();
  Future<Pokemon> getPokemonDetails(int id);
}
