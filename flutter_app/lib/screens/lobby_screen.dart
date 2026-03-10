import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/lobby/lobby_bloc.dart';
import '../blocs/lobby/lobby_event.dart';
import '../blocs/lobby/lobby_state.dart';

class LobbyScreen extends StatelessWidget {
  const LobbyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => LobbyBloc()..add(const StartWaiting()),
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
            const SnackBar(content: Text('Opponent found! Opening battle...')),
          );
          Future.delayed(const Duration(seconds: 1), () {
            Navigator.pushNamed(context, '/battle');
          });
        }
      },
      child: Scaffold(
        appBar: AppBar(title: const Text('Lobby')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
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
                  String text = 'Finding match...';
                  if (state.status == LobbyStatus.opponentFound) {
                    text = 'Match Ready!';
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
              const Text('Your Team:'),
              const SizedBox(height: 10),
              Expanded(
                child: BlocBuilder<LobbyBloc, LobbyState>(
                  builder: (context, state) {
                    return ListView.builder(
                      shrinkWrap: true,
                      itemCount: state.team.length,
                      itemBuilder: (context, index) {
                        return ListTile(
                          leading: const Icon(Icons.catching_pokemon),
                          title: Text(state.team[index]),
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
