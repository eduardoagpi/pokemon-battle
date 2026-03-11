import 'dart:async';
import '../entities/pokemon.dart';
import '../repositories/battle_repository.dart';

class ConnectToBattleUseCase {
  final BattleRepository repository;

  ConnectToBattleUseCase(this.repository);

  Future<StreamSubscription> call(String nickname, List<Pokemon> pokemonList) {
    return repository.connect(nickname, pokemonList);
  }
}
