import 'package:fila_atendimento/features/queue/queue_page.dart';
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
                    'Acompanhe o status e a posição do seu ticket de atendimento.',
                    key: Key('app-description'),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                  FilledButton.icon(
                    key: const Key('open-queue-button'),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (context) => const QueuePage(),
                        ),
                      );
                    },
                    icon: const Icon(Icons.confirmation_number_outlined),
                    label: const Text('Acompanhar meu ticket'),
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
