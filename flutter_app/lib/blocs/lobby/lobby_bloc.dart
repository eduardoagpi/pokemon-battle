import 'dart:math';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'lobby_event.dart';
import 'lobby_state.dart';

class LobbyBloc extends Bloc<LobbyEvent, LobbyState> {
  LobbyBloc() : super(const LobbyState()) {
    on<StartWaiting>(_onStartWaiting);
    on<OpponentJoined>(_onOpponentJoined);
  }

  final List<String> _pokemonPool = [
    'Pikachu',
    'Charmander',
    'Squirtle',
    'Bulbasaur',
    'Eevee',
    'Snorlax',
    'Mewtwo',
    'Lucario',
    'Gengar',
    'Dragonite',
  ];

  void _onStartWaiting(StartWaiting event, Emitter<LobbyState> emit) async {
    // Randomly assign 3 pokemons
    final random = Random();
    final team = List.generate(
      3,
      (_) => _pokemonPool[random.nextInt(_pokemonPool.length)],
    );

    emit(state.copyWith(status: LobbyStatus.waiting, team: team));

    // Simulate waiting for an opponent
    await Future.delayed(const Duration(seconds: 3));
    add(const OpponentJoined());
  }

  void _onOpponentJoined(OpponentJoined event, Emitter<LobbyState> emit) {
    emit(state.copyWith(status: LobbyStatus.opponentFound));
  }
}
