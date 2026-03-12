import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/pokemon_model.dart';
import '../../domain/entities/battle_event.dart';
import '../../domain/entities/battle_state.dart';
import '../../domain/entities/pokemon.dart';
import '../../domain/repositories/battle_repository.dart';

class BattleRepositoryImpl implements BattleRepository {
  final String _baseUrl = const String.fromEnvironment('WEB_BATTLE_SERVER');
  WebSocketChannel? _channel;
  final StreamController<BattleEvent> _eventController =
      StreamController<BattleEvent>.broadcast();
  final StreamController<BattleState> _stateController =
      StreamController<BattleState>.broadcast();

  @override
  Future<StreamSubscription> connect(
    String nickname,
    List<Pokemon> pokemonList,
  ) async {
    final pokemonResponseList = pokemonList
        .map((p) => PokemonResponse.fromDomain(p))
        .toList();

    final pokemonListJson = jsonEncode(
      pokemonResponseList.map((p) => p.toJson()).toList(),
    );
    final url = Uri.parse(
      '$_baseUrl?nickname=$nickname&pokemonList=$pokemonListJson',
    );
    _channel = WebSocketChannel.connect(url);

    final subscription = _channel!.stream.listen(
      (message) {
        _handleServerMessage(message);
      },
      onError: (error) {
        print('WebSocket Error: $error');
      },
      onDone: () {
        print('WebSocket Connection Closed');
      },
    );

    return subscription;
  }

  void _handleServerMessage(dynamic message) {
    try {
      final Map<String, dynamic> data = jsonDecode(message);
      final String type = data['type'];

      switch (type) {
        case 'start_battle':
          _eventController.add(const StartBattleEvent());
          break;
        case 'updateBattleStatus':
          final battleState = BattleState.fromJson(data['battleState']);
          _stateController.add(battleState);
          _eventController.add(UpdateBattleStatusEvent(battleState));
          break;
        case 'notify_your_pokemon_defeated':
          _eventController.add(
            MyPokemonDefeatedEvent(data['pokemonDefeated']['pokemonName']),
          );
          break;
        case 'notify_oponent_pokemon_defeated':
          _eventController.add(
            OpponentPokemonDefeatedEvent(
              data['pokemonDefeated']['pokemonName'],
            ),
          );
          break;
        case 'notify_you_won':
          _eventController.add(BattleWonEvent(data['reason']));
          break;
        case 'notify_you_lost':
          _eventController.add(const BattleLostEvent());
          break;
      }
    } catch (e) {
      print('Error parsing server message: $e');
    }
  }

  @override
  Future<void> attack() async {
    if (_channel != null) {
      final message = jsonEncode({'type': 'attack'});
      _channel!.sink.add(message);
    }
  }

  @override
  Stream<BattleEvent> subscribeEvents() => _eventController.stream;

  @override
  Stream<BattleState> subscribeState() => _stateController.stream;
}
