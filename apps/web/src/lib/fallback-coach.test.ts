import { fallbackCoachInsight } from '@questlog/ai/fallback'
import type { DashboardPayload, MutationResult } from '@questlog/contracts'
import { describe, expect, it } from 'vitest'
import { mergeDashboard } from './api'

const dashboardFixture: DashboardPayload = {
  today: '2026-03-12',
  weekStart: '2026-03-09',
  aiAvailable: false,
  progress: {
    level: 3,
    totalXp: 240,
  },
  summary: {
    openQuests: 4,
    questsCompletedThisWeek: 2,
    habitLogsThisWeek: 3,
    checkInDone: false,
  },
  openQuests: [
    {
      id: 'quest-1',
      title: 'Ship onboarding copy',
      notes: 'Tighten the product promise.',
      difficulty: 'medium',
      xpReward: 25,
      dueDate: '2026-03-12',
      completedAt: null,
      createdAt: '2026-03-12T08:00:00.000Z',
    },
    {
      id: 'quest-2',
      title: 'Review analytics',
      notes: '',
      difficulty: 'easy',
      xpReward: 10,
      dueDate: null,
      completedAt: null,
      createdAt: '2026-03-12T09:00:00.000Z',
    },
    {
      id: 'quest-3',
      title: 'Call supplier',
      notes: '',
      difficulty: 'hard',
      xpReward: 40,
      dueDate: null,
      completedAt: null,
      createdAt: '2026-03-12T10:00:00.000Z',
    },
    {
      id: 'quest-4',
      title: 'Plan next sprint',
      notes: '',
      difficulty: 'medium',
      xpReward: 20,
      dueDate: null,
      completedAt: null,
      createdAt: '2026-03-12T11:00:00.000Z',
    },
  ],
  recentlyCompletedQuests: [],
  habits: [
    {
      id: 'habit-1',
      title: 'Evening walk',
      notes: '',
      kind: 'build',
      xpReward: 10,
      streak: 5,
      currentStreak: 5,
      lastCompletedOn: '2026-03-12',
      createdAt: '2026-03-10T08:00:00.000Z',
    },
  ],
  recentHabitLogs: [],
  todayCheckIn: null,
}

describe('fallbackCoachInsight', () => {
  it('surfaces friction and next moves from the live dashboard shape', () => {
    const insight = fallbackCoachInsight(dashboardFixture)

    expect(insight.heading).toBe('Set the day before it drifts')
    expect(insight.momentum).toContain('Evening walk: streak 5')
    expect(insight.friction).toContain(
      'The quest list is getting crowded. Trim it to what can move this week.',
    )
    expect(insight.nextMoves[0]).toContain('Ship onboarding copy')
  })
})

describe('mergeDashboard', () => {
  it('prefers the mutation dashboard when one is returned', () => {
    const updatedDashboard = {
      ...dashboardFixture,
      summary: {
        ...dashboardFixture.summary,
        checkInDone: true,
      },
    }

    const result: MutationResult = {
      status: 'updated',
      message: 'Saved.',
      dashboard: updatedDashboard,
    }

    expect(mergeDashboard(dashboardFixture, result)).toEqual(updatedDashboard)
  })
})
