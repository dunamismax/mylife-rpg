import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export * from './auth-schema'

export const questDifficultyEnum = pgEnum('quest_difficulty', [
  'easy',
  'medium',
  'hard',
])

export const habitKindEnum = pgEnum('habit_kind', ['build', 'avoid'])

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
}

export const progress = pgTable(
  'progress',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    totalXp: integer('total_xp').notNull().default(0),
    level: integer('level').notNull().default(1),
    ...timestamps,
  },
  (table) => [
    check('progress_total_xp_non_negative', sql`${table.totalXp} >= 0`),
    check('progress_level_positive', sql`${table.level} >= 1`),
  ],
)

export const quests = pgTable(
  'quests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    notes: text('notes').notNull().default(''),
    difficulty: questDifficultyEnum('difficulty').notNull().default('medium'),
    xpReward: integer('xp_reward').notNull().default(25),
    dueDate: date('due_date', { mode: 'string' }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('quests_user_id_created_at_idx').on(
      table.userId,
      table.createdAt,
    ),
    check('quests_xp_reward_non_negative', sql`${table.xpReward} >= 0`),
  ],
)

export const habits = pgTable(
  'habits',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    notes: text('notes').notNull().default(''),
    kind: habitKindEnum('kind').notNull().default('build'),
    xpReward: integer('xp_reward').notNull().default(10),
    streak: integer('streak').notNull().default(0),
    lastCompletedOn: date('last_completed_on', { mode: 'string' }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('habits_user_id_title_idx').on(table.userId, table.title),
    check('habits_xp_reward_non_negative', sql`${table.xpReward} >= 0`),
    check('habits_streak_non_negative', sql`${table.streak} >= 0`),
  ],
)

export const habitLogs = pgTable(
  'habit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    habitId: uuid('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    loggedOn: date('logged_on', { mode: 'string' }).notNull(),
    xpAwarded: integer('xp_awarded').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('habit_logs_habit_id_logged_on_idx').on(
      table.habitId,
      table.loggedOn,
    ),
    uniqueIndex('habit_logs_user_id_created_at_idx').on(
      table.userId,
      table.createdAt,
    ),
    check('habit_logs_xp_awarded_non_negative', sql`${table.xpAwarded} >= 0`),
  ],
)

export const dailyCheckIns = pgTable(
  'daily_check_ins',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    checkInDate: date('check_in_date', { mode: 'string' }).notNull(),
    dailyIntention: text('daily_intention').notNull(),
    ifThenPlan: text('if_then_plan').notNull().default(''),
    cravingIntensity: integer('craving_intensity'),
    triggerNotes: text('trigger_notes').notNull().default(''),
    reflection: text('reflection').notNull().default(''),
    slipHappened: boolean('slip_happened').notNull().default(false),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('daily_check_ins_user_id_check_in_date_idx').on(
      table.userId,
      table.checkInDate,
    ),
    check(
      'daily_check_ins_craving_range',
      sql`${table.cravingIntensity} IS NULL OR (${table.cravingIntensity} >= 0 AND ${table.cravingIntensity} <= 10)`,
    ),
  ],
)
