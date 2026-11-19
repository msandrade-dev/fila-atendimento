import pg from 'pg';

const { Pool } = pg;

export function createDatabasePool(databaseUrl: string, max: number): pg.Pool {
  return new Pool({
    connectionString: databaseUrl,
    max,
  });
}

export async function checkDatabase(pool: pg.Pool): Promise<void> {
  await pool.query('SELECT 1');
}
