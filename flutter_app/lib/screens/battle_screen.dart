import 'package:flutter/material.dart';

class BattleScreen extends StatelessWidget {
  const BattleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Battle'),
      ),
      body: Column(
        children: [
          // Opponent Area
          Expanded(
            child: Container(
              color: Colors.red[50],
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Opponent Pokemon', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  const Icon(Icons.catching_pokemon, size: 80, color: Colors.grey),
                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: LinearProgressIndicator(
                      value: 0.8,
                      backgroundColor: Colors.grey[300],
                      valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                      minHeight: 10,
                    ),
                  ),
                  const Text('HP: 80%'),
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
                  const Text('My Pokemon', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  const Icon(Icons.catching_pokemon, size: 80, color: Colors.blue),
                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: LinearProgressIndicator(
                      value: 1.0,
                      backgroundColor: Colors.grey[300],
                      valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                      minHeight: 10,
                    ),
                  ),
                  const Text('HP: 100%'),
                ],
              ),
            ),
          ),
          // Actions Area
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(onPressed: () {}, child: const Text('Attack')),
                ElevatedButton(onPressed: () {}, child: const Text('Defend')),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.grey),
                  child: const Text('Run'),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
