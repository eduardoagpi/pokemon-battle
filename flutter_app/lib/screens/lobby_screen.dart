import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/lobby/lobby_bloc.dart';
import '../blocs/lobby/lobby_event.dart';
import '../blocs/lobby/lobby_state.dart';
import '../domain/repositories/battle_repository.dart';
import '../domain/usecases/connect_to_battle_use_case.dart';
import '../domain/usecases/get_active_session.dart';

class LobbyScreen extends StatelessWidget {
  const LobbyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => LobbyBloc(
        getActiveSessionUseCase: context.read<GetActiveSessionUseCase>(),
        connectToBattleUseCase: context.read<ConnectToBattleUseCase>(),
        battleRepository: context.read<BattleRepository>(),
      )..add(const StartWaiting()),
      child: const LobbyView(),
    );
  }
}

class LobbyView extends StatelessWidget {
  const LobbyView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocListener<LobbyBloc, LobbyState>(
      listener: (context, state) {
        if (state.status == LobbyStatus.opponentFound) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('¡Oponente encontrado! Iniciando batalla...'),
            ),
          );
          Navigator.of(context).pushNamed('/battle');
        } else if (state.status == LobbyStatus.unauthorized) {
          Navigator.of(context).pushNamedAndRemoveUntil('/', (route) => false);
        }
      },
      child: Scaffold(
        appBar: AppBar(title: const Text('Lobby')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 20),
              BlocBuilder<LobbyBloc, LobbyState>(
                builder: (context, state) {
                  return Text(
                    '¡Bienvenido, ${state.session?.nickname ?? 'Entrenador'}!',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  );
                },
              ),
              const SizedBox(height: 20),
              BlocBuilder<LobbyBloc, LobbyState>(
                builder: (context, state) {
                  if (state.status == LobbyStatus.waiting) {
                    return const CircularProgressIndicator();
                  } else if (state.status == LobbyStatus.opponentFound) {
                    return const Icon(
                      Icons.check_circle,
                      color: Colors.green,
                      size: 60,
                    );
                  }
                  return const SizedBox.shrink();
                },
              ),
              const SizedBox(height: 20),
              BlocBuilder<LobbyBloc, LobbyState>(
                builder: (context, state) {
                  String text = 'Buscando oponente...';
                  if (state.status == LobbyStatus.opponentFound) {
                    text = '¡Partida Lista!';
                  }
                  return Text(
                    text,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  );
                },
              ),
              const SizedBox(height: 40),
              const Text(
                'Tus pokemones asignados:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Expanded(
                child: BlocBuilder<LobbyBloc, LobbyState>(
                  builder: (context, state) {
                    final pokemons = state.session?.pokemons ?? [];
                    return ListView.builder(
                      shrinkWrap: true,
                      itemCount: pokemons.length,
                      itemBuilder: (context, index) {
                        final pokemon = pokemons[index];
                        return ListTile(
                          leading: Image.network(
                            pokemon.spriteUrl,
                            width: 50,
                            height: 50,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(Icons.catching_pokemon),
                          ),
                          title: Text(
                            pokemon.name.toUpperCase(),
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(pokemon.types.join(', ')),
                        );
                      },
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
