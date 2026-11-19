import assert from 'node:assert/strict';
import test from 'node:test';
import type { FastifyInstance } from 'fastify';
import type { Pool } from 'pg';
import { buildApp } from '../src/app.js';
import { runMigrations } from '../src/database/migrations.js';
import { createDatabasePool } from '../src/database/pool.js';
import { QueueRepository } from '../src/modules/queues/repository.js';
import { QueueService } from '../src/modules/queues/service.js';

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

function assertIsTestDatabase(databaseUrl: string): void {
  const databaseName = decodeURIComponent(
    new URL(databaseUrl).pathname.slice(1),
  );

  if (!databaseName.endsWith('_test')) {
    throw new Error(
      'TEST_DATABASE_URL deve apontar para um banco com sufixo _test',
    );
  }
}

test(
  'executa migrações idempotentes e persiste o CRUD de filas',
  { skip: !testDatabaseUrl ? 'TEST_DATABASE_URL não configurada' : false },
  async () => {
    assertIsTestDatabase(testDatabaseUrl!);

    let pool: Pool | undefined;
    let app: FastifyInstance | undefined;
    let createdQueueId: string | undefined;

    try {
      pool = createDatabasePool(testDatabaseUrl!, 4);

      await runMigrations(pool);
      await runMigrations(pool);

      const migrationResult = await pool.query<{ version: string }>(
        'SELECT version FROM schema_migrations ORDER BY version',
      );
      assert.deepEqual(
        migrationResult.rows.map((row) => row.version),
        ['001_schema_migrations', '002_create_queues'],
      );

      app = buildApp({
        checkDatabase: async () => {
          await pool!.query('SELECT 1');
        },
        closeDatabase: () => pool!.end().then(() => undefined),
        queueService: new QueueService(new QueueRepository(pool)),
      });

      const createResponse = await app.inject({
        method: 'POST',
        url: '/queues',
        payload: {
          name: 'Integração automatizada',
          description: 'Registro temporário da integração',
        },
      });
      assert.equal(createResponse.statusCode, 201);

      const createdQueue = createResponse.json<{
        id: string;
        name: string;
        description: string;
        status: string;
      }>();
      createdQueueId = createdQueue.id;

      const listResponse = await app.inject({
        method: 'GET',
        url: '/queues',
      });
      assert.equal(listResponse.statusCode, 200);
      assert.equal(
        listResponse
          .json<Array<{ id: string }>>()
          .some((queue) => queue.id === createdQueue.id),
        true,
      );

      let getResponse = await app.inject({
        method: 'GET',
        url: `/queues/${createdQueue.id}`,
      });
      assert.equal(getResponse.statusCode, 200);
      assert.deepEqual(getResponse.json(), createdQueue);

      const patchResponse = await app.inject({
        method: 'PATCH',
        url: `/queues/${createdQueue.id}`,
        payload: {
          name: 'Integração atualizada',
          description: 'Descrição atualizada',
          status: 'INACTIVE',
        },
      });
      assert.equal(patchResponse.statusCode, 200);
      assert.equal(patchResponse.json().name, 'Integração atualizada');
      assert.equal(patchResponse.json().description, 'Descrição atualizada');
      assert.equal(patchResponse.json().status, 'INACTIVE');

      getResponse = await app.inject({
        method: 'GET',
        url: `/queues/${createdQueue.id}`,
      });
      assert.equal(getResponse.statusCode, 200);
      assert.deepEqual(getResponse.json(), patchResponse.json());

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/queues/${createdQueue.id}`,
      });
      assert.equal(deleteResponse.statusCode, 204);
      createdQueueId = undefined;

      getResponse = await app.inject({
        method: 'GET',
        url: `/queues/${createdQueue.id}`,
      });
      assert.equal(getResponse.statusCode, 404);
    } finally {
      try {
        if (createdQueueId && app) {
          await app.inject({
            method: 'DELETE',
            url: `/queues/${createdQueueId}`,
          });
        }
      } finally {
        if (app) {
          await app.close();
        } else {
          await pool?.end();
        }
      }
    }
  },
);
