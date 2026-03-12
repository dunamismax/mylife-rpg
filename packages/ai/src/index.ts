import { Agent } from '@mastra/core/agent'
import { Mastra } from '@mastra/core/mastra'
import { createStep, createWorkflow } from '@mastra/core/workflows'
import type { CoachInsight, DashboardPayload } from '@questlog/contracts'
import { z } from 'zod'
import { fallbackCoachInsight } from './fallback'

const coachInsightSchema = z.object({
  heading: z.string().min(1),
  summary: z.string().min(1),
  momentum: z.array(z.string().min(1)).min(1).max(3),
  friction: z.array(z.string().min(1)).min(1).max(3),
  nextMoves: z.array(z.string().min(1)).min(2).max(4),
})

const coachAgent = new Agent({
  id: 'questlog-coach-agent',
  name: 'Questlog Coach',
  instructions: `You are a pragmatic personal systems coach inside QuestLog.

Return compact, specific guidance.
Focus on:
- unfinished work that is actually near-term
- habit momentum versus streak theater
- one concrete daily intention adjustment
- two to four next moves that are realistic today

Avoid generic productivity advice and avoid motivational filler.`,
  model: process.env.MASTRA_MODEL ?? 'openai/gpt-4o-mini',
})

const coachWorkflow = createWorkflow({
  id: 'questlog-coach-workflow',
  inputSchema: z.object({
    prompt: z.string().min(1),
  }),
  outputSchema: coachInsightSchema,
})
  .then(
    createStep(coachAgent, {
      structuredOutput: {
        schema: coachInsightSchema,
      },
    }),
  )
  .commit()

const mastra = new Mastra({
  agents: {
    coach: coachAgent,
  },
  workflows: {
    coach: coachWorkflow,
  },
})

const summarizeHabits = (dashboard: DashboardPayload) =>
  dashboard.habits
    .map(
      (habit) =>
        `${habit.title} (${habit.kind}) streak=${habit.currentStreak} reward=${habit.xpReward}`,
    )
    .join('\n')

const summarizeOpenQuests = (dashboard: DashboardPayload) =>
  dashboard.openQuests
    .map(
      (quest) =>
        `${quest.title} difficulty=${quest.difficulty} reward=${quest.xpReward} due=${quest.dueDate ?? 'none'}`,
    )
    .join('\n')

const latestCheckInSummary = (dashboard: DashboardPayload) => {
  if (!dashboard.todayCheckIn) {
    return 'No check-in saved today.'
  }

  const checkIn = dashboard.todayCheckIn

  return [
    `Daily intention: ${checkIn.dailyIntention}`,
    `If-then plan: ${checkIn.ifThenPlan || 'none'}`,
    `Craving intensity: ${checkIn.cravingIntensity ?? 'unset'}`,
    `Slip happened: ${checkIn.slipHappened ? 'yes' : 'no'}`,
    `Trigger notes: ${checkIn.triggerNotes || 'none'}`,
    `Reflection: ${checkIn.reflection || 'none'}`,
  ].join('\n')
}

export const buildCoachPrompt = (
  dashboard: DashboardPayload,
  userPrompt: string,
) => `Today: ${dashboard.today}
Week start: ${dashboard.weekStart}
Level: ${dashboard.progress.level}
XP: ${dashboard.progress.totalXp}

Weekly summary:
- Open quests: ${dashboard.summary.openQuests}
- Quests completed this week: ${dashboard.summary.questsCompletedThisWeek}
- Habit logs this week: ${dashboard.summary.habitLogsThisWeek}
- Check-in done: ${dashboard.summary.checkInDone}

Open quests:
${summarizeOpenQuests(dashboard) || 'none'}

Habits:
${summarizeHabits(dashboard) || 'none'}

Check-in:
${latestCheckInSummary(dashboard)}

User request:
${userPrompt}

Return a concise coaching response as structured data.`

export const generateCoachInsight = async (
  dashboard: DashboardPayload,
  userPrompt: string,
): Promise<CoachInsight> => {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackCoachInsight(dashboard)
  }

  const run = await mastra.getWorkflow('coach').createRun()
  const result = await run.start({
    inputData: {
      prompt: buildCoachPrompt(dashboard, userPrompt),
    },
  })

  if (result.status !== 'success') {
    return fallbackCoachInsight(dashboard)
  }

  return result.result
}
