import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/battle/battle_bloc.dart';
import '../blocs/battle/battle_event.dart';
import '../blocs/battle/battle_state.dart';
import '../domain/repositories/battle_repository.dart';
import '../domain/repositories/general_repository.dart';

class BattleScreen extends StatelessWidget {
  const BattleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => BattleBloc(
        battleRepository: context.read<BattleRepository>(),
        generalRepository: context.read<GeneralRepository>(),
      )..add(const StartBattle()),
      child: const BattleView(),
    );
  }
}

class BattleView extends StatelessWidget {
  const BattleView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocListener<BattleBloc, BattleState>(
      listenWhen: (previous, current) =>
          previous.message != current.message ||
          previous.shouldExit != current.shouldExit,
      listener: (context, state) {
        if (state.message != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message!),
              duration: const Duration(seconds: 2),
            ),
          );
        }
        if (state.shouldExit) {
          Navigator.of(context).pushNamedAndRemoveUntil('/', (route) => false);
        }
      },
      child: Scaffold(
        appBar: AppBar(title: const Text('Battle')),
        body: Column(
          children: [
            // Opponent Area
            Expanded(
              child: Container(
                color: Colors.red[50],
                child: BlocBuilder<BattleBloc, BattleState>(
                  builder: (context, state) {
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          state.opponentPokemonName ?? 'Opponent',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 10),
                        _remainingPokemons(state.opponentRemainingPokemons),
                        const SizedBox(height: 10),
                        if (state.opponentPokemonGraphicUrl != null)
                          Image.network(
                            state.opponentPokemonGraphicUrl!,
                            height: 120,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(Icons.catching_pokemon, size: 80),
                          )
                        else
                          const Icon(
                            Icons.catching_pokemon,
                            size: 80,
                            color: Colors.grey,
                          ),
                        const SizedBox(height: 10),
                        _hpBar(state.opponentHp),
                      ],
                    );
                  },
                ),
              ),
            ),
            const Divider(height: 1, thickness: 2),
            // My Area
            Expanded(
              child: Container(
                color: Colors.blue[50],
                child: BlocBuilder<BattleBloc, BattleState>(
                  builder: (context, state) {
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _hpBar(state.myHp),
                        const SizedBox(height: 10),
                        if (state.myPokemonGraphicUrl != null)
                          Image.network(
                            state.myPokemonGraphicUrl!,
                            height: 120,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(Icons.catching_pokemon, size: 80),
                          )
                        else
                          const Icon(
                            Icons.catching_pokemon,
                            size: 80,
                            color: Colors.blue,
                          ),
                        const SizedBox(height: 10),
                        _remainingPokemons(state.myRemainingPokemons),
                        const SizedBox(height: 10),
                        Text(
                          state.myPokemonName ?? 'My Pokemon',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),
            // Actions Area
            Container(
              padding: const EdgeInsets.all(16),
              color: Colors.white,
              child: BlocBuilder<BattleBloc, BattleState>(
                builder: (context, state) {
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton(
                        onPressed: !state.attackEnabled
                            ? null
                            : () => context.read<BattleBloc>().add(
                                const Attack(),
                              ),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size(120, 45),
                        ),
                        child: const Text('Attack'),
                      ),
                      ElevatedButton(
                        onPressed: () =>
                            context.read<BattleBloc>().add(const ExitFight()),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.grey,
                          minimumSize: const Size(120, 45),
                        ),
                        child: const Text('Run'),
                      ),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _hpBar(double hp) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        children: [
          LinearProgressIndicator(
            value: hp,
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation<Color>(
              hp > 0.5 ? Colors.green : (hp > 0.2 ? Colors.orange : Colors.red),
            ),
            minHeight: 12,
            borderRadius: BorderRadius.circular(6),
          ),
          const SizedBox(height: 4),
          Text(
            'HP: ${(hp * 100).toStringAsFixed(0)}%',
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _remainingPokemons(int count) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ...List.generate(
          3,
          (index) => Icon(
            Icons.catching_pokemon,
            size: 20,
            color: index < count ? Colors.red : Colors.grey[400],
          ),
        ),
        const SizedBox(width: 8),
        Text(
          '($count/3)',
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
