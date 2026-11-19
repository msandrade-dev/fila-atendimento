import { readFileSync } from 'node:fs';
import type { Pool } from 'pg';

export interface Migration {
  version: string;
  sql: string;
}

const migrations: Migration[] = [
  {
    version: '001_schema_migrations',
    sql: readFileSync(
      new URL('../../migrations/001_schema_migrations.sql', import.meta.url),
      'utf8',
    ),
  },
] as const;

const MIGRATION_LOCK_KEY = 719_384_271;

export async function runMigrations(
  pool: Pool,
  migrationList: readonly Migration[] = migrations,
): Promise<void> {
  for (const migration of migrationList) {
    const client = await pool.connect();
    let clientReleased = false;

    const releaseClient = (error?: Error): void => {
      if (!clientReleased) {
        clientReleased = true;
        client.release(error);
      }
    };

    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock($1)', [
        MIGRATION_LOCK_KEY,
      ]);

      const tableResult = await client.query<{ exists: boolean }>(
        `
          SELECT to_regclass('public.schema_migrations') IS NOT NULL AS exists
        `,
      );
      const tableExists = tableResult.rows[0]?.exists === true;

      let alreadyApplied = false;
      if (tableExists) {
        const versionResult = await client.query<{ version: string }>(
          `
            SELECT version
            FROM schema_migrations
            WHERE version = $1
          `,
          [migration.version],
        );
        alreadyApplied = versionResult.rows.length > 0;
      }

      if (!alreadyApplied) {
        await client.query(migration.sql);
        await client.query(
          `
            INSERT INTO schema_migrations (version)
            VALUES ($1)
          `,
          [migration.version],
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        const discardedConnectionError =
          rollbackError instanceof Error
            ? rollbackError
            : new Error(String(rollbackError));

        releaseClient(discardedConnectionError);
        throw new AggregateError(
          [error, rollbackError],
          'Falha na migração e no rollback',
        );
      }

      throw error;
    } finally {
      releaseClient();
    }
  }
}
