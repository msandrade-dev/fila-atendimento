import 'package:fila_atendimento/features/queue/queue_controller.dart';
import 'package:flutter/material.dart';
import 'package:signals_flutter/signals_flutter.dart';

class QueuePage extends StatefulWidget {
  const QueuePage({super.key});

  @override
  State<QueuePage> createState() => _QueuePageState();
}

class _QueuePageState extends State<QueuePage> {
  final QueueController controller = QueueController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Meu atendimento'),
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
                  const Text(
                    'Acompanhamento do ticket',
                    key: Key('queue-title'),
                    style: TextStyle(fontSize: 18),
                  ),
                  const SizedBox(height: 16),
                  SignalBuilder(
                    builder: (context) {
                      return Column(
                        children: [
                          Text(
                            'Status: ${controller.ticketStatus.value}',
                            key: const Key('ticket-status'),
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Posição: ${controller.ticketPosition.value}',
                            key: const Key('ticket-position'),
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            controller.isMyTurn.value
                                ? 'É a sua vez'
                                : 'Ainda não é sua vez',
                            key: const Key('ticket-turn'),
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Controles demonstrativos e locais',
                    key: Key('demo-controls-label'),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      OutlinedButton(
                        key: const Key('waiting-button'),
                        onPressed: () => controller.updateStatus('WAITING'),
                        child: const Text('WAITING'),
                      ),
                      FilledButton(
                        key: const Key('called-button'),
                        onPressed: () => controller.updateStatus('CALLED'),
                        child: const Text('CALLED'),
                      ),
                      OutlinedButton(
                        key: const Key('in-service-button'),
                        onPressed: () => controller.updateStatus('IN_SERVICE'),
                        child: const Text('IN_SERVICE'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      OutlinedButton(
                        key: const Key('position-five-button'),
                        onPressed: () => controller.updatePosition(5),
                        child: const Text('Posição 5'),
                      ),
                      OutlinedButton(
                        key: const Key('position-three-button'),
                        onPressed: () => controller.updatePosition(3),
                        child: const Text('Posição 3'),
                      ),
                      OutlinedButton(
                        key: const Key('position-one-button'),
                        onPressed: () => controller.updatePosition(1),
                        child: const Text('Posição 1'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Dados demonstrativos locais; não conectados ao backend.',
                    key: Key('local-data-label'),
                    textAlign: TextAlign.center,
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
