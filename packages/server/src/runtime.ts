import { getDb, type QuestlogDb } from '@questlog/db'
import { Context, Effect, Schema } from 'effect'
import { toAppError, ValidationError } from './errors'

export class Database extends Context.Tag('questlog/Database')<
  Database,
  QuestlogDb
>() {}

export const decodeUnknown = <A>(schema: Schema.Schema<A>, input: unknown) =>
  Effect.try({
    try: () => Schema.decodeUnknownSync(schema)(input),
    catch: (error) =>
      new ValidationError(
        error instanceof Error ? error.message : 'Invalid request payload',
      ),
  })

export const runServerEffect = <A>(
  program: Effect.Effect<A, Error, Database>,
  database = getDb(),
) =>
  Effect.runPromise(
    program.pipe(
      Effect.provideService(Database, database),
      Effect.mapError(toAppError),
    ),
  )
