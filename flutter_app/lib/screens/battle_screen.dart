import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/battle/battle_bloc.dart';
import '../blocs/battle/battle_event.dart';
import '../blocs/battle/battle_state.dart';

class BattleScreen extends StatelessWidget {
  const BattleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => BattleBloc()..add(const StartBattle()),
      child: const BattleView(),
    );
  }
}

class BattleView extends StatelessWidget {
  const BattleView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocListener<BattleBloc, BattleState>(
      listener: (context, state) {
        if (state.message != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message!),
              duration: const Duration(seconds: 1),
            ),
          );
        }
        if (state.status == BattleStatus.finished) {
          Future.delayed(const Duration(seconds: 2), () {
            Navigator.pop(context);
          });
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
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Opponent Pokemon',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    const Icon(
                      Icons.catching_pokemon,
                      size: 80,
                      color: Colors.grey,
                    ),
                    const SizedBox(height: 10),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40),
                      child: BlocBuilder<BattleBloc, BattleState>(
                        buildWhen: (previous, current) =>
                            previous.opponentHp != current.opponentHp,
                        builder: (context, state) {
                          return Column(
                            children: [
                              LinearProgressIndicator(
                                value: state.opponentHp,
                                backgroundColor: Colors.grey[300],
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  state.opponentHp > 0.5
                                      ? Colors.green
                                      : (state.opponentHp > 0.2
                                            ? Colors.orange
                                            : Colors.red),
                                ),
                                minHeight: 10,
                              ),
                              Text(
                                'HP: ${(state.opponentHp * 100).toStringAsFixed(0)}%',
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const Divider(height: 1, thickness: 2),
            // My Area
            Expanded(
              child: Container(
                color: Colors.blue[50],
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'My Pokemon',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    const Icon(
                      Icons.catching_pokemon,
                      size: 80,
                      color: Colors.blue,
                    ),
                    const SizedBox(height: 10),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40),
                      child: BlocBuilder<BattleBloc, BattleState>(
                        buildWhen: (previous, current) =>
                            previous.myHp != current.myHp,
                        builder: (context, state) {
                          return Column(
                            children: [
                              LinearProgressIndicator(
                                value: state.myHp,
                                backgroundColor: Colors.grey[300],
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  state.myHp > 0.5
                                      ? Colors.green
                                      : (state.myHp > 0.2
                                            ? Colors.orange
                                            : Colors.red),
                                ),
                                minHeight: 10,
                              ),
                              Text(
                                'HP: ${(state.myHp * 100).toStringAsFixed(0)}%',
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Actions Area
            Container(
              padding: const EdgeInsets.all(16),
              color: Colors.white,
              child: BlocBuilder<BattleBloc, BattleState>(
                builder: (context, state) {
                  final isLoading = state.status == BattleStatus.finished;
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton(
                        onPressed: isLoading
                            ? null
                            : () => context.read<BattleBloc>().add(
                                const Attack(),
                              ),
                        child: const Text('Attack'),
                      ),
                      ElevatedButton(
                        onPressed: isLoading
                            ? null
                            : () => context.read<BattleBloc>().add(
                                const ExitFight(),
                              ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.grey,
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
}
