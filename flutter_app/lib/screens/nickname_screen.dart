import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/nickname/nickname_bloc.dart';
import '../blocs/nickname/nickname_event.dart';
import '../blocs/nickname/nickname_state.dart';
import '../domain/usecases/get_random_pokemons.dart';

class NicknameScreen extends StatelessWidget {
  const NicknameScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => NicknameBloc(
        getRandomPokemonsUseCase: context.read<GetRandomPokemonsUseCase>(),
      ),
      child: const NicknameView(),
    );
  }
}

class NicknameView extends StatelessWidget {
  const NicknameView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocListener<NicknameBloc, NicknameState>(
      listener: (context, state) {
        final navigator = Navigator.of(context);
        final messenger = ScaffoldMessenger.of(context);

        if (state.status == NicknameStatus.success) {
          navigator.pushNamed('/lobby');
        } else if (state.status == NicknameStatus.failure) {
          messenger.showSnackBar(
            SnackBar(content: Text(state.errorMessage ?? 'Error')),
          );
        }
      },
      child: Scaffold(
        appBar: AppBar(title: const Text('Poke-Albo')),
        drawer: Drawer(
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              const DrawerHeader(
                decoration: BoxDecoration(color: Colors.blue),
                child: Text(
                  'Menu',
                  style: TextStyle(color: Colors.white, fontSize: 24),
                ),
              ),
              ListTile(
                leading: const Icon(Icons.settings),
                title: const Text('Settings'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/settings');
                },
              ),
              ListTile(
                leading: const Icon(Icons.history),
                title: const Text('Battle History'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/history');
                },
              ),
            ],
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              BlocBuilder<NicknameBloc, NicknameState>(
                builder: (context, state) {
                  return TextField(
                    onChanged: (value) {
                      context.read<NicknameBloc>().add(NicknameChanged(value));
                    },
                    decoration: InputDecoration(
                      labelText: 'Enter your Nickname',
                      border: const OutlineInputBorder(),
                      errorText: state.status == NicknameStatus.failure
                          ? state.errorMessage
                          : null,
                    ),
                  );
                },
              ),
              const SizedBox(height: 20),
              BlocBuilder<NicknameBloc, NicknameState>(
                builder: (context, state) {
                  return ElevatedButton(
                    onPressed: state.status == NicknameStatus.loading
                        ? null
                        : () {
                            context.read<NicknameBloc>().add(
                              const NicknameSubmitted(),
                            );
                          },
                    child: state.status == NicknameStatus.loading
                        ? const CircularProgressIndicator()
                        : const Text('Join Lobby'),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
