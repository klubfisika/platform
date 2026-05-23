import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

let dbInstance: ReturnType<typeof drizzle> | null = null;

function getEnv(key: string): string {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key];
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) return (import.meta as any).env[key];
  return '';
}

export function getDb() {
  if (dbInstance) return dbInstance;

  const url = getEnv('DATABASE_URL');
  if (!url) throw new Error('DATABASE_URL is not set');

  const client = neon(url);
  dbInstance = drizzle(client);
  return dbInstance;
}
