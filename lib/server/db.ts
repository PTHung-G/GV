/**
 * PostgreSQL access for the grading feature.
 *
 * The app runs without a database (the editor is localStorage-only), so every
 * caller must tolerate `DATABASE_URL` being absent: `isDatabaseConfigured()`
 * lets a route answer with a clear setup error instead of crashing the build.
 */
import { Pool, type PoolClient, type QueryResultRow } from 'pg';

let pool: Pool | null = null;

export function databaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  return url ? url : null;
}

export function isDatabaseConfigured(): boolean {
  return databaseUrl() !== null;
}

export function getPool(): Pool {
  const url = databaseUrl();
  if (!url) throw new Error('DATABASE_URL chưa được cấu hình.');
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: Math.max(1, Number(process.env.DB_POOL_MAX) || 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 15_000,
    });
    pool.on('error', (error) => {
      console.error('[db] kết nối rảnh gặp lỗi:', error.message);
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await getPool().query<T>(text, params as never[]);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('begin');
    const out = await fn(client);
    await client.query('commit');
    return out;
  } catch (error) {
    try {
      await client.query('rollback');
    } catch {
      /* the original error matters more */
    }
    throw error;
  } finally {
    client.release();
  }
}

/** Used by scripts and tests; the web process keeps its pool for its lifetime. */
export async function closePool(): Promise<void> {
  if (!pool) return;
  const current = pool;
  pool = null;
  await current.end();
}
