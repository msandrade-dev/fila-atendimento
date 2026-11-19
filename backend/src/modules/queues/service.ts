import { QueueNotFoundError, QueueValidationError } from './errors.js';
import type {
  CreateQueueInput,
  Queue,
  QueueRepositoryPort,
  UpdateQueueInput,
} from './types.js';

export class QueueService {
  constructor(private readonly repository: QueueRepositoryPort) {}

  async create(input: CreateQueueInput): Promise<Queue> {
    return this.repository.create(normalizeCreateInput(input));
  }

  findAll(): Promise<Queue[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<Queue> {
    const queue = await this.repository.findById(id);

    if (!queue) {
      throw new QueueNotFoundError();
    }

    return queue;
  }

  async update(id: string, input: UpdateQueueInput): Promise<Queue> {
    const normalizedInput = normalizeUpdateInput(input);
    const queue = await this.repository.update(id, normalizedInput);

    if (!queue) {
      throw new QueueNotFoundError();
    }

    return queue;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new QueueNotFoundError();
    }
  }
}

function normalizeCreateInput(input: CreateQueueInput): CreateQueueInput {
  const name = input.name.trim();

  if (!name) {
    throw new QueueValidationError('O nome da fila não pode ser vazio');
  }

  return { ...input, name };
}

function normalizeUpdateInput(input: UpdateQueueInput): UpdateQueueInput {
  if (input.name === undefined) {
    return input;
  }

  const name = input.name.trim();

  if (!name) {
    throw new QueueValidationError('O nome da fila não pode ser vazio');
  }

  return { ...input, name };
}
