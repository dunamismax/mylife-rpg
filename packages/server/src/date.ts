const localDateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export const todayKey = () => localDateFormatter.format(new Date())

export const fromDateKey = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

export const toDateKey = (date: Date) => localDateFormatter.format(date)

export const addDays = (value: string, amount: number) => {
  const next = fromDateKey(value)
  next.setDate(next.getDate() + amount)
  return toDateKey(next)
}

export const weekStartKey = (value: string) => {
  const current = fromDateKey(value)
  const weekday = (current.getDay() + 6) % 7
  current.setDate(current.getDate() - weekday)
  return toDateKey(current)
}

export const startOfDay = (value: string) => {
  const date = fromDateKey(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export const nextHabitStreak = (
  streak: number,
  lastCompletedOn: string | null,
  loggedOn: string,
) => {
  if (lastCompletedOn === addDays(loggedOn, -1)) {
    return streak + 1
  }

  return 1
}

export const currentHabitStreak = (
  streak: number,
  lastCompletedOn: string | null,
  today: string,
) => {
  if (!lastCompletedOn) {
    return 0
  }

  if (lastCompletedOn < addDays(today, -1)) {
    return 0
  }

  return streak
}

export const toIsoString = (value: Date | null) => value?.toISOString() ?? null
