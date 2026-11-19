import assert from 'node:assert/strict';
import test from 'node:test';
import { buildApp } from '../src/app.js';
import { QueueConflictError } from '../src/modules/queues/errors.js';
import { QueueService } from '../src/modules/queues/service.js';
import type {
  CreateQueueInput,
  Queue,
  QueueRepositoryPort,
  UpdateQueueInput,
} from '../src/modules/queues/types.js';

const firstQueue: Queue = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Recepção',
  description: null,
  status: 'ACTIVE',
  createdAt: '2026-01-02T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

class InMemoryQueueRepository implements QueueRepositoryPort {
  queues: Queue[] = [];
  nextId = 1;
  rejectDelete = false;

  async create(input: CreateQueueInput): Promise<Queue> {
    const queue: Queue = {
      id: `11111111-1111-4111-8111-${String(this.nextId++).padStart(12, '0')}`,
      name: input.name,
      description: input.description ?? null,
      status: input.status ?? 'ACTIVE',
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    };
    this.queues.push(queue);
    return queue;
  }

  async findAll(): Promise<Queue[]> {
    return this.queues;
  }

  async findById(id: string): Promise<Queue | null> {
    return this.queues.find((queue) => queue.id === id) ?? null;
  }

  async update(id: string, input: UpdateQueueInput): Promise<Queue | null> {
    const queue = await this.findById(id);

    if (!queue) {
      return null;
    }

    Object.assign(queue, input, { updatedAt: '2026-01-03T00:00:00.000Z' });
    return queue;
  }

  async delete(id: string): Promise<boolean> {
    if (this.rejectDelete) {
      throw new QueueConflictError();
    }

    const index = this.queues.findIndex((queue) => queue.id === id);
    if (index < 0) {
      return false;
    }

    this.queues.splice(index, 1);
    return true;
  }
}

function createQueueApp(repository = new InMemoryQueueRepository()) {
  const app = buildApp({
    checkDatabase: async () => undefined,
    queueService: new QueueService(repository),
  });

  return { app, repository };
}

test('cria fila válida, normaliza nome e usa ACTIVE por padrão', async () => {
  const { app } = createQueueApp();
  const response = await app.inject({
    method: 'POST',
    url: '/queues',
    payload: { name: '  Atendimento  ', description: null },
  });

  assert.equal(response.statusCode, 201);
  assert.deepEqual(response.json(), {
    id: '11111111-1111-4111-8111-000000000001',
    name: 'Atendimento',
    description: null,
    status: 'ACTIVE',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  });
  await app.close();
});

test('rejeita nome ausente, vazio, status inválido e descrição inválida', async () => {
  const { app } = createQueueApp();
  const cases = [
    { payload: {}, message: 'nome ausente' },
    { payload: { name: '   ' }, message: 'nome vazio' },
    { payload: { name: 'Fila', status: 'BROKEN' }, message: 'status inválido' },
    {
      payload: { name: 'Fila', description: 123 },
      message: 'descrição inválida',
    },
  ];

  for (const currentCase of cases) {
    const response = await app.inject({
      method: 'POST',
      url: '/queues',
      payload: currentCase.payload,
    });

    assert.equal(response.statusCode, 400, currentCase.message);
  }

  await app.close();
});

test('rejeita JSON malformado sem expor detalhes internos', async () => {
  const { app } = createQueueApp();
  const response = await app.inject({
    method: 'POST',
    url: '/queues',
    headers: { 'content-type': 'application/json' },
    payload: '{"name":',
  });

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.json(), {
    error: { code: 'BAD_REQUEST', message: 'Requisição inválida' },
  });
  assert.equal(response.body.includes('FST_ERR_CTP_INVALID_JSON_BODY'), false);
  assert.equal(response.body.includes('SyntaxError'), false);
  await app.close();
});

test('lista filas vazias e múltiplas filas', async () => {
  const { app, repository } = createQueueApp();
  let response = await app.inject({ method: 'GET', url: '/queues' });
  assert.deepEqual(response.json(), []);

  repository.queues.push(firstQueue, {
    ...firstQueue,
    id: '22222222-2222-4222-8222-222222222222',
  });
  response = await app.inject({ method: 'GET', url: '/queues' });

  assert.equal(response.statusCode, 200);
  assert.equal(response.json().length, 2);
  await app.close();
});

test('consulta fila por UUID e rejeita UUID inválido ou inexistente', async () => {
  const { app, repository } = createQueueApp();
  repository.queues.push(firstQueue);

  let response = await app.inject({
    method: 'GET',
    url: `/queues/${firstQueue.id}`,
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().name, 'Recepção');

  response = await app.inject({ method: 'GET', url: '/queues/not-a-uuid' });
  assert.equal(response.statusCode, 400);

  response = await app.inject({
    method: 'GET',
    url: '/queues/33333333-3333-4333-8333-333333333333',
  });
  assert.equal(response.statusCode, 404);
  await app.close();
});

test('atualiza nome, descrição e status parcialmente', async () => {
  const { app, repository } = createQueueApp();
  repository.queues.push(firstQueue);

  let response = await app.inject({
    method: 'PATCH',
    url: `/queues/${firstQueue.id}`,
    payload: { name: '  Nova fila  ' },
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().name, 'Nova fila');

  response = await app.inject({
    method: 'PATCH',
    url: `/queues/${firstQueue.id}`,
    payload: { description: 'Descrição', status: 'INACTIVE' },
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().description, 'Descrição');
  assert.equal(response.json().status, 'INACTIVE');
  await app.close();
});

test('rejeita atualização vazia, campo desconhecido e UUID inválido', async () => {
  const { app } = createQueueApp();
  const cases = [
    { url: '/queues/11111111-1111-4111-8111-111111111111', payload: {} },
    {
      url: '/queues/11111111-1111-4111-8111-111111111111',
      payload: { id: 'x' },
    },
    { url: '/queues/not-a-uuid', payload: { name: 'Fila' } },
  ];

  for (const currentCase of cases) {
    const response = await app.inject({
      method: 'PATCH',
      url: currentCase.url,
      payload: currentCase.payload,
    });
    assert.equal(response.statusCode, 400);
  }

  await app.close();
});

test('retorna 404 ao atualizar ou excluir fila inexistente', async () => {
  const { app } = createQueueApp();
  const id = '33333333-3333-4333-8333-333333333333';

  let response = await app.inject({
    method: 'PATCH',
    url: `/queues/${id}`,
    payload: { name: 'Fila' },
  });
  assert.equal(response.statusCode, 404);

  response = await app.inject({ method: 'DELETE', url: `/queues/${id}` });
  assert.equal(response.statusCode, 404);
  await app.close();
});

test('exclui fila e trata conflito de tickets', async () => {
  const { app, repository } = createQueueApp();
  repository.queues.push(firstQueue);

  let response = await app.inject({
    method: 'DELETE',
    url: `/queues/${firstQueue.id}`,
  });
  assert.equal(response.statusCode, 204);

  repository.queues.push(firstQueue);
  repository.rejectDelete = true;
  response = await app.inject({
    method: 'DELETE',
    url: `/queues/${firstQueue.id}`,
  });
  assert.equal(response.statusCode, 409);

  response = await app.inject({ method: 'DELETE', url: '/queues/not-a-uuid' });
  assert.equal(response.statusCode, 400);
  await app.close();
});
