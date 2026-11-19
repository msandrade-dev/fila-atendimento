import assert from 'node:assert/strict';
import test from 'node:test';
import type { Pool, PoolClient, QueryResult } from 'pg';
import { runMigrations, type Migration } from '../src/database/migrations.js';

type QueryResponse = QueryResult<Record<string, unknown>>;

class FakeMigrationClient {
  readonly queries: string[] = [];
  releaseCalls = 0;
  releaseErrors: (Error | undefined)[] = [];
  tableExists: boolean;
  appliedVersions: Set<string>;
  failOnMigration = false;
  failOnRollback = false;

  constructor(tableExists: boolean, appliedVersions: string[] = []) {
    this.tableExists = tableExists;
    this.appliedVersions = new Set(appliedVersions);
  }

  async query(
    query: string,
    values: readonly unknown[] = [],
  ): Promise<QueryResponse> {
    this.queries.push(query);

    if (query.includes('to_regclass')) {
      return this.result([{ exists: this.tableExists }]);
    }

    if (query.includes('SELECT version')) {
      const version = String(values[0]);
      return this.result(
        this.appliedVersions.has(version) ? [{ version }] : [],
      );
    }

    if (query.includes('CREATE TABLE IF NOT EXISTS')) {
      this.tableExists = true;
    }

    if (query.includes('INSERT INTO schema_migrations')) {
      this.appliedVersions.add(String(values[0]));
    }

    if (this.failOnMigration && query.includes('CREATE TABLE migration_test')) {
      throw new Error('falha na execução da migração');
    }

    if (this.failOnRollback && query.includes('ROLLBACK')) {
      throw new Error('falha no rollback');
    }

    return this.result([]);
  }

  release(error?: Error): void {
    this.releaseCalls += 1;
    this.releaseErrors.push(error);
  }

  private result(rows: Record<string, unknown>[]): QueryResponse {
    return {
      command: 'SELECT',
      rowCount: rows.length,
      oid: 0,
      rows,
      fields: [],
    };
  }
}

function fakePool(client: FakeMigrationClient): Pool {
  return {
    connect: async () => client as unknown as PoolClient,
  } as unknown as Pool;
}

const testMigration: Migration = {
  version: '002_migration_test',
  sql: 'CREATE TABLE migration_test (id INTEGER)',
};

test('executa e registra uma migração ainda não aplicada', async () => {
  const client = new FakeMigrationClient(true);

  await runMigrations(fakePool(client), [testMigration]);

  assert.equal(
    client.queries.some((query) => query.includes(testMigration.sql)),
    true,
  );
  assert.equal(client.appliedVersions.has(testMigration.version), true);
  assert.equal(client.queries.includes('COMMIT'), true);
  assert.equal(client.releaseCalls, 1);
  assert.equal(client.releaseErrors[0], undefined);
});

test('ignora uma migração já aplicada', async () => {
  const client = new FakeMigrationClient(true, [testMigration.version]);

  await runMigrations(fakePool(client), [testMigration]);

  assert.equal(
    client.queries.some((query) => query.includes(testMigration.sql)),
    false,
  );
  assert.equal(client.queries.includes('COMMIT'), true);
  assert.equal(client.releaseCalls, 1);
  assert.equal(client.releaseErrors[0], undefined);
});

test('preserva o erro da migração quando o rollback funciona', async () => {
  const client = new FakeMigrationClient(true);
  client.failOnMigration = true;

  await assert.rejects(
    runMigrations(fakePool(client), [testMigration]),
    /falha na execução da migração/,
  );

  assert.equal(client.queries.includes('ROLLBACK'), true);
  assert.equal(client.queries.includes('COMMIT'), false);
  assert.equal(client.releaseCalls, 1);
  assert.equal(client.releaseErrors[0], undefined);
});

test('agrega os erros e descarta a conexão quando o rollback falha', async () => {
  const client = new FakeMigrationClient(true);
  client.failOnMigration = true;
  client.failOnRollback = true;

  await assert.rejects(
    runMigrations(fakePool(client), [testMigration]),
    (error: unknown) => {
      assert.equal(error instanceof AggregateError, true);
      assert.equal((error as AggregateError).errors.length, 2);
      assert.equal(
        ((error as AggregateError).errors[0] as Error).message,
        'falha na execução da migração',
      );
      assert.equal(
        ((error as AggregateError).errors[1] as Error).message,
        'falha no rollback',
      );
      return true;
    },
  );

  assert.equal(client.releaseCalls, 1);
  assert.equal(client.releaseErrors[0]?.message, 'falha no rollback');
});

test('a migração inicial cria a tabela de controle', async () => {
  const client = new FakeMigrationClient(false);

  await runMigrations(fakePool(client));

  assert.equal(
    client.queries.some((query) =>
      query.includes('CREATE TABLE IF NOT EXISTS schema_migrations'),
    ),
    true,
  );
  assert.equal(client.appliedVersions.has('001_schema_migrations'), true);
  assert.equal(client.releaseCalls, 1);
  assert.equal(client.releaseErrors[0], undefined);
});
