import assert from 'node:assert/strict';
import test from 'node:test';
import type { Pool } from 'pg';
import { buildApp } from '../src/app.js';
import {
  closePreservingError,
  registerShutdownHandlers,
  startServer,
  type SignalSource,
} from '../src/server.js';

class FakeSignalSource implements SignalSource {
  private readonly listeners = new Map<
    'SIGINT' | 'SIGTERM',
    () => void | Promise<void>
  >();

  once(signal: 'SIGINT' | 'SIGTERM', listener: () => void | Promise<void>) {
    this.listeners.set(signal, listener);
    return this;
  }

  removeListener(
    signal: 'SIGINT' | 'SIGTERM',
    listener: () => void | Promise<void>,
  ) {
    if (this.listeners.get(signal) === listener) {
      this.listeners.delete(signal);
    }

    return this;
  }

  async emit(signal: 'SIGINT' | 'SIGTERM'): Promise<void> {
    await this.listeners.get(signal)?.();
  }
}

test('fecha a aplicação e o banco ao receber um sinal', async () => {
  const signals = new FakeSignalSource();
  let databaseClosed = false;
  const app = buildApp({
    checkDatabase: async () => undefined,
    closeDatabase: async () => {
      databaseClosed = true;
    },
  });

  await app.ready();
  const unregister = registerShutdownHandlers(app, signals);
  await signals.emit('SIGINT');

  assert.equal(databaseClosed, true);
  unregister();
});

test('não fecha a aplicação mais de uma vez para sinais consecutivos', async () => {
  const signals = new FakeSignalSource();
  let closeCalls = 0;
  let releaseClose!: () => void;
  const closeStarted = new Promise<void>((resolve) => {
    releaseClose = resolve;
  });
  const app = {
    close: async () => {
      closeCalls += 1;
      await closeStarted;
    },
  };

  registerShutdownHandlers(app, signals);
  const firstShutdown = signals.emit('SIGINT');
  const secondShutdown = signals.emit('SIGTERM');

  await Promise.resolve();
  assert.equal(closeCalls, 1);

  releaseClose();
  await Promise.all([firstShutdown, secondShutdown]);
});

test('reporta falha no fechamento sem rejeição não tratada', async () => {
  const signals = new FakeSignalSource();
  const closeError = new Error('falha ao fechar');
  const reported: unknown[][] = [];
  const app = {
    close: async () => {
      throw closeError;
    },
  };

  registerShutdownHandlers(app, signals, (...arguments_) => {
    reported.push(arguments_);
  });
  await signals.emit('SIGTERM');

  assert.equal(reported.length, 1);
  assert.equal(reported[0]?.[1], closeError);
});

test('preserva o erro original quando o fechamento também falha', async () => {
  const originalError = new Error('falha na inicialização');
  const closeError = new Error('falha ao fechar');
  const reported: unknown[][] = [];

  await assert.rejects(
    closePreservingError(
      {
        close: async () => {
          throw closeError;
        },
      },
      originalError,
      (...arguments_) => {
        reported.push(arguments_);
      },
    ),
    (error: unknown) => error === originalError,
  );

  assert.equal(reported[0]?.[1], closeError);
});

test('fecha o pool uma vez e propaga a falha das migrações', async () => {
  const migrationError = new Error('falha na migração');
  let closeCalls = 0;
  const pool = {
    end: async () => {
      closeCalls += 1;
    },
  } as unknown as Pool;

  await assert.rejects(
    startServer({
      loadConfig: () => ({
        databaseUrl: 'postgresql://teste',
        host: '127.0.0.1',
        port: 3000,
        poolMax: 1,
      }),
      createPool: () => pool,
      runMigrations: async () => {
        throw migrationError;
      },
    }),
    (error: unknown) => error === migrationError,
  );

  assert.equal(closeCalls, 1);
});
