import { registerTelemetry } from '@questlog/telemetry'
import { drizzle } from 'drizzle-orm/node-postgres'
import type { Pool, PoolConfig } from 'pg'
import Pg from 'pg'

export * from './auth-schema'

import * as schema from './schema'

registerTelemetry('questlog-server')

const { Pool: PgPool } = Pg

export type QuestlogSchema = typeof schema

const globalForDb = globalThis as {
  __questlogPool?: Pool
  __questlogDb?: QuestlogDb
}

export const createPool = (config: string | PoolConfig) =>
  new PgPool(typeof config === 'string' ? { connectionString: config } : config)

export const createDb = (pool: Pool) => drizzle(pool, { schema })

export type QuestlogDb = ReturnType<typeof createDb>

export const getDb = () => {
  if (globalForDb.__questlogDb) {
    return globalForDb.__questlogDb
  }

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is required')
  }

  const pool = globalForDb.__questlogPool ?? createPool(connectionString)
  const db = createDb(pool)

  globalForDb.__questlogPool = pool
  globalForDb.__questlogDb = db

  return db
}

export * from './schema'
