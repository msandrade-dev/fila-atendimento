# Fila de Atendimento

Aplicativo móvel para gerenciamento de filas de atendimento em um único estabelecimento, desenvolvido como projeto acadêmico da UFBA. O objetivo é oferecer uma solução simples para clientes entrarem na fila e acompanharem sua posição, além de permitir o controle da fila pelo estabelecimento.

## Status do projeto

> **Em desenvolvimento — MVP com frontend Flutter em fase inicial.**

No estado atual, o projeto contém a estrutura base de um aplicativo Flutter e a tela inicial. As funcionalidades de filas, backend, banco de dados e atualização em tempo real estão planejadas para as próximas etapas.

## Funcionalidades planejadas para o MVP

### Para clientes

- Entrar em uma fila sem cadastro obrigatório
- Informar o nome ou identificador necessário no atendimento
- Receber uma posição na fila
- Acompanhar a posição e o status do atendimento
- Receber atualização automática da fila
- Visualizar a confirmação de chamada

### Para o estabelecimento

- Visualizar a fila em tempo real
- Chamar o próximo cliente
- Iniciar e finalizar atendimentos
- Cancelar ou remanejar um atendimento
- Gerenciar o status da fila
- Visualizar o histórico básico de atendimentos

## Escopo

O MVP foi planejado para:

- Um único estabelecimento
- Operação sem cadastro obrigatório de clientes
- Comunicação pela rede local ou pela internet
- Interface móvel inicial em Android
- Arquitetura preparada para futuras versões em iOS
- Organização por responsabilidades para facilitar manutenção e evolução

## Tecnologias

### Aplicação atual

- [Flutter](https://flutter.dev/) 3.24.3
- Dart 3.5.3 ou superior conforme a restrição `^3.5.3`
- Material 3
- `cupertino_icons`
- `flutter_test` e `flutter_lints` para testes e análise

### Planejamento da arquitetura

- **Frontend:** Flutter
- **Estado reativo:** Signals
- **Backend:** Node.js com Fastify
- **Banco de dados:** PostgreSQL
- **Comunicação:** REST e WebSocket
- **Plataforma inicial:** Android
- **Compatibilidade futura:** iOS

Os componentes de backend, banco de dados, Signals, REST e WebSocket ainda não estão implementados neste estágio do projeto.

## Interface atual

A tela inicial apresenta:

- Barra superior com o título `Fila de Atendimento`
- Mensagem central `Aplicativo em desenvolvimento`
- Tema Material 3 com `ColorScheme` baseado na cor índigo

## Estrutura do projeto

```text
.
├── android/                 # Projeto Android gerado pelo Flutter
├── ios/                     # Projeto iOS preparado para compilação futura
├── lib/
│   └── main.dart            # Inicialização do app e tela inicial
├── linux/                   # Projeto para execução desktop Linux
├── macos/                   # Projeto para execução desktop macOS
├── test/
│   └── widget_test.dart     # Teste da tela inicial
├── web/                     # Projeto para execução web
├── windows/                 # Projeto para execução desktop Windows
├── analysis_options.yaml    # Regras de análise do Dart
├── pubspec.yaml             # Dependências e metadados do aplicativo
└── README.md
```

Conforme o projeto crescer, telas, modelos, serviços e gerenciamento de estado devem ser separados em arquivos e diretórios específicos dentro de `lib/`.

## Pré-requisitos

Para executar o frontend localmente, instale:

- Flutter 3.24.3 ou uma versão compatível com o Dart configurado no projeto
- Android Studio ou VS Code com a extensão Flutter
- Android SDK e um dispositivo físico ou emulador
- Git

Verifique o ambiente Flutter:

```bash
flutter doctor
```

## Instalação e execução

Clone o repositório:

```bash
git clone https://github.com/msandrade-dev/fila-atendimento.git
cd fila-atendimento
```

Instale as dependências:

```bash
flutter pub get
```

Execute o aplicativo:

```bash
flutter run
```

Para executar em uma plataforma ou dispositivo específico:

```bash
flutter devices
flutter run -d <id-do-dispositivo>
```

## Testes e qualidade

Execute a análise estática:

```bash
flutter analyze
```

Execute todos os testes:

```bash
flutter test
```

Execute apenas o teste de widget:

```bash
flutter test test/widget_test.dart
```

Execute um teste pelo nome:

```bash
flutter test test/widget_test.dart --plain-name "exibe a tela inicial"
```

## Build

Gerar APK Android:

```bash
flutter build apk
```

O artefato gerado ficará, normalmente, em:

```text
build/app/outputs/flutter-apk/app-release.apk
```

## Organização da implementação futura

A evolução recomendada separa o projeto nas seguintes responsabilidades:

- **UI:** widgets e telas do aplicativo
- **Estado:** Signals e estado reativo da interface
- **Modelos:** representação de cliente, fila e atendimento
- **Serviços:** comunicação REST e WebSocket
- **Backend:** regras de negócio e validações
- **Persistência:** operações com PostgreSQL

Essa separação permite testar e substituir componentes sem acoplamento excessivo entre interface e infraestrutura.

## Possíveis fluxos do sistema

### Fluxo básico do cliente

```text
Cliente solicita entrada na fila
        ↓
Sistema registra o atendimento
        ↓
Cliente recebe número e posição
        ↓
Sistema atualiza a posição em tempo real
        ↓
Cliente recebe a chamada do atendimento
        ↓
Atendimento é iniciado e finalizado
```

### Fluxo básico do estabelecimento

```text
Estabelecimento abre a fila
        ↓
Visualiza clientes aguardando
        ↓
Chama o próximo cliente
        ↓
Atualiza o status do atendimento
        ↓
Finaliza ou cancela o atendimento
        ↓
Sistema atualiza a fila para todos os participantes
```

## Convenções de desenvolvimento

- Utilizar Dart seguindo as regras do `flutter_lints`
- Preferir construtores `const` sempre que os valores forem conhecidos em tempo de compilação
- Preservar o uso de Material 3
- Manter as mensagens da interface em português
- Utilizar imports por pacote em testes, como `package:fila_atendimento/...`
- Colocar novas telas e componentes em arquivos próprios dentro de `lib/`
- Adicionar testes para comportamentos visíveis e regras importantes
- Não versionar diretórios de build, caches ou artefatos gerados

## Repositório e colaboração

Repositório GitHub:

- https://github.com/msandrade-dev/fila-atendimento

Antes de enviar alterações:

```bash
flutter analyze
flutter test
```

Envie uma alteração por meio de uma branch:

```bash
git switch -c feature/nome-da-funcionalidade
git add .
git commit -m "Descrição breve da alteração"
git push -u origin feature/nome-da-funcionalidade
```

Em seguida, abra um Pull Request no GitHub para revisão.

## Melhorias futuras

Além do MVP, o projeto pode evoluir com:

- Múltiplas filas e categorias de atendimento
- Senhas ou códigos de identificação
- Autenticação opcional para funcionários
- Painel administrativo
- Histórico e estatísticas de atendimento
- Tempo médio estimado por atendimento
- Notificações de chamada
- Publicação em iOS
- Configuração por estabelecimento
- Implantação do backend em ambiente de nuvem

## Licença

Este projeto ainda não possui uma licença definida.
