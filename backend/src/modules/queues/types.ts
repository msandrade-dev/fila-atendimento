export const queueStatuses = ['ACTIVE', 'INACTIVE'] as const;

export type QueueStatus = (typeof queueStatuses)[number];

export interface Queue {
  id: string;
  name: string;
  description: string | null;
  status: QueueStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQueueInput {
  name: string;
  description?: string | null;
  status?: QueueStatus;
}

export interface UpdateQueueInput {
  name?: string;
  description?: string | null;
  status?: QueueStatus;
}

export interface QueueRepositoryPort {
  create(input: CreateQueueInput): Promise<Queue>;
  findAll(): Promise<Queue[]>;
  findById(id: string): Promise<Queue | null>;
  update(id: string, input: UpdateQueueInput): Promise<Queue | null>;
  delete(id: string): Promise<boolean>;
}
