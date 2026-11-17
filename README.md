# Fila de Atendimento

Aplicativo móvel para gerenciamento de filas de atendimento em um único estabelecimento, desenvolvido como projeto acadêmico da Universidade Federal da Bahia (UFBA).

O objetivo é oferecer uma solução simples para clientes entrarem em uma fila sem necessidade de cadastro obrigatório e acompanharem seu atendimento, enquanto o estabelecimento gerencia a fila e controla o andamento dos serviços.

## Status do projeto

**Em desenvolvimento — MVP com frontend Flutter em fase inicial.**

Atualmente, o projeto possui a estrutura inicial de um aplicativo Flutter, uma tela de apresentação e testes automatizados básicos.

A execução do frontend já foi validada no navegador Google Chrome. A validação em dispositivo Android permanece pendente.

As funcionalidades de gerenciamento de filas, autenticação, backend, banco de dados e comunicação em tempo real estão planejadas para as próximas etapas.

## Objetivos do MVP

Desenvolver uma aplicação que permita:

- Organizar a fila de atendimento de um estabelecimento.
- Permitir que clientes ingressem na fila sem cadastro obrigatório.
- Gerar senhas sequenciais diariamente.
- Permitir o acompanhamento da posição e do status do atendimento.
- Disponibilizar ferramentas de gerenciamento para atendentes e administradores.
- Manter os dados centralizados para compartilhamento entre diferentes dispositivos.
- Atualizar as informações da fila para os participantes por meio de comunicação em tempo real.

## Funcionalidades planejadas para o MVP

### Para clientes

- Entrar na fila quando ela estiver aberta.
- Informar o nome ou identificador necessário para o atendimento.
- Receber uma senha sequencial.
- Receber um mecanismo de acesso privado para acompanhar seu atendimento.
- Consultar a posição na fila.
- Acompanhar o status do atendimento.
- Cancelar sua participação enquanto ainda estiver aguardando.
- Visualizar a confirmação de chamada para atendimento.

Não será obrigatório criar uma conta para participar da fila.

### Para atendentes

- Visualizar os clientes que aguardam atendimento.
- Consultar a situação atual da fila.
- Chamar o próximo cliente, respeitando a ordem de entrada.
- Iniciar um atendimento.
- Finalizar um atendimento.
- Registrar a ausência de um cliente chamado.
- Consultar informações básicas dos atendimentos do dia.

Os atendentes deverão estar autenticados e vinculados ao estabelecimento.

### Para administradores

- Configurar as informações do estabelecimento.
- Abrir, pausar e fechar a fila.
- Gerenciar os atendentes.
- Consultar o histórico básico de atendimentos.
- Executar as operações disponíveis aos atendentes.

O administrador também poderá atuar como atendente.

## Regras de negócio definidas para o MVP

As seguintes regras orientam a implementação do sistema:

### Funcionamento da fila

- O MVP contempla um único estabelecimento e uma fila inicial.
- A entrada de novos clientes somente será permitida quando a fila estiver aberta.
- A ordem de atendimento seguirá o princípio FIFO (*First In, First Out*), respeitando a ordem de entrada.
- As senhas serão sequenciais e reiniciadas diariamente.
- A posição do cliente será calculada a partir da situação atual da fila, não sendo armazenada como informação fixa.
- A fila poderá assumir os estados `OPEN`, `PAUSED` e `CLOSED`.

### Estados dos atendimentos

Cada atendimento poderá assumir um dos seguintes estados:

| Estado | Descrição |
|---|---|
| `WAITING` | Cliente aguardando atendimento |
| `CALLED` | Cliente chamado pelo atendente |
| `IN_SERVICE` | Atendimento em andamento |
| `COMPLETED` | Atendimento finalizado |
| `CANCELLED` | Participação cancelada pelo cliente enquanto aguardava |
| `NO_SHOW` | Cliente não compareceu após ser chamado |

### Controle dos atendimentos

- Somente um atendimento poderá estar chamado ou em execução por vez em uma mesma fila e data.
- O cliente somente poderá cancelar sua participação enquanto estiver aguardando.
- A ausência será registrada quando o cliente não comparecer após ser chamado.
- As operações de alteração de estado deverão respeitar as regras de negócio.
- O backend será responsável por controlar concorrência, consistência e integridade das operações.
- Os eventos importantes dos atendimentos deverão ser registrados para permitir a consulta do histórico.

### Segurança e acesso

- Clientes não precisarão criar contas para entrar na fila.
- O acompanhamento individual será realizado por meio de um token secreto aleatório.
- O backend armazenará o hash do token, e não seu valor original.
- Atendentes e administradores deverão utilizar autenticação.
- As permissões de acesso serão verificadas pelo backend.

## Escopo do MVP

O primeiro estágio do produto será limitado a:

- Um único estabelecimento.
- Uma fila inicial.
- Clientes sem cadastro obrigatório.
- Atendentes e administradores autenticados.
- Aplicativo móvel com desenvolvimento inicial voltado para Android.
- Arquitetura preparada para futura compatibilidade com iOS.
- Dados centralizados em PostgreSQL.
- Comunicação entre frontend e backend por API REST.
- Atualizações da fila em tempo real por WebSocket.

### Funcionalidades fora do MVP

Não fazem parte da primeira versão:

- Agendamento de atendimentos.
- Pagamentos.
- Múltiplos estabelecimentos ou filiais.
- Múltiplas filas simultâneas.
- Inteligência artificial.
- Relatórios avançados.
- Notificações push.
- Integração com WhatsApp.

Essas funcionalidades poderão ser avaliadas em versões futuras.

## Tecnologias

### Aplicação atual

| Tecnologia | Finalidade |
|---|---|
| Flutter 3.24.3 | Desenvolvimento da aplicação |
| Dart SDK `^3.5.3` | Linguagem de programação |
| Material 3 | Componentes e identidade visual |
| `cupertino_icons` | Ícones |
| `flutter_test` | Testes automatizados |
| `flutter_lints` | Análise estática e boas práticas |

O gerenciamento de estado com Signals está definido para a arquitetura do frontend, mas sua integração ainda está pendente.

### Arquitetura planejada

| Componente | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | Flutter | Interface e interação com o usuário |
| Estado reativo | Signals | Gerenciamento do estado da aplicação |
| Backend | Node.js + TypeScript + Fastify | API e regras de negócio |
| Banco de dados | PostgreSQL | Persistência centralizada |
| Comunicação | REST | Requisições e operações da aplicação |
| Atualização em tempo real | WebSocket | Sincronização das informações da fila |
| Plataforma inicial | Android | Execução da aplicação móvel |
| Compatibilidade futura | iOS | Possível expansão da aplicação |

Os componentes de backend, banco de dados, Signals, REST e WebSocket ainda não estão implementados neste estágio.

## Arquitetura conceitual

A arquitetura prevista separa a interface, o gerenciamento de estado, a comunicação e a persistência:

```text
┌─────────────────────────────┐
│       Aplicativo Flutter    │
│                             │
│       Interface (UI)        │
│              ↓              │
│       Signals (Estado)      │
└──────────────┬──────────────┘
               │
          REST / WebSocket
               │
               ↓
┌─────────────────────────────┐
│       Backend Node.js       │
│                             │
│       TypeScript            │
│       Fastify               │
│       Regras de negócio     │
│       Autenticação          │
│       Controle de acesso    │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│        PostgreSQL           │
│                             │
│       Dados centralizados   │
│       Filas e atendimentos  │
│       Usuários e eventos    │
└─────────────────────────────┘
```

O backend será a autoridade sobre as regras de negócio e os dados persistidos. O Signals será responsável pelo estado reativo da interface, não pela garantia de consistência entre diferentes dispositivos.

## Interface atual

A tela inicial implementada apresenta:

- Barra superior com o título `Fila de Atendimento`.
- Mensagem central `Aplicativo em desenvolvimento`.
- Tema Material 3.
- Esquema de cores baseado na cor índigo.

A interface está em fase inicial e será ampliada conforme a implementação das funcionalidades do MVP.

## Estrutura do projeto

Estrutura inicial gerada pelo Flutter:

```text
.
├── android/                  # Projeto Android
├── ios/                      # Projeto iOS
├── lib/
│   └── main.dart             # Inicialização e tela inicial
├── linux/                    # Projeto Linux Desktop
├── macos/                    # Projeto macOS Desktop
├── test/
│   └── widget_test.dart      # Testes da interface
├── web/                      # Projeto Web
├── windows/                  # Projeto Windows Desktop
├── analysis_options.yaml     # Configurações de análise do Dart
├── pubspec.yaml              # Metadados e dependências
├── pubspec.lock              # Versões resolvidas das dependências
└── README.md
```

Conforme a implementação evoluir, novas telas, modelos, serviços e componentes de estado deverão ser organizados em diretórios específicos dentro de `lib/`.

A estrutura definitiva será estabelecida gradualmente, conforme as responsabilidades da aplicação forem implementadas.

## Pré-requisitos

Para desenvolver e executar o frontend localmente:

- Flutter 3.24.3 ou versão compatível com o projeto.
- Dart SDK compatível com a restrição `^3.5.3`.
- VS Code com as extensões Flutter e Dart, ou Android Studio.
- Android SDK para compilação e testes Android.
- Google Chrome para execução e testes Web.
- Dispositivo Android físico ou emulador para validação nativa.
- Git para controle de versão.

O Android Studio não é obrigatório quando o ambiente Flutter, o Android SDK e as ferramentas necessárias já estão configurados.

Verifique a instalação do Flutter:

```bash
flutter doctor -v
```

Verifique a versão do Flutter e do Dart:

```bash
flutter --version
dart --version
```

## Instalação e execução

### Clonar o repositório

```bash
git clone https://github.com/msandrade-dev/fila-atendimento.git
cd fila-atendimento
```

### Instalar as dependências

```bash
flutter pub get
```

### Executar no Chrome

```bash
flutter run -d chrome
```

A execução no Chrome permite desenvolver e validar a interface, os componentes Flutter e os comportamentos que não dependam exclusivamente de recursos nativos do Android.

É possível utilizar o modo de dispositivo do Chrome DevTools para visualizar a aplicação em dimensões de telas móveis.

Essa simulação não substitui a validação em um dispositivo Android.

### Executar no Android

Verifique os dispositivos disponíveis:

```bash
flutter devices
```

Execute no dispositivo desejado:

```bash
flutter run -d <id-do-dispositivo>
```

O identificador deverá corresponder a um dispositivo físico ou emulador reconhecido pelo Flutter.

## Testes e qualidade

### Análise estática

```bash
flutter analyze
```

### Executar todos os testes

```bash
flutter test
```

### Executar somente o teste de widget

```bash
flutter test test/widget_test.dart
```

### Executar um teste pelo nome

```bash
flutter test test/widget_test.dart --plain-name "exibe a tela inicial"
```

Toda nova funcionalidade deverá possuir testes adequados ao comportamento implementado.

## Build

### Gerar APK de depuração

```bash
flutter build apk --debug
```

### Gerar APK de versão Release

```bash
flutter build apk --release
```

O APK Release será gerado, normalmente, em:

```text
build/app/outputs/flutter-apk/app-release.apk
```

Os artefatos gerados no diretório `build/` não devem ser versionados no Git.

## Organização da implementação futura

A evolução do projeto deverá preservar a separação de responsabilidades.

As principais áreas previstas são:

- **UI:** telas e componentes visuais.
- **Estado:** Signals e gerenciamento reativo da interface.
- **Modelos:** representação de estabelecimentos, usuários, filas e atendimentos.
- **Serviços:** comunicação com o backend por REST e WebSocket.
- **Backend:** autenticação, autorização, regras de negócio e processamento das operações.
- **Persistência:** armazenamento centralizado dos dados em PostgreSQL.

Essa organização deverá permitir testar e evoluir cada componente sem criar acoplamento excessivo entre interface e infraestrutura.

## Fluxos conceituais do sistema

### Fluxo básico do cliente

```text
Cliente solicita entrada na fila
              ↓
Sistema verifica se a fila está aberta
              ↓
Sistema registra a participação
              ↓
Cliente recebe senha e token de acesso
              ↓
Cliente acompanha sua posição e status
              ↓
Atendente chama o próximo cliente
              ↓
Cliente comparece para atendimento
              ↓
Atendimento é iniciado
              ↓
Atendimento é finalizado
```

O cliente também poderá cancelar sua participação enquanto estiver aguardando.

### Fluxo básico do estabelecimento

```text
Administrador abre a fila
              ↓
Atendente visualiza os clientes aguardando
              ↓
Atendente chama o próximo cliente
              ↓
Cliente comparece?
         ↙           ↘
       Sim            Não
        ↓              ↓
Inicia atendimento   Registra ausência
        ↓
Finaliza atendimento
        ↓
Sistema atualiza a fila
```

## Convenções de desenvolvimento

- Utilizar Dart seguindo as recomendações oficiais e as regras do `flutter_lints`.
- Preferir construtores `const` quando os valores forem conhecidos em tempo de compilação.
- Preservar o uso de Material 3.
- Manter as mensagens da interface em português.
- Utilizar imports por pacote nos testes, como `package:fila_atendimento/...`.
- Organizar novas telas e componentes em arquivos próprios dentro de `lib/`.
- Adicionar testes para comportamentos visíveis e regras importantes.
- Não versionar diretórios de build, caches ou artefatos gerados.
- Não implementar regras de negócio críticas exclusivamente no frontend.
- Preservar a consistência dos dados no backend.
- Documentar alterações relevantes na arquitetura e nas regras de negócio.

## Repositório e colaboração

Repositório GitHub:

https://github.com/msandrade-dev/fila-atendimento

Antes de enviar alterações, execute:

```bash
flutter analyze
flutter test
```

Recomenda-se desenvolver novas funcionalidades em branches específicas:

```bash
git switch -c feature/nome-da-funcionalidade
```

Adicionar e registrar as alterações:

```bash
git add .
git commit -m "Descrição breve da alteração"
```

Enviar a branch para o GitHub:

```bash
git push -u origin feature/nome-da-funcionalidade
```

Em seguida, abrir um Pull Request para revisão e integração na branch principal.

## Melhorias futuras

Após a conclusão e validação do MVP, o projeto poderá evoluir com:

- Múltiplos estabelecimentos e filiais.
- Múltiplas filas e categorias de atendimento.
- Agendamento de atendimentos.
- Painel administrativo ampliado.
- Relatórios e estatísticas de atendimento.
- Estimativa de tempo de espera.
- Notificações push.
- Integração com WhatsApp.
- Publicação para iOS.
- Configurações personalizadas por estabelecimento.
- Implantação do backend em ambiente de nuvem.

Essas melhorias dependerão da avaliação das necessidades do produto e da evolução da arquitetura.

## Licença

Este projeto ainda não possui uma licença definida.
