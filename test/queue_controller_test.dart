import 'package:fila_atendimento/features/queue/queue_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('QueueController', () {
    test('inicia o ticket aguardando na posição três', () {
      final controller = QueueController();

      expect(controller.ticketStatus.value, 'WAITING');
      expect(controller.ticketPosition.value, 3);
      expect(controller.isMyTurn.value, false);
    });

    test('atualiza o status para CALLED e indica que é a vez', () {
      final controller = QueueController();

      controller.updateStatus('CALLED');

      expect(controller.ticketStatus.value, 'CALLED');
      expect(controller.isMyTurn.value, true);
    });

    test('status diferente de CALLED faz isMyTurn retornar false', () {
      final controller = QueueController();

      controller.updateStatus('CALLED');
      expect(controller.isMyTurn.value, true);

      controller.updateStatus('IN_SERVICE');
      expect(controller.isMyTurn.value, false);
    });

    test('atualiza corretamente a posição do ticket', () {
      final controller = QueueController();

      controller.updatePosition(1);

      expect(controller.ticketPosition.value, 1);
    });

    test('alterar a posição não modifica status nem isMyTurn', () {
      final controller = QueueController();

      controller.updatePosition(5);

      expect(controller.ticketStatus.value, 'WAITING');
      expect(controller.isMyTurn.value, false);

      controller.updateStatus('CALLED');
      controller.updatePosition(0);

      expect(controller.ticketStatus.value, 'CALLED');
      expect(controller.isMyTurn.value, true);
      expect(controller.ticketPosition.value, 0);
    });
  });
}
