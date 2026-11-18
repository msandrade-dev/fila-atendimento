import 'package:fila_atendimento/features/counter/counter_page.dart';
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fila de Atendimento'),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Fila de Atendimento',
                    key: const Key('app-name'),
                    style: Theme.of(context).textTheme.headlineMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Acompanhe filas e demonstrações reativas de atendimento.',
                    key: Key('app-description'),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                  FilledButton.icon(
                    key: const Key('open-demo-button'),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (context) => const CounterPage(),
                        ),
                      );
                    },
                    icon: const Icon(Icons.science_outlined),
                    label: const Text('Acessar demonstração'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
