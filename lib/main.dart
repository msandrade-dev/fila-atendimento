import 'package:fila_atendimento/features/home/home_page.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const FilaAtendimentoApp());
}

class FilaAtendimentoApp extends StatelessWidget {
  const FilaAtendimentoApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fila de Atendimento',
      theme: ThemeData(
        // This is the theme of your application.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}
