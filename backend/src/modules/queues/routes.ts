import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { QueueService } from './service.js';
import { queueStatuses } from './types.js';

const queueStatusSchema = z.enum(queueStatuses);
const queueIdSchema = z.object({ id: z.string().uuid() });
const createQueueSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    status: queueStatusSchema.optional(),
  })
  .strict();
const updateQueueSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    status: queueStatusSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'O corpo da atualização não pode ser vazio',
  });

export function registerQueueRoutes(
  app: FastifyInstance,
  service: QueueService,
): void {
  app.post('/queues', async (request, reply) => {
    const input = createQueueSchema.parse(request.body);
    const queue = await service.create(input);
    return reply.code(201).send(queue);
  });

  app.get('/queues', async () => service.findAll());

  app.get('/queues/:id', async (request) => {
    const { id } = queueIdSchema.parse(request.params);
    return service.findById(id);
  });

  app.patch('/queues/:id', async (request) => {
    const { id } = queueIdSchema.parse(request.params);
    const input = updateQueueSchema.parse(request.body);
    return service.update(id, input);
  });

  app.delete('/queues/:id', async (request, reply) => {
    const { id } = queueIdSchema.parse(request.params);
    await service.delete(id);
    return reply.code(204).send();
  });
}
