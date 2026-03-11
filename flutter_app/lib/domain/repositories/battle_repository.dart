import 'dart:async';
import '../entities/battle_event.dart';
import '../entities/battle_state.dart';
import '../entities/pokemon.dart';

abstract class BattleRepository {
  Future<StreamSubscription> connect(
    String nickname,
    List<Pokemon> pokemonList,
  );
  Future<void> attack();
  Stream<BattleEvent> subscribeEvents();
  Stream<BattleState> subscribeState();
}
