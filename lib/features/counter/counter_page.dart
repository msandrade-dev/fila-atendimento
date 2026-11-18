import 'package:fila_atendimento/features/counter/counter_controller.dart';
import 'package:fila_atendimento/features/queue/queue_controller.dart';
import 'package:flutter/material.dart';
import 'package:signals_flutter/signals_flutter.dart';

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  final CounterController controller = CounterController();
  final QueueController queueController = QueueController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Demonstração Flutter Signals'),
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
                  SignalBuilder(
                    builder: (context) {
                      return Column(
                        children: [
                          const Text(
                            'Contador',
                            style: TextStyle(fontSize: 18),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '${controller.counter.value}',
                            key: const Key('counter-value'),
                            style: Theme.of(context).textTheme.displayMedium,
                          ),
                          const SizedBox(height: 24),
                          const Text(
                            'Dobro',
                            style: TextStyle(fontSize: 18),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '${controller.doubleValue.value}',
                            key: const Key('double-value'),
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 32),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      FilledButton.icon(
                        key: const Key('increment-button'),
                        onPressed: controller.increment,
                        icon: const Icon(Icons.add),
                        label: const Text('Incrementar'),
                      ),
                      OutlinedButton.icon(
                        key: const Key('decrement-button'),
                        onPressed: controller.decrement,
                        icon: const Icon(Icons.remove),
                        label: const Text('Decrementar'),
                      ),
                      TextButton.icon(
                        key: const Key('reset-button'),
                        onPressed: controller.reset,
                        icon: const Icon(Icons.refresh),
                        label: const Text('Zerar'),
                      ),
                    ],
                  ),
                  const Divider(height: 64),
                  const Text(
                    'Meu ticket',
                    style: TextStyle(fontSize: 18),
                  ),
                  const SizedBox(height: 16),
                  SignalBuilder(
                    builder: (context) {
                      return Column(
                        children: [
                          Text(
                            'Status: ${queueController.ticketStatus.value}',
                            key: const Key('ticket-status'),
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Posição: ${queueController.ticketPosition.value}',
                            key: const Key('ticket-position'),
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            queueController.isMyTurn.value
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
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      OutlinedButton(
                        key: const Key('waiting-button'),
                        onPressed: () =>
                            queueController.updateStatus('WAITING'),
                        child: const Text('WAITING'),
                      ),
                      FilledButton(
                        key: const Key('called-button'),
                        onPressed: () => queueController.updateStatus('CALLED'),
                        child: const Text('CALLED'),
                      ),
                      OutlinedButton(
                        key: const Key('in-service-button'),
                        onPressed: () =>
                            queueController.updateStatus('IN_SERVICE'),
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
                        onPressed: () => queueController.updatePosition(5),
                        child: const Text('Posição 5'),
                      ),
                      OutlinedButton(
                        key: const Key('position-three-button'),
                        onPressed: () => queueController.updatePosition(3),
                        child: const Text('Posição 3'),
                      ),
                      OutlinedButton(
                        key: const Key('position-one-button'),
                        onPressed: () => queueController.updatePosition(1),
                        child: const Text('Posição 1'),
                      ),
                    ],
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
