import { Schema } from 'effect'

export const QuestDifficultySchema = Schema.Literal('easy', 'medium', 'hard')
export type QuestDifficulty = Schema.Schema.Type<typeof QuestDifficultySchema>

export const HabitKindSchema = Schema.Literal('build', 'avoid')
export type HabitKind = Schema.Schema.Type<typeof HabitKindSchema>

export const IsoDateSchema = Schema.String
export type IsoDate = Schema.Schema.Type<typeof IsoDateSchema>

export const IsoDateTimeSchema = Schema.String
export type IsoDateTime = Schema.Schema.Type<typeof IsoDateTimeSchema>

export const NullableStringSchema = Schema.NullOr(Schema.String)
export const NullableDateSchema = Schema.NullOr(IsoDateSchema)
export const NullableDateTimeSchema = Schema.NullOr(IsoDateTimeSchema)

export const ProgressSnapshotSchema = Schema.Struct({
  level: Schema.Int.pipe(Schema.greaterThanOrEqualTo(1)),
  totalXp: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
})
export type ProgressSnapshot = Schema.Schema.Type<typeof ProgressSnapshotSchema>

export const QuestSnapshotSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.NonEmptyString,
  notes: Schema.String,
  difficulty: QuestDifficultySchema,
  xpReward: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
  dueDate: NullableDateSchema,
  completedAt: NullableDateTimeSchema,
  createdAt: IsoDateTimeSchema,
})
export type QuestSnapshot = Schema.Schema.Type<typeof QuestSnapshotSchema>

export const HabitSnapshotSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.NonEmptyString,
  notes: Schema.String,
  kind: HabitKindSchema,
  xpReward: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
  streak: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
  currentStreak: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
  lastCompletedOn: NullableDateSchema,
  createdAt: IsoDateTimeSchema,
})
export type HabitSnapshot = Schema.Schema.Type<typeof HabitSnapshotSchema>

export const HabitLogSnapshotSchema = Schema.Struct({
  id: Schema.String,
  habitId: Schema.String,
  habitTitle: Schema.NonEmptyString,
  loggedOn: IsoDateSchema,
  xpAwarded: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
  createdAt: IsoDateTimeSchema,
})
export type HabitLogSnapshot = Schema.Schema.Type<typeof HabitLogSnapshotSchema>

export const DailyCheckInSnapshotSchema = Schema.Struct({
  checkInDate: IsoDateSchema,
  dailyIntention: Schema.NonEmptyString,
  ifThenPlan: Schema.String,
  cravingIntensity: Schema.NullOr(Schema.Int.pipe(Schema.between(0, 10))),
  triggerNotes: Schema.String,
  reflection: Schema.String,
  slipHappened: Schema.Boolean,
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
})
export type DailyCheckInSnapshot = Schema.Schema.Type<
  typeof DailyCheckInSnapshotSchema
>

export const DashboardSummarySchema = Schema.Struct({
  openQuests: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
  questsCompletedThisWeek: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
  habitLogsThisWeek: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
  checkInDone: Schema.Boolean,
})
export type DashboardSummary = Schema.Schema.Type<typeof DashboardSummarySchema>

export const DashboardPayloadSchema = Schema.Struct({
  today: IsoDateSchema,
  weekStart: IsoDateSchema,
  aiAvailable: Schema.Boolean,
  progress: ProgressSnapshotSchema,
  summary: DashboardSummarySchema,
  openQuests: Schema.Array(QuestSnapshotSchema),
  recentlyCompletedQuests: Schema.Array(QuestSnapshotSchema),
  habits: Schema.Array(HabitSnapshotSchema),
  recentHabitLogs: Schema.Array(HabitLogSnapshotSchema),
  todayCheckIn: Schema.NullOr(DailyCheckInSnapshotSchema),
})
export type DashboardPayload = Schema.Schema.Type<typeof DashboardPayloadSchema>

export const CreateQuestInputSchema = Schema.Struct({
  title: Schema.NonEmptyString,
  notes: Schema.String,
  difficulty: QuestDifficultySchema,
  dueDate: NullableDateSchema,
  xpReward: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
})
export type CreateQuestInput = Schema.Schema.Type<typeof CreateQuestInputSchema>

export const CreateHabitInputSchema = Schema.Struct({
  title: Schema.NonEmptyString,
  notes: Schema.String,
  kind: HabitKindSchema,
  xpReward: Schema.Int.pipe(Schema.greaterThanOrEqualTo(0)),
})
export type CreateHabitInput = Schema.Schema.Type<typeof CreateHabitInputSchema>

export const SaveCheckInInputSchema = Schema.Struct({
  dailyIntention: Schema.NonEmptyString,
  ifThenPlan: Schema.String,
  cravingIntensity: Schema.NullOr(Schema.Int.pipe(Schema.between(0, 10))),
  triggerNotes: Schema.String,
  reflection: Schema.String,
  slipHappened: Schema.Boolean,
})
export type SaveCheckInInput = Schema.Schema.Type<typeof SaveCheckInInputSchema>

export const MutationStatusSchema = Schema.Literal('created', 'updated', 'noop')
export type MutationStatus = Schema.Schema.Type<typeof MutationStatusSchema>

export const MutationResultSchema = Schema.Struct({
  status: MutationStatusSchema,
  message: Schema.NonEmptyString,
  dashboard: DashboardPayloadSchema,
})
export type MutationResult = Schema.Schema.Type<typeof MutationResultSchema>

export const CoachInsightSchema = Schema.Struct({
  heading: Schema.NonEmptyString,
  summary: Schema.NonEmptyString,
  momentum: Schema.Array(Schema.NonEmptyString),
  friction: Schema.Array(Schema.NonEmptyString),
  nextMoves: Schema.Array(Schema.NonEmptyString),
})
export type CoachInsight = Schema.Schema.Type<typeof CoachInsightSchema>

export const CoachPromptSchema = Schema.Struct({
  prompt: Schema.NonEmptyString,
})
export type CoachPrompt = Schema.Schema.Type<typeof CoachPromptSchema>
