import { useMemo, useState } from "react";
import type { MetaFunction } from "react-router";

import { Button } from "../components/ui/button";
import { demoState } from "../data/demo-state";
import {
  createHabit,
  createQuest,
  dashboardMetrics,
  logHabitSlip,
  saveDailyCheckIn,
  toggleHabit,
  toggleQuest,
} from "../lib/rpg-engine";
import { dailyCheckInSchema, habitFormSchema, questFormSchema } from "../lib/validators";

export const meta: MetaFunction = () => [
  { title: "MyLife RPG" },
  {
    name: "description",
    content: "Life-ops dashboard built with React Router, Tailwind, TypeScript, and Bun.",
  },
];

export default function HomeRoute() {
  const [state, setState] = useState(demoState);
  const [questError, setQuestError] = useState<string | null>(null);
  const [habitError, setHabitError] = useState<string | null>(null);
  const [checkInError, setCheckInError] = useState<string | null>(null);

  const [questForm, setQuestForm] = useState({
    title: "",
    description: "",
    type: "daily",
    difficulty: "",
    dueDate: "",
    xpReward: "25",
  });

  const [habitForm, setHabitForm] = useState({
    title: "",
    description: "",
    type: "good",
    xpReward: "10",
  });

  const [checkInForm, setCheckInForm] = useState({
    dailyIntention: state.dailyCheckIn.dailyIntention,
    ifThenPlan: state.dailyCheckIn.ifThenPlan ?? "",
    cravingIntensity: state.dailyCheckIn.cravingIntensity?.toString() ?? "",
    triggerNotes: state.dailyCheckIn.triggerNotes ?? "",
    reflection: state.dailyCheckIn.reflection ?? "",
    slipHappened: state.dailyCheckIn.slipHappened,
  });

  const now = new Date();
  const metrics = useMemo(() => dashboardMetrics(state, now), [state, now]);
  const activeEffects = state.statusEffects.filter((effect) => {
    if (!effect.isActive) {
      return false;
    }

    if (!effect.expiresAt) {
      return true;
    }

    return new Date(effect.expiresAt) > now;
  });

  function onCreateQuest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = questFormSchema.safeParse({
      title: questForm.title,
      description: questForm.description,
      type: questForm.type,
      difficulty: questForm.difficulty || undefined,
      dueDate: questForm.dueDate || undefined,
      xpReward: questForm.xpReward,
    });

    if (!parsed.success) {
      setQuestError(parsed.error.issues[0]?.message ?? "Invalid quest.");
      return;
    }

    setQuestError(null);
    setState((current) => ({
      ...current,
      quests: [createQuest(parsed.data, now), ...current.quests],
    }));

    setQuestForm({
      title: "",
      description: "",
      type: "daily",
      difficulty: "",
      dueDate: "",
      xpReward: "25",
    });
  }

  function onCreateHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = habitFormSchema.safeParse({
      title: habitForm.title,
      description: habitForm.description,
      type: habitForm.type,
      xpReward: habitForm.xpReward,
    });

    if (!parsed.success) {
      setHabitError(parsed.error.issues[0]?.message ?? "Invalid habit.");
      return;
    }

    setHabitError(null);
    setState((current) => ({
      ...current,
      habits: [createHabit(parsed.data, now), ...current.habits],
    }));

    setHabitForm({
      title: "",
      description: "",
      type: "good",
      xpReward: "10",
    });
  }

  function onSaveCheckIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = dailyCheckInSchema.safeParse({
      dailyIntention: checkInForm.dailyIntention,
      ifThenPlan: checkInForm.ifThenPlan,
      cravingIntensity: checkInForm.cravingIntensity || undefined,
      triggerNotes: checkInForm.triggerNotes,
      reflection: checkInForm.reflection,
      slipHappened: checkInForm.slipHappened,
    });

    if (!parsed.success) {
      setCheckInError(parsed.error.issues[0]?.message ?? "Invalid check-in.");
      return;
    }

    setCheckInError(null);
    setState((current) =>
      saveDailyCheckIn(
        current,
        {
          dailyIntention: parsed.data.dailyIntention,
          ifThenPlan: parsed.data.ifThenPlan || null,
          cravingIntensity: parsed.data.cravingIntensity ?? null,
          triggerNotes: parsed.data.triggerNotes || null,
          reflection: parsed.data.reflection || null,
          slipHappened: parsed.data.slipHappened,
        },
        now,
      ),
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-100 via-panel to-accent-soft/50 p-6">
        <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              MyLife RPG
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              Your life is the campaign. Build momentum one turn at a time.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 md:text-base">
              This dashboard runs on Bun + React Router + TypeScript and keeps the same domain loop:
              quests, habits, daily check-ins, and RPG stats.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-1 md:text-right">
            <div>
              <p className="text-zinc-500">Level</p>
              <p className="text-2xl font-semibold">{state.stats.level}</p>
            </div>
            <div>
              <p className="text-zinc-500">XP</p>
              <p className="text-2xl font-semibold">{state.stats.xp}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Good Habits Today" value={metrics.todayGoodHabits} />
        <Metric label="Bad Habits Resisted" value={metrics.todayBadHabitsResisted} />
        <Metric label="Quests This Week" value={metrics.questsCompletedThisWeek} />
        <Metric label="Quest Completion" value={`${metrics.questCompletionRate}%`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-zinc-200 bg-panel p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
            Character Stats
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <StatRow label="HP" value={state.stats.hp} />
            <StatRow label="Best Streak" value={metrics.bestHabitStreak} />
            <StatRow label="STR" value={state.stats.strength} />
            <StatRow label="END" value={state.stats.endurance} />
            <StatRow label="INT" value={state.stats.intelligence} />
            <StatRow label="WIS" value={state.stats.wisdom} />
            <StatRow label="CHA" value={state.stats.charisma} />
            <StatRow label="WIL" value={state.stats.willpower} />
          </dl>
        </article>

        <article className="rounded-xl border border-zinc-200 bg-panel p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
            Achievements
          </h2>
          <div className="mt-3 space-y-2">
            {state.achievements.length === 0 ? (
              <p className="text-sm text-zinc-500">No achievements unlocked yet.</p>
            ) : (
              state.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="rounded-lg border border-zinc-200 bg-panel-soft p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{achievement.name}</p>
                    <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs text-white">
                      Unlocked
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">{achievement.description}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-xl border border-zinc-200 bg-panel p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
            Active Status Effects
          </h2>
          <div className="mt-3 space-y-2">
            {activeEffects.length === 0 ? (
              <p className="text-sm text-zinc-500">No active status effects.</p>
            ) : (
              activeEffects.map((effect) => (
                <div
                  key={effect.id}
                  className="rounded-lg border border-zinc-200 bg-panel-soft p-3"
                >
                  <p className="font-medium">{effect.name}</p>
                  <p className="text-xs text-zinc-600">{effect.penalty}</p>
                  <p className="mt-1 text-xs text-zinc-500">{effect.description}</p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-panel p-5">
        <h2 className="text-lg font-semibold">Daily Check-In</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Intention, trigger notes, and reflection for recovery loops.
        </p>
        <form className="mt-4 grid gap-3" onSubmit={onSaveCheckIn}>
          <input
            className="rounded-md border border-zinc-300 px-3 py-2"
            placeholder="Today's intention"
            value={checkInForm.dailyIntention}
            onChange={(event) =>
              setCheckInForm((current) => ({ ...current, dailyIntention: event.target.value }))
            }
          />
          <input
            className="rounded-md border border-zinc-300 px-3 py-2"
            placeholder="If-then plan"
            value={checkInForm.ifThenPlan}
            onChange={(event) =>
              setCheckInForm((current) => ({ ...current, ifThenPlan: event.target.value }))
            }
          />
          <input
            className="rounded-md border border-zinc-300 px-3 py-2"
            placeholder="Craving intensity 0-10"
            value={checkInForm.cravingIntensity}
            onChange={(event) =>
              setCheckInForm((current) => ({ ...current, cravingIntensity: event.target.value }))
            }
          />
          <textarea
            className="min-h-20 rounded-md border border-zinc-300 px-3 py-2"
            placeholder="Trigger notes"
            value={checkInForm.triggerNotes}
            onChange={(event) =>
              setCheckInForm((current) => ({ ...current, triggerNotes: event.target.value }))
            }
          />
          <textarea
            className="min-h-20 rounded-md border border-zinc-300 px-3 py-2"
            placeholder="Evening reflection"
            value={checkInForm.reflection}
            onChange={(event) =>
              setCheckInForm((current) => ({ ...current, reflection: event.target.value }))
            }
          />
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              checked={checkInForm.slipHappened}
              onChange={(event) =>
                setCheckInForm((current) => ({ ...current, slipHappened: event.target.checked }))
              }
              type="checkbox"
            />
            I slipped on a bad habit today
          </label>

          {checkInError ? <p className="text-sm text-red-700">{checkInError}</p> : null}
          <Button type="submit">Save Check-In</Button>
        </form>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-panel p-4">
          <h2 className="text-lg font-semibold">Quests</h2>
          <form className="mt-3 grid gap-2" onSubmit={onCreateQuest}>
            <input
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Quest title"
              value={questForm.title}
              onChange={(event) =>
                setQuestForm((current) => ({ ...current, title: event.target.value }))
              }
            />
            <textarea
              className="min-h-20 rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Description"
              value={questForm.description}
              onChange={(event) =>
                setQuestForm((current) => ({ ...current, description: event.target.value }))
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                className="rounded-md border border-zinc-300 px-3 py-2"
                value={questForm.type}
                onChange={(event) =>
                  setQuestForm((current) => ({ ...current, type: event.target.value }))
                }
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="major">Major</option>
              </select>
              <select
                className="rounded-md border border-zinc-300 px-3 py-2"
                value={questForm.difficulty}
                onChange={(event) =>
                  setQuestForm((current) => ({ ...current, difficulty: event.target.value }))
                }
              >
                <option value="">No difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="boss">Boss</option>
              </select>
              <input
                className="rounded-md border border-zinc-300 px-3 py-2"
                type="date"
                value={questForm.dueDate}
                onChange={(event) =>
                  setQuestForm((current) => ({ ...current, dueDate: event.target.value }))
                }
              />
              <input
                className="rounded-md border border-zinc-300 px-3 py-2"
                value={questForm.xpReward}
                onChange={(event) =>
                  setQuestForm((current) => ({ ...current, xpReward: event.target.value }))
                }
                placeholder="XP reward"
              />
            </div>
            {questError ? <p className="text-sm text-red-700">{questError}</p> : null}
            <Button type="submit">Create Quest</Button>
          </form>
          <div className="mt-4 space-y-2">
            {state.quests.map((quest) => (
              <div key={quest.id} className="rounded-lg border border-zinc-200 bg-panel-soft p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={quest.completed ? "font-medium line-through" : "font-medium"}>
                      {quest.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {quest.type.toUpperCase()}{" "}
                      {quest.difficulty ? `• ${quest.difficulty.toUpperCase()}` : ""} •{" "}
                      {quest.xpReward} XP
                    </p>
                    {quest.description ? (
                      <p className="mt-1 text-sm text-zinc-600">{quest.description}</p>
                    ) : null}
                  </div>
                  <Button
                    size="sm"
                    variant={quest.completed ? "secondary" : "outline"}
                    onClick={() =>
                      setState((current) => toggleQuest(current, quest.id, new Date()))
                    }
                    type="button"
                  >
                    {quest.completed ? "Undo" : "Complete"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-zinc-200 bg-panel p-4">
          <h2 className="text-lg font-semibold">Habits</h2>
          <form className="mt-3 grid gap-2" onSubmit={onCreateHabit}>
            <input
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Habit title"
              value={habitForm.title}
              onChange={(event) =>
                setHabitForm((current) => ({ ...current, title: event.target.value }))
              }
            />
            <textarea
              className="min-h-20 rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Description"
              value={habitForm.description}
              onChange={(event) =>
                setHabitForm((current) => ({ ...current, description: event.target.value }))
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                className="rounded-md border border-zinc-300 px-3 py-2"
                value={habitForm.type}
                onChange={(event) =>
                  setHabitForm((current) => ({ ...current, type: event.target.value }))
                }
              >
                <option value="good">Good</option>
                <option value="bad">Bad</option>
              </select>
              <input
                className="rounded-md border border-zinc-300 px-3 py-2"
                value={habitForm.xpReward}
                onChange={(event) =>
                  setHabitForm((current) => ({ ...current, xpReward: event.target.value }))
                }
                placeholder="XP reward"
              />
            </div>
            {habitError ? <p className="text-sm text-red-700">{habitError}</p> : null}
            <Button type="submit">Create Habit</Button>
          </form>
          <div className="mt-4 space-y-2">
            {state.habits.map((habit) => (
              <div key={habit.id} className="rounded-lg border border-zinc-200 bg-panel-soft p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{habit.title}</p>
                    <p className="text-xs text-zinc-500">
                      {habit.type.toUpperCase()} • Streak {habit.streak} • {habit.xpReward} XP
                    </p>
                    {habit.description ? (
                      <p className="mt-1 text-sm text-zinc-600">{habit.description}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setState((current) => toggleHabit(current, habit.id, new Date()))
                      }
                      type="button"
                    >
                      Toggle
                    </Button>
                    {habit.type === "bad" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setState((current) => logHabitSlip(current, habit.id, new Date()))
                        }
                        type="button"
                      >
                        Log Slip
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-panel p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </article>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </>
  );
}
