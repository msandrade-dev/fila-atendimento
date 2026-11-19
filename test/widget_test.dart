// This is a basic Flutter widget test.
//
// The tests verify observable UI behavior for HomePage and QueuePage.

import 'package:fila_atendimento/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Future<void> pumpAppAndOpenQueue(WidgetTester tester) async {
  await tester.pumpWidget(const FilaAtendimentoApp());
  await tester.tap(find.byKey(const Key('open-queue-button')));
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('exibe a tela inicial do aplicativo', (tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    expect(find.text('Fila de Atendimento'), findsWidgets);
    expect(find.byKey(const Key('app-description')), findsOneWidget);
    expect(find.byKey(const Key('open-queue-button')), findsOneWidget);
  });

  testWidgets('acessa a QueuePage e retorna à tela inicial', (tester) async {
    await tester.pumpWidget(const FilaAtendimentoApp());

    await tester.tap(find.byKey(const Key('open-queue-button')));
    await tester.pumpAndSettle();

    expect(find.text('Meu atendimento'), findsOneWidget);
    expect(find.byKey(const Key('ticket-status')), findsOneWidget);

    await tester.pageBack();
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('open-queue-button')), findsOneWidget);
  });

  testWidgets('exibe o ticket inicial', (tester) async {
    await pumpAppAndOpenQueue(tester);

    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
      'Status: WAITING',
    );
    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-position'))).data,
      'Posição: 3',
    );
    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-turn'))).data,
      'Ainda não é sua vez',
    );
  });

  testWidgets('atualiza o status para CALLED e indica que é a vez',
      (tester) async {
    await pumpAppAndOpenQueue(tester);

    await tester.ensureVisible(find.byKey(const Key('called-button')));
    await tester.tap(find.byKey(const Key('called-button')));
    await tester.pump();

    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
      'Status: CALLED',
    );
    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-turn'))).data,
      'É a sua vez',
    );
  });

  testWidgets('atualiza o status para IN_SERVICE e remove a indicação de vez',
      (tester) async {
    await pumpAppAndOpenQueue(tester);

    await tester.ensureVisible(find.byKey(const Key('called-button')));
    await tester.tap(find.byKey(const Key('called-button')));
    await tester.pump();

    await tester.ensureVisible(find.byKey(const Key('in-service-button')));
    await tester.tap(find.byKey(const Key('in-service-button')));
    await tester.pump();

    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
      'Status: IN_SERVICE',
    );
    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-turn'))).data,
      'Ainda não é sua vez',
    );
  });

  testWidgets('atualiza a posição do ticket', (tester) async {
    await pumpAppAndOpenQueue(tester);

    await tester.ensureVisible(find.byKey(const Key('position-one-button')));
    await tester.tap(find.byKey(const Key('position-one-button')));
    await tester.pump();

    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-position'))).data,
      'Posição: 1',
    );
  });

  testWidgets('preserva o status CALLED ao atualizar a posição',
      (tester) async {
    await pumpAppAndOpenQueue(tester);

    await tester.ensureVisible(find.byKey(const Key('called-button')));
    await tester.tap(find.byKey(const Key('called-button')));
    await tester.pump();

    expect(find.text('É a sua vez'), findsOneWidget);

    await tester.ensureVisible(find.byKey(const Key('position-five-button')));
    await tester.tap(find.byKey(const Key('position-five-button')));
    await tester.pump();

    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-position'))).data,
      'Posição: 5',
    );
    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
      'Status: CALLED',
    );
    expect(find.text('É a sua vez'), findsOneWidget);
  });

  testWidgets('atualiza a posição para 5 e depois para 3', (tester) async {
    await pumpAppAndOpenQueue(tester);

    await tester.ensureVisible(find.byKey(const Key('position-five-button')));
    await tester.tap(find.byKey(const Key('position-five-button')));
    await tester.pump();

    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-position'))).data,
      'Posição: 5',
    );
    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
      'Status: WAITING',
    );

    await tester.tap(find.byKey(const Key('position-three-button')));
    await tester.pump();

    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-position'))).data,
      'Posição: 3',
    );
    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
      'Status: WAITING',
    );
  });

  testWidgets('retorna o status para WAITING', (tester) async {
    await pumpAppAndOpenQueue(tester);

    await tester.ensureVisible(find.byKey(const Key('called-button')));
    await tester.tap(find.byKey(const Key('called-button')));
    await tester.pump();

    await tester.ensureVisible(find.byKey(const Key('waiting-button')));
    await tester.tap(find.byKey(const Key('waiting-button')));
    await tester.pump();

    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-status'))).data,
      'Status: WAITING',
    );
    expect(
      tester.widget<Text>(find.byKey(const Key('ticket-turn'))).data,
      'Ainda não é sua vez',
    );
  });
}
