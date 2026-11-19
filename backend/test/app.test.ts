import assert from 'node:assert/strict';
import test from 'node:test';
import { buildApp } from '../src/app.js';

test('inicializa a aplicação Fastify', async () => {
  const app = buildApp({ checkDatabase: async () => undefined });

  await app.ready();

  assert.equal(app.hasRoute({ method: 'GET', url: '/' }), true);
  await app.close();
});

test('responde na raiz com a identificação da API', async () => {
  const app = buildApp({ checkDatabase: async () => undefined });
  const response = await app.inject({ method: 'GET', url: '/' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    name: 'fila-atendimento-api',
    version: '0.1.0',
    status: 'ok',
  });
  await app.close();
});

test('responde no health sem consultar o banco', async () => {
  const app = buildApp({
    checkDatabase: async () => {
      throw new Error('não deveria consultar o banco');
    },
  });
  const response = await app.inject({ method: 'GET', url: '/health' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { status: 'ok' });
  await app.close();
});

test('retorna ready quando o banco está disponível', async () => {
  let checks = 0;
  const app = buildApp({
    checkDatabase: async () => {
      checks += 1;
    },
  });
  const response = await app.inject({ method: 'GET', url: '/health/ready' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { status: 'ready' });
  assert.equal(checks, 1);
  await app.close();
});

test('retorna not_ready quando o banco está indisponível', async () => {
  const app = buildApp({
    checkDatabase: async () => {
      throw new Error('banco indisponível');
    },
  });
  const response = await app.inject({ method: 'GET', url: '/health/ready' });

  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.json(), { status: 'not_ready' });
  await app.close();
});

test('encerra o recurso de banco ao fechar a aplicação', async () => {
  let closed = false;
  const app = buildApp({
    checkDatabase: async () => undefined,
    closeDatabase: async () => {
      closed = true;
    },
  });

  await app.close();

  assert.equal(closed, true);
});
