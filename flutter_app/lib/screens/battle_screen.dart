import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/battle/battle_bloc.dart';
import '../blocs/battle/battle_event.dart';
import '../blocs/battle/battle_state.dart';
import '../domain/repositories/battle_repository.dart';
import '../domain/repositories/general_repository.dart';
import '../widgets/gameboy_sp.dart';

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
        if (state.message != null && state.battleResult == BattleResult.none) {
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
        appBar: AppBar(
          title: const Text('Batalla en curso'),
          automaticallyImplyLeading: false,
        ),
        body: BlocBuilder<BattleBloc, BattleState>(
          builder: (context, state) {
            return GameBoySP(
              onAPressed: () => context.read<BattleBloc>().add(const Attack()),
              onBPressed: () =>
                  context.read<BattleBloc>().add(const ExitFight()),
              aEnabled: state.attackEnabled,
              screenContent: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Opponent Area
                  Expanded(
                    child: Container(
                      color: Colors.red[50],
                      alignment: Alignment.center,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (state.battleResult == BattleResult.won ||
                              state.battleResult ==
                                  BattleResult.opponentDesertion)
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                              ),
                              child: Text(
                                state.message ?? '',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green[800],
                                  letterSpacing: 0.5,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            )
                          else ...[
                            Text(
                              state.opponentPokemonName ?? 'Oponente',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 5),
                            _remainingPokemons(state.opponentRemainingPokemons),
                            const SizedBox(height: 5),
                            if (state.opponentPokemonGraphicUrl != null)
                              Image.network(
                                state.opponentPokemonGraphicUrl!,
                                height: 80,
                                errorBuilder: (context, error, stackTrace) =>
                                    const Icon(
                                      Icons.catching_pokemon,
                                      size: 60,
                                    ),
                              )
                            else
                              const Icon(
                                Icons.catching_pokemon,
                                size: 60,
                                color: Colors.grey,
                              ),
                            const SizedBox(height: 5),
                            _hpBar(state.opponentHp),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const Divider(height: 1, thickness: 2, color: Colors.black26),
                  // My Area
                  Expanded(
                    child: Container(
                      color: Colors.blue[50],
                      alignment: Alignment.center,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (state.battleResult == BattleResult.lost)
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                              ),
                              child: Text(
                                state.message ?? '',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.red[800],
                                  letterSpacing: 0.5,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            )
                          else ...[
                            _hpBar(state.myHp),
                            const SizedBox(height: 5),
                            if (state.myPokemonGraphicUrl != null)
                              Image.network(
                                state.myPokemonGraphicUrl!,
                                height: 80,
                                errorBuilder: (context, error, stackTrace) =>
                                    const Icon(
                                      Icons.catching_pokemon,
                                      size: 60,
                                    ),
                              )
                            else
                              const Icon(
                                Icons.catching_pokemon,
                                size: 60,
                                color: Colors.blue,
                              ),
                            const SizedBox(height: 5),
                            _remainingPokemons(state.myRemainingPokemons),
                            const SizedBox(height: 5),
                            Text(
                              state.myPokemonName ?? 'Mi Pokémon',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
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
