import type {
  DailyCheckInSnapshot,
  DashboardPayload,
  HabitLogSnapshot,
  HabitSnapshot,
  MutationResult,
  ProgressSnapshot,
  QuestSnapshot,
} from '@questlog/contracts'
import {
  CreateHabitInputSchema,
  CreateQuestInputSchema,
  SaveCheckInInputSchema,
} from '@questlog/contracts'
import type { QuestlogDb } from '@questlog/db'
import {
  dailyCheckIns,
  habitLogs,
  habits,
  progress,
  quests,
  user,
} from '@questlog/db'
import { traceAsync } from '@questlog/telemetry'
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  isNotNull,
  isNull,
  lt,
} from 'drizzle-orm'
import { Effect } from 'effect'
import {
  addDays,
  currentHabitStreak,
  nextHabitStreak,
  startOfDay,
  todayKey,
  toIsoString,
  weekStartKey,
} from './date'
import { NotFoundError } from './errors'
import { Database, decodeUnknown } from './runtime'

const recentActivityLimit = 8

const levelFromXp = (totalXp: number) =>
  Math.max(1, Math.floor(totalXp / 100) + 1)

const mapProgress = (row: typeof progress.$inferSelect): ProgressSnapshot => ({
  level: row.level,
  totalXp: row.totalXp,
})

const mapQuest = (row: typeof quests.$inferSelect): QuestSnapshot => ({
  id: row.id,
  title: row.title,
  notes: row.notes,
  difficulty: row.difficulty,
  xpReward: row.xpReward,
  dueDate: row.dueDate,
  completedAt: toIsoString(row.completedAt),
  createdAt: row.createdAt.toISOString(),
})

const mapHabit = (
  row: typeof habits.$inferSelect,
  currentStreak: number,
): HabitSnapshot => ({
  id: row.id,
  title: row.title,
  notes: row.notes,
  kind: row.kind,
  xpReward: row.xpReward,
  streak: row.streak,
  currentStreak,
  lastCompletedOn: row.lastCompletedOn,
  createdAt: row.createdAt.toISOString(),
})

const mapHabitLog = (row: {
  id: string
  habitId: string
  habitTitle: string
  loggedOn: string
  xpAwarded: number
  createdAt: Date
}): HabitLogSnapshot => ({
  id: row.id,
  habitId: row.habitId,
  habitTitle: row.habitTitle,
  loggedOn: row.loggedOn,
  xpAwarded: row.xpAwarded,
  createdAt: row.createdAt.toISOString(),
})

const mapCheckIn = (
  row: typeof dailyCheckIns.$inferSelect,
): DailyCheckInSnapshot => ({
  checkInDate: row.checkInDate,
  dailyIntention: row.dailyIntention,
  ifThenPlan: row.ifThenPlan,
  cravingIntensity: row.cravingIntensity,
  triggerNotes: row.triggerNotes,
  reflection: row.reflection,
  slipHappened: row.slipHappened,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})

type InferTransaction<TDb> = TDb extends {
  transaction: (
    run: (database: infer TTransaction) => Promise<unknown>,
    ...args: Array<unknown>
  ) => Promise<unknown>
}
  ? TTransaction
  : never

type QuestlogTransaction = InferTransaction<QuestlogDb>
type QuestlogDatabase = QuestlogDb | QuestlogTransaction

const readDashboard = async (
  database: QuestlogDatabase,
  userId: string,
  today = todayKey(),
): Promise<DashboardPayload> => {
  const weekStart = weekStartKey(today)

  await database.insert(progress).values({ userId }).onConflictDoNothing()

  const [
    progressRow,
    openQuestRows,
    recentlyCompletedQuests,
    habitRows,
    habitLogRows,
    todayCheckInRow,
    openQuestCount,
    completedQuestCount,
    habitLogCount,
  ] = await Promise.all([
    database.query.progress.findFirst({
      where: eq(progress.userId, userId),
    }),
    database.query.quests.findMany({
      where: and(eq(quests.userId, userId), isNull(quests.completedAt)),
      orderBy: [asc(quests.dueDate), desc(quests.createdAt)],
    }),
    database.query.quests.findMany({
      where: and(eq(quests.userId, userId), isNotNull(quests.completedAt)),
      orderBy: [desc(quests.completedAt)],
      limit: recentActivityLimit,
    }),
    database.query.habits.findMany({
      where: eq(habits.userId, userId),
      orderBy: [asc(habits.title)],
    }),
    database
      .select({
        id: habitLogs.id,
        habitId: habitLogs.habitId,
        habitTitle: habits.title,
        loggedOn: habitLogs.loggedOn,
        xpAwarded: habitLogs.xpAwarded,
        createdAt: habitLogs.createdAt,
      })
      .from(habitLogs)
      .innerJoin(habits, eq(habitLogs.habitId, habits.id))
      .where(eq(habitLogs.userId, userId))
      .orderBy(desc(habitLogs.loggedOn), desc(habitLogs.createdAt))
      .limit(recentActivityLimit),
    database.query.dailyCheckIns.findFirst({
      where: and(
        eq(dailyCheckIns.userId, userId),
        eq(dailyCheckIns.checkInDate, today),
      ),
    }),
    database
      .select({ value: count() })
      .from(quests)
      .where(and(eq(quests.userId, userId), isNull(quests.completedAt))),
    database
      .select({ value: count() })
      .from(quests)
      .where(
        and(
          eq(quests.userId, userId),
          gte(quests.completedAt, startOfDay(weekStart)),
          lt(quests.completedAt, startOfDay(addDays(today, 1))),
        ),
      ),
    database
      .select({ value: count() })
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.userId, userId),
          gte(habitLogs.loggedOn, weekStart),
          lt(habitLogs.loggedOn, addDays(today, 1)),
        ),
      ),
  ])

  const progressSnapshot = mapProgress(
    progressRow ?? {
      userId,
      totalXp: 0,
      level: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  )

  return {
    today,
    weekStart,
    aiAvailable: Boolean(process.env.OPENAI_API_KEY),
    progress: progressSnapshot,
    summary: {
      openQuests: openQuestCount[0]?.value ?? 0,
      questsCompletedThisWeek: completedQuestCount[0]?.value ?? 0,
      habitLogsThisWeek: habitLogCount[0]?.value ?? 0,
      checkInDone: !!todayCheckInRow,
    },
    openQuests: openQuestRows.map(mapQuest),
    recentlyCompletedQuests: recentlyCompletedQuests.map(mapQuest),
    habits: habitRows.map((habit) =>
      mapHabit(
        habit,
        currentHabitStreak(habit.streak, habit.lastCompletedOn, today),
      ),
    ),
    recentHabitLogs: habitLogRows.map(mapHabitLog),
    todayCheckIn: todayCheckInRow ? mapCheckIn(todayCheckInRow) : null,
  }
}

const awardXp = async (
  database: QuestlogDatabase,
  userId: string,
  amount: number,
) => {
  if (amount <= 0) {
    return
  }

  let existing = await database.query.progress.findFirst({
    where: eq(progress.userId, userId),
  })

  if (!existing) {
    await database.insert(progress).values({ userId }).onConflictDoNothing()
    existing = await database.query.progress.findFirst({
      where: eq(progress.userId, userId),
    })
  }

  const totalXp = (existing?.totalXp ?? 0) + amount

  await database
    .update(progress)
    .set({
      totalXp,
      level: levelFromXp(totalXp),
      updatedAt: new Date(),
    })
    .where(eq(progress.userId, userId))
}

const runWithTrace = <T>(
  name: string,
  userId: string,
  run: (database: QuestlogDatabase) => Promise<T>,
) =>
  Effect.gen(function* () {
    const database = yield* Database

    return yield* Effect.tryPromise({
      try: () => traceAsync(name, { userId }, () => run(database)),
      catch: (error) =>
        error instanceof Error ? error : new Error('Unknown server error'),
    })
  })

export const loadDashboard = (userId: string, today = todayKey()) =>
  runWithTrace('questlog.dashboard.load', userId, (database) =>
    readDashboard(database, userId, today),
  )

export const createQuest = (userId: string, input: unknown) =>
  Effect.gen(function* () {
    const payload = yield* decodeUnknown(CreateQuestInputSchema, input)

    return yield* runWithTrace(
      'questlog.quest.create',
      userId,
      async (database) => {
        await database.insert(quests).values({
          userId,
          title: payload.title.trim(),
          notes: payload.notes.trim(),
          difficulty: payload.difficulty,
          dueDate: payload.dueDate,
          xpReward: payload.xpReward,
        })

        const dashboard = await readDashboard(database, userId)

        return {
          status: 'created',
          message: 'Quest created.',
          dashboard,
        } satisfies MutationResult
      },
    )
  })

export const completeQuest = (userId: string, questId: string) =>
  runWithTrace('questlog.quest.complete', userId, async (database) =>
    database.transaction(async (tx) => {
      const [updated] = await tx
        .update(quests)
        .set({
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(quests.id, questId),
            eq(quests.userId, userId),
            isNull(quests.completedAt),
          ),
        )
        .returning({
          title: quests.title,
          xpReward: quests.xpReward,
        })

      if (!updated) {
        const existing = await tx.query.quests.findFirst({
          where: and(eq(quests.id, questId), eq(quests.userId, userId)),
        })

        if (!existing) {
          throw new NotFoundError('Quest not found')
        }

        return {
          status: 'noop',
          message: 'That quest was already completed.',
          dashboard: await readDashboard(tx, userId),
        } satisfies MutationResult
      }

      await awardXp(tx, userId, updated.xpReward)

      return {
        status: 'updated',
        message: `Completed quest: ${updated.title}`,
        dashboard: await readDashboard(tx, userId),
      } satisfies MutationResult
    }),
  )

export const createHabit = (userId: string, input: unknown) =>
  Effect.gen(function* () {
    const payload = yield* decodeUnknown(CreateHabitInputSchema, input)

    return yield* runWithTrace(
      'questlog.habit.create',
      userId,
      async (database) => {
        await database.insert(habits).values({
          userId,
          title: payload.title.trim(),
          notes: payload.notes.trim(),
          kind: payload.kind,
          xpReward: payload.xpReward,
        })

        return {
          status: 'created',
          message: 'Habit created.',
          dashboard: await readDashboard(database, userId),
        } satisfies MutationResult
      },
    )
  })

export const logHabit = (
  userId: string,
  habitId: string,
  loggedOn = todayKey(),
) =>
  runWithTrace('questlog.habit.log', userId, async (database) =>
    database.transaction(async (tx) => {
      const habit = await tx.query.habits.findFirst({
        where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
      })

      if (!habit) {
        throw new NotFoundError('Habit not found')
      }

      const [inserted] = await tx
        .insert(habitLogs)
        .values({
          habitId: habit.id,
          userId,
          loggedOn,
          xpAwarded: habit.xpReward,
        })
        .onConflictDoNothing({
          target: [habitLogs.habitId, habitLogs.loggedOn],
        })
        .returning({
          id: habitLogs.id,
        })

      if (!inserted) {
        return {
          status: 'noop',
          message: 'That habit is already logged for today.',
          dashboard: await readDashboard(tx, userId, loggedOn),
        } satisfies MutationResult
      }

      await tx
        .update(habits)
        .set({
          streak: nextHabitStreak(
            habit.streak,
            habit.lastCompletedOn,
            loggedOn,
          ),
          lastCompletedOn: loggedOn,
          updatedAt: new Date(),
        })
        .where(eq(habits.id, habit.id))

      await awardXp(tx, userId, habit.xpReward)

      return {
        status: 'updated',
        message: `Logged habit: ${habit.title}`,
        dashboard: await readDashboard(tx, userId, loggedOn),
      } satisfies MutationResult
    }),
  )

export const saveCheckIn = (
  userId: string,
  input: unknown,
  checkInDate = todayKey(),
) =>
  Effect.gen(function* () {
    const payload = yield* decodeUnknown(SaveCheckInInputSchema, input)

    return yield* runWithTrace(
      'questlog.checkin.save',
      userId,
      async (database) =>
        database.transaction(async (tx) => {
          const existing = await tx.query.dailyCheckIns.findFirst({
            where: and(
              eq(dailyCheckIns.userId, userId),
              eq(dailyCheckIns.checkInDate, checkInDate),
            ),
          })

          await tx
            .insert(dailyCheckIns)
            .values({
              userId,
              checkInDate,
              dailyIntention: payload.dailyIntention.trim(),
              ifThenPlan: payload.ifThenPlan.trim(),
              cravingIntensity: payload.cravingIntensity,
              triggerNotes: payload.triggerNotes.trim(),
              reflection: payload.reflection.trim(),
              slipHappened: payload.slipHappened,
            })
            .onConflictDoUpdate({
              target: [dailyCheckIns.userId, dailyCheckIns.checkInDate],
              set: {
                dailyIntention: payload.dailyIntention.trim(),
                ifThenPlan: payload.ifThenPlan.trim(),
                cravingIntensity: payload.cravingIntensity,
                triggerNotes: payload.triggerNotes.trim(),
                reflection: payload.reflection.trim(),
                slipHappened: payload.slipHappened,
                updatedAt: new Date(),
              },
            })

          return {
            status: existing ? 'updated' : 'created',
            message: "Today's check-in was saved.",
            dashboard: await readDashboard(tx, userId, checkInDate),
          } satisfies MutationResult
        }),
    )
  })

export const lookupUserByEmail = (email: string) =>
  runWithTrace('questlog.user.lookup', email, async (database) => {
    const currentUser = await database.query.user.findFirst({
      where: eq(user.email, email),
    })

    if (!currentUser) {
      throw new NotFoundError('User not found')
    }

    return currentUser
  })

export { levelFromXp, nextHabitStreak }
