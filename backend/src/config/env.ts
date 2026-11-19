import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  databaseUrl: string;
  host: string;
  port: number;
  poolMax: number;
}

function requiredValue(environment: NodeJS.ProcessEnv, name: string): string {
  const value = environment[name];

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }

  return value;
}

function positiveInteger(value: string, name: string): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Variável de ambiente inválida: ${name}`);
  }

  return parsed;
}

export function loadConfig(environment = process.env): AppConfig {
  return {
    databaseUrl: requiredValue(environment, 'DATABASE_URL'),
    host: environment.HOST ?? '0.0.0.0',
    port: positiveInteger(environment.PORT ?? '3000', 'PORT'),
    poolMax: positiveInteger(environment.DB_POOL_MAX ?? '10', 'DB_POOL_MAX'),
  };
}
