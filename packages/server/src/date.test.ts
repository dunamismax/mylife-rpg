import { describe, expect, it } from 'vitest'
import {
  addDays,
  currentHabitStreak,
  nextHabitStreak,
  weekStartKey,
} from './date'

describe('date helpers', () => {
  it('computes week starts from Monday', () => {
    expect(weekStartKey('2026-03-12')).toBe('2026-03-09')
    expect(weekStartKey('2026-03-09')).toBe('2026-03-09')
  })

  it('adds days across boundaries without shifting time zones', () => {
    expect(addDays('2026-03-31', 1)).toBe('2026-04-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('advances and resets habit streaks correctly', () => {
    expect(nextHabitStreak(3, '2026-03-11', '2026-03-12')).toBe(4)
    expect(nextHabitStreak(3, '2026-03-10', '2026-03-12')).toBe(1)
    expect(nextHabitStreak(0, null, '2026-03-12')).toBe(1)
  })

  it('drops current streaks after a missed day', () => {
    expect(currentHabitStreak(4, '2026-03-12', '2026-03-12')).toBe(4)
    expect(currentHabitStreak(4, '2026-03-11', '2026-03-12')).toBe(4)
    expect(currentHabitStreak(4, '2026-03-10', '2026-03-12')).toBe(0)
    expect(currentHabitStreak(4, null, '2026-03-12')).toBe(0)
  })
})
