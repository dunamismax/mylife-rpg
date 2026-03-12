import type { CoachInsight, DashboardPayload } from '@questlog/contracts'

export const fallbackCoachInsight = (
  dashboard: DashboardPayload,
): CoachInsight => {
  const momentum = dashboard.habits
    .filter((habit) => habit.currentStreak > 0)
    .sort((left, right) => right.currentStreak - left.currentStreak)
    .slice(0, 3)
    .map((habit) => `${habit.title}: streak ${habit.currentStreak}`)

  const friction = [
    dashboard.openQuests.length > 3
      ? 'The quest list is getting crowded. Trim it to what can move this week.'
      : null,
    !dashboard.summary.checkInDone
      ? 'The daily check-in is still open, so the day lacks an explicit plan.'
      : null,
    dashboard.habits.every((habit) => habit.currentStreak === 0)
      ? 'No habit streak is active right now, so consistency needs a reset.'
      : null,
  ].filter((item): item is string => !!item)

  const nextMoves = [
    dashboard.openQuests[0]
      ? `Finish or split "${dashboard.openQuests[0].title}" before adding another quest.`
      : 'Create one concrete quest for the next meaningful action.',
    dashboard.summary.checkInDone
      ? 'Use tonight’s reflection to note the smallest repeatable win.'
      : 'Save a daily check-in with a specific if-then plan before the day slips.',
    dashboard.habits[0]
      ? `Log "${dashboard.habits[0].title}" as soon as it is complete instead of batching it later.`
      : 'Add one habit you can complete every day without negotiation.',
  ]

  return {
    heading: dashboard.summary.checkInDone
      ? 'Keep the system narrow'
      : 'Set the day before it drifts',
    summary:
      dashboard.openQuests.length === 0
        ? 'The board is clear enough to focus on consistency rather than accumulation.'
        : `You have ${dashboard.openQuests.length} open quests, so execution discipline matters more than adding scope.`,
    momentum:
      momentum.length > 0
        ? momentum
        : ['Momentum is available once one habit gets logged today.'],
    friction:
      friction.length > 0
        ? friction
        : ['The main risk is spreading attention across too many small tasks.'],
    nextMoves,
  }
}
