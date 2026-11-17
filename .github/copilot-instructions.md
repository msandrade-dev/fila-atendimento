# Copilot instructions

## Project overview

This is a Flutter application package named `fila_atendimento`. The Dart SDK constraint is `^3.5.3`; the checked-in Flutter metadata was generated with Flutter 3.24.3 on the stable channel.

The application currently has a small, single-package structure:

- `lib/main.dart` contains the `main()` entry point, `FilaAtendimentoApp`, and the initial `HomePage`.
- `FilaAtendimentoApp` owns the top-level `MaterialApp`, Material 3 theme, title, and home route.
- `HomePage` is the current screen and is intentionally simple while the queue-management features are developed.
- `test/widget_test.dart` contains widget tests that pump `FilaAtendimentoApp` and verify visible UI text.
- `android/`, `ios/`, `linux/`, `macos/`, `web/`, and `windows/` are Flutter-generated platform runners. Keep platform-specific changes isolated to the relevant runner unless the feature requires native integration.

The only application dependencies are Flutter and `cupertino_icons`; `flutter_test` and `flutter_lints` are development dependencies. No backend, persistence layer, state-management package, or navigation package is currently configured.

## Commands

Run these from the repository root:

```bash
flutter pub get
flutter analyze
flutter test
flutter test test/widget_test.dart
flutter test test/widget_test.dart --plain-name "exibe a tela inicial"
flutter run
flutter build apk
```

`flutter analyze` uses the recommended rules from `package:flutter_lints/flutter.yaml` via `analysis_options.yaml`. Add or update focused widget tests in `test/` when changing visible behavior; use `--plain-name` to run one named test.

## Code conventions

- Follow the active `flutter_lints` rules; do not disable a lint globally for a local exception.
- Prefer `const` constructors and `const` widget subtrees where values are compile-time constants, matching the existing app and test code.
- Keep the root app configuration in `FilaAtendimentoApp`; add screens and feature components as separate Dart files under `lib/` as the application grows rather than expanding `main()` with unrelated logic.
- Preserve the existing Material 3 setup (`useMaterial3: true`) and seeded `ColorScheme` when extending the UI unless a deliberate product-wide theme change is required.
- Use the existing Portuguese UI language for user-facing strings, including test expectations. Keep widget and class identifiers in Dart naming conventions.
- Widget tests should import application code with the package import (`package:fila_atendimento/...`) and verify behavior through the rendered widget tree.
- Keep generated platform files and build artifacts out of feature changes; `.gitignore` already excludes `.dart_tool/`, `build/`, and platform-specific debug/profile/release outputs.
