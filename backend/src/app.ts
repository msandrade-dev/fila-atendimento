import Fastify, { type FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import {
  QueueConflictError,
  QueueNotFoundError,
  QueueValidationError,
} from './modules/queues/errors.js';
import { registerQueueRoutes } from './modules/queues/routes.js';
import type { QueueService } from './modules/queues/service.js';

export interface AppDependencies {
  checkDatabase: () => Promise<void>;
  closeDatabase?: () => Promise<void>;
  queueService?: QueueService;
}

export function buildApp(dependencies: AppDependencies): FastifyInstance {
  const app = Fastify({ logger: false });

  if (dependencies.queueService) {
    registerQueueRoutes(app, dependencies.queueService);
  }

  app.get('/', async () => ({
    name: 'fila-atendimento-api',
    version: '0.1.0',
    status: 'ok',
  }));

  app.get('/health', async () => ({ status: 'ok' }));

  app.get('/health/ready', async (_request, reply) => {
    try {
      await dependencies.checkDatabase();
      return reply.code(200).send({ status: 'ready' });
    } catch {
      return reply.code(503).send({ status: 'not_ready' });
    }
  });

  if (dependencies.closeDatabase) {
    app.addHook('onClose', async () => {
      await dependencies.closeDatabase?.();
    });
  }

  app.setErrorHandler((error, _request, reply) => {
    const statusCode =
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof error.statusCode === 'number'
        ? error.statusCode
        : undefined;

    if (statusCode === 400) {
      return reply.code(400).send({
        error: {
          code: 'BAD_REQUEST',
          message: 'Requisição inválida',
        },
      });
    }

    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Entrada inválida',
          details: error.issues,
        },
      });
    }

    if (
      error instanceof QueueValidationError ||
      error instanceof QueueNotFoundError ||
      error instanceof QueueConflictError
    ) {
      return reply.code(error.statusCode).send({
        error: { code: error.code, message: error.message },
      });
    }

    return reply.code(500).send({
      error: { code: 'INTERNAL_ERROR', message: 'Erro interno inesperado' },
    });
  });

  return app;
}
