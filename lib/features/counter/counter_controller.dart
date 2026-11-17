import 'package:signals/signals.dart';

class CounterController {
  CounterController() {
    doubleValue = computed(() => counter.value * 2);
  }

  final counter = signal<int>(0);
  late final Computed<int> doubleValue;

  void increment() {
    counter.value++;
  }

  void decrement() {
    counter.value--;
  }

  void reset() {
    counter.value = 0;
  }
}
