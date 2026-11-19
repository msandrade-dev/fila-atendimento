import Fastify, { type FastifyInstance } from 'fastify';

export interface AppDependencies {
  checkDatabase: () => Promise<void>;
  closeDatabase?: () => Promise<void>;
}

export function buildApp(dependencies: AppDependencies): FastifyInstance {
  const app = Fastify({ logger: false });

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

  return app;
}
