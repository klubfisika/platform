import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const url = process.env.DATABASE_URL || '';
  if (!url) throw new Error('DATABASE_URL is not set');

  const client = neon(url);
  dbInstance = drizzle(client);
  return dbInstance;
}
