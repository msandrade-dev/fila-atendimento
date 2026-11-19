import { pathToFileURL } from 'node:url';
import type { FastifyInstance } from 'fastify';
import type { Pool } from 'pg';
import { buildApp } from './app.js';
import { loadConfig } from './config/env.js';
import { runMigrations } from './database/migrations.js';
import { checkDatabase, createDatabasePool } from './database/pool.js';
import { QueueRepository } from './modules/queues/repository.js';
import { QueueService } from './modules/queues/service.js';

type Signal = 'SIGINT' | 'SIGTERM';
type SignalListener = () => void | Promise<void>;

export interface SignalSource {
  once(signal: Signal, listener: SignalListener): SignalSource;
  removeListener(signal: Signal, listener: SignalListener): SignalSource;
}

interface Closeable {
  close(): Promise<void>;
}

export interface ServerDependencies {
  loadConfig: typeof loadConfig;
  createPool: typeof createDatabasePool;
  runMigrations: typeof runMigrations;
}

const defaultDependencies: ServerDependencies = {
  loadConfig,
  createPool: createDatabasePool,
  runMigrations,
};

export function registerShutdownHandlers(
  app: Closeable,
  signalSource: SignalSource = process,
  reportError: (...arguments_: unknown[]) => void = console.error,
): () => void {
  let closePromise: Promise<void> | undefined;

  const shutdown = async (signal: Signal): Promise<void> => {
    closePromise ??= app.close().catch((error: unknown) => {
      reportError(`Falha ao encerrar a aplicação após ${signal}:`, error);
      throw error;
    });

    await closePromise;
  };

  const createSignalHandler =
    (signal: Signal): SignalListener =>
    () =>
      shutdown(signal).catch(() => undefined);

  const sigintHandler = createSignalHandler('SIGINT');
  const sigtermHandler = createSignalHandler('SIGTERM');

  signalSource.once('SIGINT', sigintHandler);
  signalSource.once('SIGTERM', sigtermHandler);

  return () => {
    signalSource.removeListener('SIGINT', sigintHandler);
    signalSource.removeListener('SIGTERM', sigtermHandler);
  };
}

export async function closePreservingError(
  resource: Closeable,
  originalError: unknown,
  reportError: (...arguments_: unknown[]) => void = console.error,
): Promise<never> {
  try {
    await resource.close();
  } catch (closeError: unknown) {
    reportError(
      'Falha ao liberar recursos durante o encerramento:',
      closeError,
    );
  }

  throw originalError;
}

export async function startServer(
  overrides: Partial<ServerDependencies> = {},
): Promise<void> {
  const dependencies = { ...defaultDependencies, ...overrides };
  const config = dependencies.loadConfig();
  let pool: Pool | undefined;
  let app: FastifyInstance | undefined;
  let unregisterShutdownHandlers: (() => void) | undefined;

  try {
    pool = dependencies.createPool(config.databaseUrl, config.poolMax);
    const databasePool = pool;
    await dependencies.runMigrations(databasePool);

    app = buildApp({
      checkDatabase: () => checkDatabase(databasePool),
      closeDatabase: () => databasePool.end().then(() => undefined),
      queueService: new QueueService(new QueueRepository(databasePool)),
    });

    unregisterShutdownHandlers = registerShutdownHandlers(app);
    await app.listen({ host: config.host, port: config.port });
  } catch (error) {
    unregisterShutdownHandlers?.();

    if (app) {
      return closePreservingError(app, error);
    }

    if (pool) {
      return closePreservingError(
        { close: () => pool!.end().then(() => undefined) },
        error,
      );
    }

    throw error;
  }
}

const isMainModule =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  startServer().catch((error: unknown) => {
    console.error('Falha ao iniciar o backend:', error);
    process.exitCode = 1;
  });
}
