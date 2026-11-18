import 'package:signals/signals.dart';

class QueueController {
  final ticketStatus = signal<String>('WAITING');
  final ticketPosition = signal<int>(3);
  late final Computed<bool> isMyTurn;

  QueueController() {
    isMyTurn = computed(() => ticketStatus.value == 'CALLED');
  }

  void updateStatus(String status) {
    ticketStatus.value = status;
  }

  void updatePosition(int position) {
    ticketPosition.value = position;
  }
}
