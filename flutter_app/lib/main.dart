import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'data/datasources/pokemon_remote_datasource.dart';
import 'data/repositories/battle_repository_impl.dart';
import 'data/repositories/general_repository_impl.dart';
import 'data/repositories/pokemon_repository_impl.dart';
import 'domain/repositories/battle_repository.dart';
import 'domain/repositories/general_repository.dart';
import 'domain/repositories/pokemon_repository.dart';
import 'domain/usecases/connect_to_battle_use_case.dart';
import 'domain/usecases/get_active_session.dart';
import 'domain/usecases/get_random_pokemons.dart';
import 'screens/nickname_screen.dart';
import 'screens/lobby_screen.dart';
import 'screens/battle_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/history_screen.dart';

void main() {
  const apiUrl = String.fromEnvironment('WEB_FLUTTER_INITIAL_API_URL');
  const wsUrl = String.fromEnvironment('WEB_BATTLE_SERVER');

  if (apiUrl.isEmpty || wsUrl.isEmpty) {
    runApp(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, color: Colors.red, size: 60),
                  const SizedBox(height: 16),
                  const Text(
                    'Faltan variables de entorno críticas',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Asegúrate de definir WEB_FLUTTER_INITIAL_API_URL y WEB_BATTLE_SERVER '
                    'usando --dart-define en el comando de ejecución o compilación.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Valores actuales:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text('API: ${apiUrl.isEmpty ? "FALTANTE" : apiUrl}'),
                  Text('WS: ${wsUrl.isEmpty ? "FALTANTE" : wsUrl}'),
                ],
              ),
            ),
          ),
        ),
      ),
    );
    return;
  }

  runApp(const PokeAlboApp());
}

class PokeAlboApp extends StatelessWidget {
  const PokeAlboApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider<PokemonRepository>(
          create: (context) => PokemonRepositoryImpl(
            remoteDataSource: PokemonRemoteDataSource(),
          ),
        ),
        RepositoryProvider<GeneralRepository>(
          create: (context) => GeneralRepositoryImpl(),
        ),
        RepositoryProvider<GetRandomPokemonsUseCase>(
          create: (context) => GetRandomPokemonsUseCase(
            pokemonRepository: context.read<PokemonRepository>(),
            generalRepository: context.read<GeneralRepository>(),
          ),
        ),
        RepositoryProvider<GetActiveSessionUseCase>(
          create: (context) => GetActiveSessionUseCase(
            generalRepository: context.read<GeneralRepository>(),
          ),
        ),
        RepositoryProvider<BattleRepository>(
          create: (context) => BattleRepositoryImpl(),
        ),
        RepositoryProvider<ConnectToBattleUseCase>(
          create: (context) =>
              ConnectToBattleUseCase(context.read<BattleRepository>()),
        ),
      ],
      child: MaterialApp(
        title: 'Poke-Albo',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.blue,
            brightness: Brightness.light,
          ),
          appBarTheme: const AppBarTheme(centerTitle: true, elevation: 2),
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => const NicknameScreen(),
          '/lobby': (context) => const LobbyScreen(),
          '/battle': (context) => const BattleScreen(),
          '/settings': (context) => const SettingsScreen(),
          '/history': (context) => const HistoryScreen(),
        },
      ),
    );
  }
}
