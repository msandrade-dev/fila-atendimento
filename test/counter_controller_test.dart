import 'package:fila_atendimento/features/counter/counter_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('CounterController', () {
    test('inicia o contador em zero', () {
      final controller = CounterController();

      expect(controller.counter.value, 0);
      expect(controller.doubleValue.value, 0);
    });

    test('incrementa o contador', () {
      final controller = CounterController();

      controller.increment();

      expect(controller.counter.value, 1);
    });

    test('decrementa o contador', () {
      final controller = CounterController();

      controller.decrement();

      expect(controller.counter.value, -1);
    });

    test('zera o contador', () {
      final controller = CounterController();
      controller.increment();
      controller.increment();

      controller.reset();

      expect(controller.counter.value, 0);
    });

    test('atualiza automaticamente o valor computado', () {
      final controller = CounterController();

      controller.increment();
      controller.increment();
      expect(controller.doubleValue.value, 4);

      controller.decrement();
      expect(controller.doubleValue.value, 2);

      controller.reset();
      expect(controller.doubleValue.value, 0);
    });
  });
}
