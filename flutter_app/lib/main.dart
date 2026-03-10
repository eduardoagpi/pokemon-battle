import 'package:flutter/material.dart';
import 'screens/nickname_screen.dart';
import 'screens/lobby_screen.dart';
import 'screens/battle_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/history_screen.dart';

void main() {
  runApp(const PokeAlboApp());
}

class PokeAlboApp extends StatelessWidget {
  const PokeAlboApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Poke-Albo',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
          brightness: Brightness.light,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 2,
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const NicknameScreen(),
        '/lobby': (context) => const LobbyScreen(),
        '/battle': (context) => const BattleScreen(),
        '/settings': (context) => const SettingsScreen(),
        '/history': (context) => const HistoryScreen(),
      },
    );
  }
}
