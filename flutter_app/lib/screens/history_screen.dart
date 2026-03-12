import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/history/history_bloc.dart';
import '../blocs/history/history_event.dart';
import '../blocs/history/history_state.dart';
import '../domain/entities/battle_history_item.dart';
import '../domain/usecases/get_battle_history_usecase.dart';
import '../utils/date_formatter.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => HistoryBloc(
        getBattleHistoryUseCase: context.read<GetBattleHistoryUseCase>(),
      ),
      child: const HistoryView(),
    );
  }
}

class HistoryView extends StatefulWidget {
  const HistoryView({super.key});

  @override
  State<HistoryView> createState() => _HistoryViewState();
}

class _HistoryViewState extends State<HistoryView> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Historial de Batallas')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Search Section
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    onChanged: (value) {
                      context.read<HistoryBloc>().add(
                        SearchNicknameChanged(value),
                      );
                    },
                    decoration: const InputDecoration(
                      labelText: 'Nickname del jugador',
                      hintText: 'Ej. AshKetchum',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {
                    context.read<HistoryBloc>().add(const SearchHistory());
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _controller.clear();
                    context.read<HistoryBloc>().add(const ClearHistory());
                  },
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Results Section
            Expanded(
              child: BlocBuilder<HistoryBloc, HistoryState>(
                builder: (context, state) {
                  if (state.status == HistoryStatus.loading) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (state.status == HistoryStatus.failure) {
                    return Center(
                      child: Text(
                        'Error: ${state.errorMessage}',
                        style: const TextStyle(color: Colors.red),
                      ),
                    );
                  }

                  if (state.status == HistoryStatus.empty) {
                    return const Center(
                      child: Text(
                        'No se han encontrado batallas para este jugador.',
                      ),
                    );
                  }

                  if (state.status == HistoryStatus.initial &&
                      state.historyResults.isEmpty) {
                    return const Center(
                      child: Text(
                        'Ingresa un nickname para buscar el historial.',
                      ),
                    );
                  }

                  return ListView.builder(
                    itemCount: state.historyResults.length,
                    itemBuilder: (context, index) {
                      final item = state.historyResults[index];
                      return _HistoryItemTile(item: item);
                    },
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

class _HistoryItemTile extends StatelessWidget {
  final BattleHistoryItem item;

  const _HistoryItemTile({required this.item});

  @override
  Widget build(BuildContext context) {
    final isWin = item.result == 'win';
    final resultText = isWin ? 'Victoria' : 'Derrota';

    String reasonText = '';
    if (item.reason != null) {
      reasonText = item.reason == 'combat' ? 'Combate' : 'Deserción';
    }

    final color = isWin ? Colors.green : Colors.red;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  resultText.toUpperCase(),
                  style: TextStyle(
                    color: color,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
                Text(
                  formatDateSpanish(item.date),
                  style: const TextStyle(
                    fontSize: 10,
                    color: Colors.grey,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                RichText(
                  text: TextSpan(
                    style: const TextStyle(color: Colors.black, fontSize: 16),
                    children: [
                      const TextSpan(text: 'vs'),
                      TextSpan(
                        text: item.opponentNickname,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
                if (reasonText.isNotEmpty)
                  Text(
                    reasonText,
                    style: const TextStyle(
                      fontSize: 12,
                      fontStyle: FontStyle.italic,
                      color: Colors.black54,
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
