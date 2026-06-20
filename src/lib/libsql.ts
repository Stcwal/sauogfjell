import { createClient, type Client, type ResultSet, type Transaction } from '@libsql/client';
import { env } from 'cloudflare:workers';

let client: Client | null = null;

export function getDatabaseClient() {
  if (client) return client;

  const url = env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set.');
  }

  client = createClient({
    url,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  return client;
}

type SqlValue = string | number | boolean | null;

function toObject(columns: string[], row: ArrayLike<unknown>) {
  return Object.fromEntries(columns.map((column, index) => [column, row[index] as SqlValue]));
}

export function rowsAsObjects<T>(result: ResultSet) {
  return result.rows.map((row) => toObject(result.columns, row) as T);
}

export type SqlTransaction = Transaction;