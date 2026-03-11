import 'dart:math';
import '../entities/user_session.dart';
import '../repositories/pokemon_repository.dart';
import '../repositories/general_repository.dart';

class GetRandomPokemonsUseCase {
  final PokemonRepository pokemonRepository;
  final GeneralRepository generalRepository;

  GetRandomPokemonsUseCase({
    required this.pokemonRepository,
    required this.generalRepository,
  });

  Future<UserSession> execute(String nickname) async {
    // 1. Get available pokemons
    final allPokemons = await pokemonRepository.getPokemonList();

    if (allPokemons.isEmpty) {
      throw Exception('No pokemons available');
    }

    // 2. Select 3 random unique pokemons
    final random = Random();
    final selectedIndices = <int>{};
    while (selectedIndices.length < 3 &&
        selectedIndices.length < allPokemons.length) {
      selectedIndices.add(random.nextInt(allPokemons.length));
    }

    final selectedListItems = selectedIndices
        .map((i) => allPokemons[i])
        .toList();

    // 3. Concurrently get details for each
    final pokemonDetailsFutures = selectedListItems.map(
      (item) => pokemonRepository.getPokemonDetails(item.id),
    );

    final selectedPokemons = await Future.wait(pokemonDetailsFutures);

    // 4. Create session
    final session = UserSession(nickname: nickname, pokemons: selectedPokemons);

    // 5. Save session
    generalRepository.saveSession(session);

    return session;
  }
}
