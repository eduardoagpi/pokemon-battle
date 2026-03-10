import 'package:flutter/material.dart';

class LobbyScreen extends StatelessWidget {
  const LobbyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lobby'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(),
            const SizedBox(height: 20),
            const Text(
              'Finding match...',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 40),
            const Text('Your Team:'),
            const SizedBox(height: 10),
            Expanded(
              child: ListView(
                shrinkWrap: true,
                children: const [
                  ListTile(
                    leading: Icon(Icons.catching_pokemon),
                    title: Text('Pikachu'),
                  ),
                  ListTile(
                    leading: Icon(Icons.catching_pokemon),
                    title: Text('Charmander'),
                  ),
                  ListTile(
                    leading: Icon(Icons.catching_pokemon),
                    title: Text('Squirtle'),
                  ),
                ],
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/battle');
              },
              child: const Text('Start Battle (Simulated)'),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
