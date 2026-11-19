import type { Pool, QueryResultRow } from 'pg';
import { QueueConflictError } from './errors.js';
import type {
  CreateQueueInput,
  Queue,
  QueueRepositoryPort,
  QueueStatus,
  UpdateQueueInput,
} from './types.js';

interface QueueRow extends QueryResultRow {
  id: string;
  name: string;
  description: string | null;
  status: QueueStatus;
  created_at: Date;
  updated_at: Date;
}

function mapQueue(row: QueueRow): Queue {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export class QueueRepository implements QueueRepositoryPort {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateQueueInput): Promise<Queue> {
    const result = await this.pool.query<QueueRow>(
      `
        INSERT INTO queues (name, description, status)
        VALUES ($1, $2, $3)
        RETURNING id, name, description, status, created_at, updated_at
      `,
      [input.name, input.description ?? null, input.status ?? 'ACTIVE'],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error('A criação da fila não retornou uma linha');
    }

    return mapQueue(row);
  }

  async findAll(): Promise<Queue[]> {
    const result = await this.pool.query<QueueRow>(
      `
        SELECT id, name, description, status, created_at, updated_at
        FROM queues
        ORDER BY created_at DESC, id DESC
      `,
    );

    return result.rows.map(mapQueue);
  }

  async findById(id: string): Promise<Queue | null> {
    const result = await this.pool.query<QueueRow>(
      `
        SELECT id, name, description, status, created_at, updated_at
        FROM queues
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? mapQueue(result.rows[0]) : null;
  }

  async update(id: string, input: UpdateQueueInput): Promise<Queue | null> {
    const assignments: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      values.push(input.name);
      assignments.push(`name = $${values.length}`);
    }

    if (input.description !== undefined) {
      values.push(input.description);
      assignments.push(`description = $${values.length}`);
    }

    if (input.status !== undefined) {
      values.push(input.status);
      assignments.push(`status = $${values.length}`);
    }

    values.push(id);
    const result = await this.pool.query<QueueRow>(
      `
        UPDATE queues
        SET ${assignments.join(', ')}, updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING id, name, description, status, created_at, updated_at
      `,
      values,
    );

    return result.rows[0] ? mapQueue(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.pool.query('DELETE FROM queues WHERE id = $1', [
        id,
      ]);
      return result.rowCount === 1;
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new QueueConflictError();
      }

      throw error;
    }
  }
}

function isForeignKeyViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23503'
  );
}
