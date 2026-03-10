import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/settings/settings_bloc.dart';
import '../blocs/settings/settings_event.dart';
import '../blocs/settings/settings_state.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => SettingsBloc()..add(const LoadSettings()),
      child: const SettingsView(),
    );
  }
}

class SettingsView extends StatelessWidget {
  const SettingsView({super.key});

  @override
  Widget build(BuildContext context) {
    final TextEditingController controller = TextEditingController();

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BlocBuilder<SettingsBloc, SettingsState>(
          builder: (context, state) {
            if (state.status == SettingsStatus.loading) {
              return const Center(child: CircularProgressIndicator());
            }

            // Sync controller with state initially
            if (controller.text.isEmpty && state.baseUrlPath.isNotEmpty) {
              controller.text = state.baseUrlPath;
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'API Configuration',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: controller,
                  onChanged: (value) {
                    context.read<SettingsBloc>().add(UpdateBaseUrl(value));
                  },
                  decoration: const InputDecoration(
                    labelText: 'API URL',
                    border: OutlineInputBorder(),
                    hintText: 'http://localhost:3000',
                  ),
                ),
                const SizedBox(height: 20),
                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Settings Saved')),
                      );
                    },
                    child: const Text('Confirm'),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
