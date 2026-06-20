import { env } from 'cloudflare:workers';

// Cloudflare D1 is reached through a binding, not a URL + token. The binding name
// "DB" is declared in wrangler.toml ([[d1_databases]] binding = "DB").
export function getDb(): D1Database {
  const db = env.DB;
  if (!db) {
    throw new Error('D1 binding "DB" is not configured. Check wrangler.toml.');
  }
  return db;
}
