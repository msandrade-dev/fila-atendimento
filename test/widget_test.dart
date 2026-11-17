// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:fila_atendimento/main.dart';

void main() {
  testWidgets('exibe a tela inicial', (WidgetTester tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    expect(find.text('Fila de Atendimento'), findsOneWidget);
    expect(find.text('Aplicativo em desenvolvimento'), findsOneWidget);
  });
}
