import type {
  CreateHabitInput,
  CreateQuestInput,
  DashboardPayload,
  HabitKind,
  QuestDifficulty,
  SaveCheckInInput,
} from '@questlog/contracts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle2,
  Flame,
  LoaderCircle,
  Logs,
  Plus,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react'
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from 'react'
import {
  completeQuestRequest,
  createHabitRequest,
  createQuestRequest,
  dashboardQueryKey,
  fetchDashboard,
  logHabitRequest,
  saveCheckInRequest,
} from '#/lib/api'
import { authClient } from '#/lib/auth-client'
import { buildCoachInsight } from '#/lib/coach-insight'

export const Route = createFileRoute('/')({
  component: HomePage,
})

type FlashState =
  | {
      tone: 'error' | 'success'
      message: string
    }
  | undefined

const questDifficultyOptions: Array<{
  label: string
  value: QuestDifficulty
}> = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
]

const habitKindOptions: Array<{
  label: string
  value: HabitKind
}> = [
  { label: 'Build', value: 'build' },
  { label: 'Avoid', value: 'avoid' },
]

function formatDay(value: string | null) {
  if (!value) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not finished'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function AuthPanel({ onSuccess }: { onSuccess: (message: string) => void }) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  return (
    <section className="panel rise-in rounded-[2rem] px-6 py-6 sm:px-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="kicker mb-2">Access</p>
          <h2 className="text-2xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
            {mode === 'sign-in' ? 'Return to your board' : 'Open your journal'}
          </h2>
        </div>
        <div className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:rgba(255,249,236,0.72)] p-1">
          <button
            type="button"
            className={`nav-pill ${mode === 'sign-in' ? 'nav-pill-active' : ''}`}
            onClick={() => setMode('sign-in')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`nav-pill ${mode === 'sign-up' ? 'nav-pill-active' : ''}`}
            onClick={() => setMode('sign-up')}
          >
            Sign up
          </button>
        </div>
      </div>

      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault()
          setPending(true)
          setError(undefined)

          try {
            if (mode === 'sign-in') {
              const response = await authClient.signIn.email({
                email,
                password,
                rememberMe: true,
              })

              if (response.error) {
                throw new Error(response.error.message ?? 'Sign in failed')
              }

              onSuccess('Signed in.')
            } else {
              const response = await authClient.signUp.email({
                name,
                email,
                password,
              })

              if (response.error) {
                throw new Error(response.error.message ?? 'Sign up failed')
              }

              onSuccess('Account created.')
            }
          } catch (authError) {
            setError(
              authError instanceof Error
                ? authError.message
                : 'Authentication failed',
            )
          } finally {
            setPending(false)
          }
        }}
      >
        {mode === 'sign-up' ? (
          <label className="field">
            <span className="field-label">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Sawyer"
              required
            />
          </label>
        ) : null}

        <label className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Use at least 8 characters"
            minLength={8}
            required
          />
        </label>

        {error ? <p className="flash flash-error">{error}</p> : null}

        <button type="submit" className="button-primary" disabled={pending}>
          {pending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Working
            </>
          ) : mode === 'sign-in' ? (
            'Enter QuestLog'
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </section>
  )
}

function CoachPanel({ dashboard }: { dashboard: DashboardPayload }) {
  const insight = useMemo(() => buildCoachInsight(dashboard), [dashboard])

  return (
    <section className="panel grid h-full gap-5 rounded-[2rem] px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="kicker mb-2">Coach snapshot</p>
          <h3 className="text-xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
            {insight.heading}
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:rgba(255,249,236,0.72)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
          <Sparkles className="h-3.5 w-3.5" />
          Live board-derived guidance
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-[color:rgba(255,249,236,0.7)] px-4 py-4">
        <p className="text-sm leading-7 text-[color:var(--ink)]">
          {insight.summary}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-[1.1rem] bg-[color:var(--surface-raised)] px-3 py-3">
            <p className="kicker mb-2">Momentum</p>
            <ul className="space-y-2 text-sm text-[color:var(--muted)]">
              {insight.momentum.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-[1.1rem] bg-[color:var(--surface-raised)] px-3 py-3">
            <p className="kicker mb-2">Friction</p>
            <ul className="space-y-2 text-sm text-[color:var(--muted)]">
              {insight.friction.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-[1.1rem] bg-[color:var(--surface-raised)] px-3 py-3">
            <p className="kicker mb-2">Next moves</p>
            <ul className="space-y-2 text-sm text-[color:var(--muted)]">
              {insight.nextMoves.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <section className="rounded-[1.4rem] border border-[color:var(--line)] bg-[color:rgba(30,37,28,0.04)] px-4 py-4">
        <p className="field-label mb-2">How to use this</p>
        <p className="text-sm leading-7 text-[color:var(--muted)]">
          This panel is generated from your quests, habits, and today&apos;s
          check-in. Use it to trim scope, protect a streak, and pick the
          smallest concrete move worth doing next.
        </p>
      </section>
    </section>
  )
}

function DashboardView({ dashboard }: { dashboard: DashboardPayload }) {
  const queryClient = useQueryClient()
  const [flash, setFlash] = useState<FlashState>()
  const [filter, setFilter] = useState('')
  const deferredFilter = useDeferredValue(filter)
  const [questTitle, setQuestTitle] = useState('')
  const [questNotes, setQuestNotes] = useState('')
  const [questDifficulty, setQuestDifficulty] =
    useState<QuestDifficulty>('medium')
  const [questDueDate, setQuestDueDate] = useState('')
  const [questXpReward, setQuestXpReward] = useState('25')
  const [habitTitle, setHabitTitle] = useState('')
  const [habitNotes, setHabitNotes] = useState('')
  const [habitKind, setHabitKind] = useState<HabitKind>('build')
  const [habitXpReward, setHabitXpReward] = useState('10')
  const [checkInState, setCheckInState] = useState<SaveCheckInInput>(() => ({
    dailyIntention: dashboard.todayCheckIn?.dailyIntention ?? '',
    ifThenPlan: dashboard.todayCheckIn?.ifThenPlan ?? '',
    cravingIntensity: dashboard.todayCheckIn?.cravingIntensity ?? null,
    triggerNotes: dashboard.todayCheckIn?.triggerNotes ?? '',
    reflection: dashboard.todayCheckIn?.reflection ?? '',
    slipHappened: dashboard.todayCheckIn?.slipHappened ?? false,
  }))

  useEffect(() => {
    setCheckInState({
      dailyIntention: dashboard.todayCheckIn?.dailyIntention ?? '',
      ifThenPlan: dashboard.todayCheckIn?.ifThenPlan ?? '',
      cravingIntensity: dashboard.todayCheckIn?.cravingIntensity ?? null,
      triggerNotes: dashboard.todayCheckIn?.triggerNotes ?? '',
      reflection: dashboard.todayCheckIn?.reflection ?? '',
      slipHappened: dashboard.todayCheckIn?.slipHappened ?? false,
    })
  }, [dashboard.todayCheckIn])

  const publishResult = useEffectEvent(
    (message: string, nextDashboard: DashboardPayload) => {
      queryClient.setQueryData(dashboardQueryKey, nextDashboard)
      startTransition(() => {
        setFlash({ tone: 'success', message })
      })
    },
  )

  const publishError = useEffectEvent((message: string) => {
    startTransition(() => {
      setFlash({ tone: 'error', message })
    })
  })

  const createQuestMutation = useMutation({
    mutationFn: createQuestRequest,
    onSuccess: (result) => {
      setQuestTitle('')
      setQuestNotes('')
      setQuestDifficulty('medium')
      setQuestDueDate('')
      setQuestXpReward('25')
      publishResult(result.message, result.dashboard)
    },
    onError: (error) => publishError(error.message),
  })

  const createHabitMutation = useMutation({
    mutationFn: createHabitRequest,
    onSuccess: (result) => {
      setHabitTitle('')
      setHabitNotes('')
      setHabitKind('build')
      setHabitXpReward('10')
      publishResult(result.message, result.dashboard)
    },
    onError: (error) => publishError(error.message),
  })

  const completeQuestMutation = useMutation({
    mutationFn: completeQuestRequest,
    onSuccess: (result) => publishResult(result.message, result.dashboard),
    onError: (error) => publishError(error.message),
  })

  const logHabitMutation = useMutation({
    mutationFn: logHabitRequest,
    onSuccess: (result) => publishResult(result.message, result.dashboard),
    onError: (error) => publishError(error.message),
  })

  const saveCheckInMutation = useMutation({
    mutationFn: saveCheckInRequest,
    onSuccess: (result) => publishResult(result.message, result.dashboard),
    onError: (error) => publishError(error.message),
  })

  const filteredDashboard = useMemo(() => {
    const query = deferredFilter.trim().toLowerCase()

    if (!query) {
      return dashboard
    }

    return {
      ...dashboard,
      openQuests: dashboard.openQuests.filter((quest) =>
        `${quest.title} ${quest.notes}`.toLowerCase().includes(query),
      ),
      habits: dashboard.habits.filter((habit) =>
        `${habit.title} ${habit.notes}`.toLowerCase().includes(query),
      ),
    }
  }, [dashboard, deferredFilter])

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <section className="hero-panel rise-in rounded-[2.4rem] px-6 py-8 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="kicker mb-3">Today, not someday</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-[color:var(--ink)] sm:text-6xl">
              Keep the board honest and the next move visible.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
              QuestLog stays narrow on purpose. Capture a few meaningful quests,
              reinforce recurring habits, and write one check-in that keeps the
              day from going vague.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="stat-card">
              <div className="flex items-center justify-between">
                <p className="kicker">Level</p>
                <Sparkles className="h-4 w-4 text-[color:var(--gold)]" />
              </div>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[color:var(--ink)]">
                {dashboard.progress.level}
              </p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                {dashboard.progress.totalXp} XP in reserve.
              </p>
            </article>
            <article className="stat-card">
              <div className="flex items-center justify-between">
                <p className="kicker">Open quests</p>
                <Target className="h-4 w-4 text-[color:var(--ember)]" />
              </div>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[color:var(--ink)]">
                {dashboard.summary.openQuests}
              </p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                {dashboard.summary.questsCompletedThisWeek} finished this week.
              </p>
            </article>
            <article className="stat-card">
              <div className="flex items-center justify-between">
                <p className="kicker">Habit logs</p>
                <Flame className="h-4 w-4 text-[color:var(--gold)]" />
              </div>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[color:var(--ink)]">
                {dashboard.summary.habitLogsThisWeek}
              </p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Logs since {formatDay(dashboard.weekStart)}.
              </p>
            </article>
            <article className="stat-card">
              <div className="flex items-center justify-between">
                <p className="kicker">Check-in</p>
                <ShieldAlert className="h-4 w-4 text-[color:var(--olive)]" />
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--ink)]">
                {dashboard.summary.checkInDone ? 'Saved' : 'Still open'}
              </p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                One row per day. No ceremony.
              </p>
            </article>
          </div>
        </div>
      </section>

      {flash ? (
        <div
          className={`flash mt-4 ${flash.tone === 'error' ? 'flash-error' : 'flash-success'}`}
        >
          {flash.message}
        </div>
      ) : null}

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel rounded-[2rem] px-5 py-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="kicker mb-2">Focus filter</p>
              <h2 className="text-2xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
                Trim the board to what matters now.
              </h2>
            </div>
            <Logs className="hidden h-5 w-5 text-[color:var(--muted)] sm:block" />
          </div>
          <label className="field">
            <span className="field-label">Search quests and habits</span>
            <input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Evening walk, sugar, email backlog..."
            />
          </label>
        </div>
        <CoachPanel dashboard={dashboard} />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <form
          className="panel grid gap-4 rounded-[2rem] px-5 py-5"
          onSubmit={(event) => {
            event.preventDefault()
            const payload: CreateQuestInput = {
              title: questTitle.trim(),
              notes: questNotes.trim(),
              difficulty: questDifficulty,
              dueDate: questDueDate || null,
              xpReward: Number(questXpReward),
            }
            createQuestMutation.mutate(payload)
          }}
        >
          <div>
            <p className="kicker mb-2">Quest</p>
            <h3 className="text-xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
              Add one finite commitment
            </h3>
          </div>
          <label className="field">
            <span className="field-label">Title</span>
            <input
              value={questTitle}
              onChange={(event) => setQuestTitle(event.target.value)}
              placeholder="Close the March billing loop"
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Notes</span>
            <textarea
              value={questNotes}
              onChange={(event) => setQuestNotes(event.target.value)}
              placeholder="What does done actually mean?"
              rows={4}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="field">
              <span className="field-label">Difficulty</span>
              <select
                value={questDifficulty}
                onChange={(event) =>
                  setQuestDifficulty(event.target.value as QuestDifficulty)
                }
              >
                {questDifficultyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Due</span>
              <input
                type="date"
                value={questDueDate}
                onChange={(event) => setQuestDueDate(event.target.value)}
              />
            </label>
            <label className="field">
              <span className="field-label">XP</span>
              <input
                type="number"
                min={0}
                value={questXpReward}
                onChange={(event) => setQuestXpReward(event.target.value)}
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="button-primary"
            disabled={createQuestMutation.isPending}
          >
            <Plus className="h-4 w-4" />
            Save quest
          </button>
        </form>

        <form
          className="panel grid gap-4 rounded-[2rem] px-5 py-5"
          onSubmit={(event) => {
            event.preventDefault()
            const payload: CreateHabitInput = {
              title: habitTitle.trim(),
              notes: habitNotes.trim(),
              kind: habitKind,
              xpReward: Number(habitXpReward),
            }
            createHabitMutation.mutate(payload)
          }}
        >
          <div>
            <p className="kicker mb-2">Habit</p>
            <h3 className="text-xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
              Add one repeatable behavior
            </h3>
          </div>
          <label className="field">
            <span className="field-label">Title</span>
            <input
              value={habitTitle}
              onChange={(event) => setHabitTitle(event.target.value)}
              placeholder="No late-night sugar"
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Notes</span>
            <textarea
              value={habitNotes}
              onChange={(event) => setHabitNotes(event.target.value)}
              placeholder="Keep the trigger visible."
              rows={4}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field">
              <span className="field-label">Kind</span>
              <select
                value={habitKind}
                onChange={(event) =>
                  setHabitKind(event.target.value as HabitKind)
                }
              >
                {habitKindOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">XP</span>
              <input
                type="number"
                min={0}
                value={habitXpReward}
                onChange={(event) => setHabitXpReward(event.target.value)}
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="button-primary"
            disabled={createHabitMutation.isPending}
          >
            <Plus className="h-4 w-4" />
            Save habit
          </button>
        </form>

        <form
          className="panel grid gap-4 rounded-[2rem] px-5 py-5"
          onSubmit={(event) => {
            event.preventDefault()
            saveCheckInMutation.mutate(checkInState)
          }}
        >
          <div>
            <p className="kicker mb-2">Check-in</p>
            <h3 className="text-xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
              Write the day down while it still bends
            </h3>
          </div>
          <label className="field">
            <span className="field-label">Daily intention</span>
            <input
              value={checkInState.dailyIntention}
              onChange={(event) =>
                setCheckInState((current) => ({
                  ...current,
                  dailyIntention: event.target.value,
                }))
              }
              placeholder="Protect the evening window"
              required
            />
          </label>
          <label className="field">
            <span className="field-label">If-then plan</span>
            <input
              value={checkInState.ifThenPlan}
              onChange={(event) =>
                setCheckInState((current) => ({
                  ...current,
                  ifThenPlan: event.target.value,
                }))
              }
              placeholder="If cravings spike, take a 10 minute walk."
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field">
              <span className="field-label">Craving intensity</span>
              <input
                type="number"
                min={0}
                max={10}
                value={checkInState.cravingIntensity ?? ''}
                onChange={(event) =>
                  setCheckInState((current) => ({
                    ...current,
                    cravingIntensity:
                      event.target.value === ''
                        ? null
                        : Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="field field-inline">
              <span className="field-label">Slip happened</span>
              <input
                type="checkbox"
                checked={checkInState.slipHappened}
                onChange={(event) =>
                  setCheckInState((current) => ({
                    ...current,
                    slipHappened: event.target.checked,
                  }))
                }
              />
            </label>
          </div>
          <label className="field">
            <span className="field-label">Trigger notes</span>
            <textarea
              value={checkInState.triggerNotes}
              onChange={(event) =>
                setCheckInState((current) => ({
                  ...current,
                  triggerNotes: event.target.value,
                }))
              }
              rows={3}
            />
          </label>
          <label className="field">
            <span className="field-label">Reflection</span>
            <textarea
              value={checkInState.reflection}
              onChange={(event) =>
                setCheckInState((current) => ({
                  ...current,
                  reflection: event.target.value,
                }))
              }
              rows={3}
            />
          </label>
          <button
            type="submit"
            className="button-primary"
            disabled={saveCheckInMutation.isPending}
          >
            <CheckCircle2 className="h-4 w-4" />
            Save check-in
          </button>
        </form>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_0.92fr]">
        <article className="panel rounded-[2rem] px-5 py-5">
          <div className="mb-4">
            <p className="kicker mb-2">Open quests</p>
            <h3 className="text-xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
              Ship commitments, don’t hoard them.
            </h3>
          </div>
          <div className="grid gap-3">
            {filteredDashboard.openQuests.length > 0 ? (
              filteredDashboard.openQuests.map((quest) => (
                <article
                  key={quest.id}
                  className="rounded-[1.3rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-[color:var(--ink)]">
                        {quest.title}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                        {quest.notes || 'No notes attached.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="button-secondary shrink-0"
                      disabled={completeQuestMutation.isPending}
                      onClick={() => completeQuestMutation.mutate(quest.id)}
                    >
                      Complete
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
                    <span className="tag">{quest.difficulty}</span>
                    <span className="tag">{quest.xpReward} XP</span>
                    <span className="tag">{formatDay(quest.dueDate)}</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-[color:var(--muted)]">
                No open quests match the current filter.
              </p>
            )}
          </div>
        </article>

        <article className="panel rounded-[2rem] px-5 py-5">
          <div className="mb-4">
            <p className="kicker mb-2">Habits</p>
            <h3 className="text-xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
              Make repetition visible.
            </h3>
          </div>
          <div className="grid gap-3">
            {filteredDashboard.habits.length > 0 ? (
              filteredDashboard.habits.map((habit) => (
                <article
                  key={habit.id}
                  className="rounded-[1.3rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-[color:var(--ink)]">
                        {habit.title}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                        {habit.notes || 'No notes attached.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="button-secondary shrink-0"
                      disabled={logHabitMutation.isPending}
                      onClick={() => logHabitMutation.mutate(habit.id)}
                    >
                      Log today
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
                    <span className="tag">{habit.kind}</span>
                    <span className="tag">streak {habit.currentStreak}</span>
                    <span className="tag">{habit.xpReward} XP</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-[color:var(--muted)]">
                No habits match the current filter.
              </p>
            )}
          </div>
        </article>

        <article className="panel rounded-[2rem] px-5 py-5">
          <div className="mb-4">
            <p className="kicker mb-2">Recent activity</p>
            <h3 className="text-xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
              Proof beats mood.
            </h3>
          </div>
          <div className="grid gap-5">
            <section>
              <p className="field-label mb-2">Completed quests</p>
              <div className="grid gap-2">
                {dashboard.recentlyCompletedQuests.length > 0 ? (
                  dashboard.recentlyCompletedQuests.map((quest) => (
                    <div key={quest.id} className="activity-row">
                      <span>{quest.title}</span>
                      <span>{formatTimestamp(quest.completedAt)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[color:var(--muted)]">
                    Nothing finished yet.
                  </p>
                )}
              </div>
            </section>
            <section>
              <p className="field-label mb-2">Habit logs</p>
              <div className="grid gap-2">
                {dashboard.recentHabitLogs.length > 0 ? (
                  dashboard.recentHabitLogs.map((log) => (
                    <div key={log.id} className="activity-row">
                      <span>{log.habitTitle}</span>
                      <span>{formatDay(log.loggedOn)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[color:var(--muted)]">
                    No habit logs yet.
                  </p>
                )}
              </div>
            </section>
          </div>
        </article>
      </section>
    </main>
  )
}

function HomePage() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [flash, setFlash] = useState<FlashState>()
  const dashboardQuery = useQuery({
    queryKey: dashboardQueryKey,
    queryFn: fetchDashboard,
    enabled: Boolean(session?.user),
  })

  if (sessionPending) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-10">
        <section className="panel rise-in rounded-[2.4rem] px-6 py-12">
          <div className="flex items-center gap-3 text-[color:var(--muted)]">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading your journal
          </div>
        </section>
      </main>
    )
  }

  if (!session?.user) {
    return (
      <main className="mx-auto grid max-w-7xl gap-5 px-5 py-10 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="hero-panel rise-in rounded-[2.6rem] px-6 py-8 sm:px-8 sm:py-10">
          <p className="kicker mb-4">Rebuilt stack</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.07em] text-[color:var(--ink)] sm:text-7xl">
            Ground the day before it drifts.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
            This rewrite drops the life-RPG noise. Track a few finite quests,
            repeatable habits, and one daily check-in. The stack is modern; the
            product is intentionally small.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [
                'Bun workspace',
                'One runtime and package manager across the monorepo.',
              ],
              [
                'Zod + Drizzle',
                'Validation and persistence stay typed without extra runtime layers.',
              ],
              [
                'Better Auth + Query',
                'Auth, routing, and dashboard state stay focused on the journal.',
              ],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-[color:rgba(204,185,142,0.6)] bg-[color:rgba(255,249,236,0.72)] px-4 py-4"
              >
                <p className="kicker mb-2">{title}</p>
                <p className="text-sm leading-7 text-[color:var(--ink)]">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          {flash ? (
            <div
              className={`flash ${flash.tone === 'error' ? 'flash-error' : 'flash-success'}`}
            >
              {flash.message}
            </div>
          ) : null}
          <AuthPanel
            onSuccess={(message) => {
              startTransition(() => setFlash({ tone: 'success', message }))
            }}
          />
        </div>
      </main>
    )
  }

  if (dashboardQuery.isPending) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-10">
        <section className="panel rise-in rounded-[2.4rem] px-6 py-12">
          <div className="flex items-center gap-3 text-[color:var(--muted)]">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading dashboard state
          </div>
        </section>
      </main>
    )
  }

  if (dashboardQuery.error || !dashboardQuery.data) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-10">
        <section className="panel rounded-[2rem] px-6 py-8">
          <p className="kicker mb-2">Dashboard error</p>
          <h2 className="text-2xl font-semibold tracking-[-0.05em] text-[color:var(--ink)]">
            The journal could not load.
          </h2>
          <p className="mt-3 text-base text-[color:var(--muted)]">
            {dashboardQuery.error?.message ?? 'Unknown error'}
          </p>
        </section>
      </main>
    )
  }

  return <DashboardView dashboard={dashboardQuery.data} />
}
