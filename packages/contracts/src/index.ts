import * as z from 'zod'

const NonEmptyStringSchema = z.string().min(1)
const NonNegativeIntSchema = z.int().min(0)

export const QuestDifficultySchema = z.enum(['easy', 'medium', 'hard'])
export type QuestDifficulty = z.infer<typeof QuestDifficultySchema>

export const HabitKindSchema = z.enum(['build', 'avoid'])
export type HabitKind = z.infer<typeof HabitKindSchema>

export const IsoDateSchema = z.string()
export type IsoDate = z.infer<typeof IsoDateSchema>

export const IsoDateTimeSchema = z.string()
export type IsoDateTime = z.infer<typeof IsoDateTimeSchema>

export const NullableStringSchema = z.string().nullable()
export const NullableDateSchema = IsoDateSchema.nullable()
export const NullableDateTimeSchema = IsoDateTimeSchema.nullable()

export const ProgressSnapshotSchema = z.object({
  level: z.int().min(1),
  totalXp: NonNegativeIntSchema,
})
export type ProgressSnapshot = z.infer<typeof ProgressSnapshotSchema>

export const QuestSnapshotSchema = z.object({
  id: z.string(),
  title: NonEmptyStringSchema,
  notes: z.string(),
  difficulty: QuestDifficultySchema,
  xpReward: NonNegativeIntSchema,
  dueDate: NullableDateSchema,
  completedAt: NullableDateTimeSchema,
  createdAt: IsoDateTimeSchema,
})
export type QuestSnapshot = z.infer<typeof QuestSnapshotSchema>

export const HabitSnapshotSchema = z.object({
  id: z.string(),
  title: NonEmptyStringSchema,
  notes: z.string(),
  kind: HabitKindSchema,
  xpReward: NonNegativeIntSchema,
  streak: NonNegativeIntSchema,
  currentStreak: NonNegativeIntSchema,
  lastCompletedOn: NullableDateSchema,
  createdAt: IsoDateTimeSchema,
})
export type HabitSnapshot = z.infer<typeof HabitSnapshotSchema>

export const HabitLogSnapshotSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  habitTitle: NonEmptyStringSchema,
  loggedOn: IsoDateSchema,
  xpAwarded: NonNegativeIntSchema,
  createdAt: IsoDateTimeSchema,
})
export type HabitLogSnapshot = z.infer<typeof HabitLogSnapshotSchema>

export const DailyCheckInSnapshotSchema = z.object({
  checkInDate: IsoDateSchema,
  dailyIntention: NonEmptyStringSchema,
  ifThenPlan: z.string(),
  cravingIntensity: z.int().min(0).max(10).nullable(),
  triggerNotes: z.string(),
  reflection: z.string(),
  slipHappened: z.boolean(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
})
export type DailyCheckInSnapshot = z.infer<typeof DailyCheckInSnapshotSchema>

export const DashboardSummarySchema = z.object({
  openQuests: NonNegativeIntSchema,
  questsCompletedThisWeek: NonNegativeIntSchema,
  habitLogsThisWeek: NonNegativeIntSchema,
  checkInDone: z.boolean(),
})
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>

export const DashboardPayloadSchema = z.object({
  today: IsoDateSchema,
  weekStart: IsoDateSchema,
  progress: ProgressSnapshotSchema,
  summary: DashboardSummarySchema,
  openQuests: z.array(QuestSnapshotSchema),
  recentlyCompletedQuests: z.array(QuestSnapshotSchema),
  habits: z.array(HabitSnapshotSchema),
  recentHabitLogs: z.array(HabitLogSnapshotSchema),
  todayCheckIn: DailyCheckInSnapshotSchema.nullable(),
})
export type DashboardPayload = z.infer<typeof DashboardPayloadSchema>

export const CreateQuestInputSchema = z.object({
  title: NonEmptyStringSchema,
  notes: z.string(),
  difficulty: QuestDifficultySchema,
  dueDate: NullableDateSchema,
  xpReward: NonNegativeIntSchema,
})
export type CreateQuestInput = z.infer<typeof CreateQuestInputSchema>

export const CreateHabitInputSchema = z.object({
  title: NonEmptyStringSchema,
  notes: z.string(),
  kind: HabitKindSchema,
  xpReward: NonNegativeIntSchema,
})
export type CreateHabitInput = z.infer<typeof CreateHabitInputSchema>

export const SaveCheckInInputSchema = z.object({
  dailyIntention: NonEmptyStringSchema,
  ifThenPlan: z.string(),
  cravingIntensity: z.int().min(0).max(10).nullable(),
  triggerNotes: z.string(),
  reflection: z.string(),
  slipHappened: z.boolean(),
})
export type SaveCheckInInput = z.infer<typeof SaveCheckInInputSchema>

export const MutationStatusSchema = z.enum(['created', 'updated', 'noop'])
export type MutationStatus = z.infer<typeof MutationStatusSchema>

export const MutationResultSchema = z.object({
  status: MutationStatusSchema,
  message: NonEmptyStringSchema,
  dashboard: DashboardPayloadSchema,
})
export type MutationResult = z.infer<typeof MutationResultSchema>
