import 'package:fila_atendimento/features/counter/counter_controller.dart';
import 'package:flutter/material.dart';
import 'package:signals_flutter/signals_flutter.dart';

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  final CounterController controller = CounterController();

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
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
