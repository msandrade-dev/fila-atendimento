// This is a basic Flutter widget test.
//
// The tests verify observable UI behavior for the counter and ticket demos.

import 'package:fila_atendimento/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('exibe o estado inicial da demonstração', (tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    expect(find.text('Demonstração Flutter Signals'), findsOneWidget);
    expect(
        tester.widget<Text>(find.byKey(const Key('counter-value'))).data, '0');
    expect(
        tester.widget<Text>(find.byKey(const Key('double-value'))).data, '0');
    expect(tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
        'Status: WAITING');
    expect(tester.widget<Text>(find.byKey(const Key('ticket-position'))).data,
        'Posição: 3');
    expect(tester.widget<Text>(find.byKey(const Key('ticket-turn'))).data,
        'Ainda não é sua vez');
  });

  testWidgets('incrementa o contador e atualiza o dobro', (tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    await tester.tap(find.byKey(const Key('increment-button')));
    await tester.pump();

    expect(
        tester.widget<Text>(find.byKey(const Key('counter-value'))).data, '1');
    expect(
        tester.widget<Text>(find.byKey(const Key('double-value'))).data, '2');
  });

  testWidgets('decrementa o contador e atualiza o dobro', (tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    await tester.tap(find.byKey(const Key('decrement-button')));
    await tester.pump();

    expect(
        tester.widget<Text>(find.byKey(const Key('counter-value'))).data, '-1');
    expect(
        tester.widget<Text>(find.byKey(const Key('double-value'))).data, '-2');
  });

  testWidgets('zera o contador e o valor computado', (tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    await tester.tap(find.byKey(const Key('increment-button')));
    await tester.tap(find.byKey(const Key('increment-button')));
    await tester.pump();

    expect(
        tester.widget<Text>(find.byKey(const Key('counter-value'))).data, '2');
    expect(
        tester.widget<Text>(find.byKey(const Key('double-value'))).data, '4');

    await tester.tap(find.byKey(const Key('reset-button')));
    await tester.pump();

    expect(
        tester.widget<Text>(find.byKey(const Key('counter-value'))).data, '0');
    expect(
        tester.widget<Text>(find.byKey(const Key('double-value'))).data, '0');
  });

  testWidgets('atualiza o status para CALLED e indica que é a vez',
      (tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    await tester.ensureVisible(find.byKey(const Key('called-button')));
    await tester.tap(find.byKey(const Key('called-button')));
    await tester.pump();

    expect(tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
        'Status: CALLED');
    expect(tester.widget<Text>(find.byKey(const Key('ticket-turn'))).data,
        'É a sua vez');
  });

  testWidgets('status diferente de CALLED remove a indicação de vez',
      (tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    await tester.ensureVisible(find.byKey(const Key('called-button')));
    await tester.tap(find.byKey(const Key('called-button')));
    await tester.pump();
    await tester.ensureVisible(find.byKey(const Key('in-service-button')));
    await tester.tap(find.byKey(const Key('in-service-button')));
    await tester.pump();

    expect(tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
        'Status: IN_SERVICE');
    expect(tester.widget<Text>(find.byKey(const Key('ticket-turn'))).data,
        'Ainda não é sua vez');

    await tester.ensureVisible(find.byKey(const Key('waiting-button')));
    await tester.tap(find.byKey(const Key('waiting-button')));
    await tester.pump();

    expect(tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
        'Status: WAITING');
  });

  testWidgets('atualiza visualmente a posição do ticket', (tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    await tester.ensureVisible(find.byKey(const Key('position-one-button')));
    await tester.tap(find.byKey(const Key('position-one-button')));
    await tester.pump();

    expect(tester.widget<Text>(find.byKey(const Key('ticket-position'))).data,
        'Posição: 1');
  });
}
