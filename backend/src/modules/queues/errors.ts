export class QueueValidationError extends Error {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'QueueValidationError';
  }
}

export class QueueNotFoundError extends Error {
  readonly statusCode = 404;
  readonly code = 'QUEUE_NOT_FOUND';

  constructor() {
    super('Fila não encontrada');
    this.name = 'QueueNotFoundError';
  }
}

export class QueueConflictError extends Error {
  readonly statusCode = 409;
  readonly code = 'QUEUE_CONFLICT';

  constructor() {
    super('A fila não pode ser excluída porque possui tickets');
    this.name = 'QueueConflictError';
  }
}
