import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/pokemon_model.dart';
import '../../domain/entities/battle_event.dart';
import '../../domain/entities/battle_state.dart';
import '../../domain/entities/pokemon.dart';
import '../../domain/repositories/battle_repository.dart';
import '../../domain/repositories/general_repository.dart';

class BattleRepositoryImpl implements BattleRepository {
  final GeneralRepository generalRepository;
  WebSocketChannel? _channel;
  final StreamController<BattleEvent> _eventController =
      StreamController<BattleEvent>.broadcast();
  final StreamController<BattleState> _stateController =
      StreamController<BattleState>.broadcast();

  BattleRepositoryImpl({required this.generalRepository});

  String get _wsUrl {
    final savedUrl = generalRepository.getApiUrl();
    if (savedUrl != null && savedUrl.isNotEmpty) {
      // Assuming if API is http://host:port, WS is ws://host:port/ws or similar.
      // In the frontend, VITE_BATTLE_SERVER is a separate env var.
      // However, the user asked to follow the same pattern.
      // Let's check how the frontend does it exactly.
      // Frontend context/BattleContext.tsx uses import.meta.env.VITE_BATTLE_SERVER.
      // But for consistency, if API URL is changed, maybe WS should follow.
      // If the user didn't specify a separate WS input, I'll try to derive it
      // or just stay with the env var if it's more stable.
      // Actually, if they change the API URL to http://192.168.1.5:3001,
      // they probably want WS to be ws://192.168.1.5:3005 (or whatever).
      // Let's stick to derive it if it starts with http, replace with ws.
      try {
        // Usually battle-service is on a different port than backend.
        // Backend (API) is 3001, Battle Service (WS) is 3005 by default.
        // If they only configure ONE URL in settings, we might need to be smart or
        // add another configuration field.
        // Frontend only has "API Endpoint".
        // Let's see what VITE_BATTLE_SERVER is set to in the project.
        return savedUrl.replaceFirst('http', 'ws');
      } catch (e) {
        return const String.fromEnvironment('WEB_BATTLE_SERVER');
      }
    }
    return const String.fromEnvironment('WEB_BATTLE_SERVER');
  }

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
      '$_wsUrl?nickname=$nickname&pokemonList=$pokemonListJson',
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

  @override
  bool get isConnected => _channel != null;
}
