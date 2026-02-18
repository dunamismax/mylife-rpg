import type {
  Achievement,
  DailyCheckIn,
  GameState,
  Habit,
  Quest,
  Stat,
  StatShortCode,
  StatusEffect,
} from "./types";
import { nowIso, toIsoDate } from "./utils";

function randomId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function createQuest(
  input: {
    title: string;
    description?: string;
    type: Quest["type"];
    difficulty?: Quest["difficulty"];
    dueDate?: string;
    xpReward: number;
  },
  now: Date,
): Quest {
  return {
    id: randomId("quest"),
    title: input.title,
    description: input.description ? input.description : null,
    type: input.type,
    difficulty: input.difficulty ?? null,
    xpReward: input.xpReward,
    statsAffected: null,
    hpAffected: null,
    completed: false,
    dueDate: input.dueDate ? `${input.dueDate}T23:59:59.999Z` : null,
    completedAt: null,
    xpRewardedAt: null,
    createdAt: nowIso(now),
  };
}

export function createHabit(
  input: {
    title: string;
    description?: string;
    type: Habit["type"];
    xpReward: number;
  },
  now: Date,
): Habit {
  return {
    id: randomId("habit"),
    title: input.title,
    description: input.description ? input.description : null,
    type: input.type,
    xpReward: input.xpReward,
    statsAffected: null,
    hpAffected: null,
    streak: 0,
    lastCompletedAt: null,
    xpRewardedOn: null,
    createdAt: nowIso(now),
  };
}

function applyStatStringEffects(statsAffected: string | null, current: Stat): Stat {
  if (!statsAffected?.trim()) {
    return current;
  }

  const next = { ...current };
  const statMap: Record<StatShortCode, keyof Stat> = {
    STR: "strength",
    END: "endurance",
    INT: "intelligence",
    WIS: "wisdom",
    CHA: "charisma",
    WIL: "willpower",
    HP: "hp",
  };

  const matches = statsAffected.matchAll(/([+-]\d+)\s*(STR|END|INT|WIS|CHA|WIL|HP)/gi);

  for (const match of matches) {
    const amount = Number.parseInt(match[1], 10);
    const key = match[2].toUpperCase() as StatShortCode;
    const field = statMap[key];
    const currentValue = next[field];
    const candidate = currentValue + amount;
    next[field] = field === "hp" ? Math.max(candidate, 0) : Math.max(candidate, 1);
  }

  return next;
}

export function applyProgress(
  stats: Stat,
  xpGained: number,
  hpAffected: number | null,
  statsAffected: string | null,
): Stat {
  const next: Stat = {
    ...stats,
    xp: Math.max(stats.xp + Math.max(xpGained, 0), 0),
    hp: Math.max(stats.hp + (hpAffected ?? 0), 0),
  };

  const newLevel = Math.floor(next.xp / 100) + 1;
  const levelUps = Math.max(newLevel - stats.level, 0);
  next.level = newLevel;

  if (levelUps > 0) {
    next.hp += levelUps * 5;
    next.strength += levelUps;
    next.endurance += levelUps;
    next.intelligence += levelUps;
    next.wisdom += levelUps;
    next.charisma += levelUps;
    next.willpower += levelUps;
  }

  return applyStatStringEffects(statsAffected, next);
}

function unlockAchievement(
  current: Achievement[],
  now: Date,
  nextAchievement: Omit<Achievement, "id" | "unlocked" | "unlockedAt">,
): Achievement[] {
  const unlockedAt = nowIso(now);
  const existing = current.find((achievement) => achievement.name === nextAchievement.name);

  if (existing) {
    return current.map((achievement) =>
      achievement.name === nextAchievement.name
        ? { ...achievement, ...nextAchievement, unlocked: true, unlockedAt }
        : achievement,
    );
  }

  return [
    ...current,
    {
      id: randomId("achievement"),
      ...nextAchievement,
      unlocked: true,
      unlockedAt,
    },
  ];
}

function evaluateAchievements(state: GameState, now: Date): Achievement[] {
  const completedQuestCount = state.quests.filter((quest) => quest.completed).length;
  const bestHabitStreak = state.habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
  const dailyCheckInCount = state.dailyCheckIn.dailyIntention ? 1 : 0;

  let achievements = [...state.achievements];

  if (completedQuestCount >= 1) {
    achievements = unlockAchievement(achievements, now, {
      name: "First Quest Complete",
      description: "Completed your first quest.",
      condition: "Complete 1 quest",
      reward: "+50 XP bonus potential",
    });
  }

  if (completedQuestCount >= 10) {
    achievements = unlockAchievement(achievements, now, {
      name: "Quest Grinder",
      description: "Completed at least ten quests.",
      condition: "Complete 10 quests",
      reward: "+2 Strength",
    });
  }

  if (bestHabitStreak >= 7) {
    achievements = unlockAchievement(achievements, now, {
      name: "Habit Hero",
      description: "Built a seven-day habit streak.",
      condition: "Reach a 7-day streak",
      reward: "+2 Willpower",
    });
  }

  if (dailyCheckInCount >= 1) {
    achievements = unlockAchievement(achievements, now, {
      name: "Mindful Adventurer",
      description: "Completed a daily check-in.",
      condition: "Complete daily check-ins",
      reward: "+1 Wisdom",
    });
  }

  return achievements;
}

export function toggleQuest(state: GameState, questId: string, now: Date): GameState {
  let xpToApply = 0;
  let hpAffected: number | null = null;
  let statsAffected: string | null = null;

  const quests = state.quests.map((quest) => {
    if (quest.id !== questId) {
      return quest;
    }

    const completing = !quest.completed;
    const awarding = completing && quest.xpRewardedAt === null;

    if (awarding) {
      xpToApply = quest.xpReward;
      hpAffected = quest.hpAffected;
      statsAffected = quest.statsAffected;
    }

    return {
      ...quest,
      completed: completing,
      completedAt: completing ? nowIso(now) : null,
      xpRewardedAt: awarding ? nowIso(now) : quest.xpRewardedAt,
    };
  });

  const nextState = {
    ...state,
    quests,
    stats:
      xpToApply > 0 || hpAffected !== null || statsAffected !== null
        ? applyProgress(state.stats, xpToApply, hpAffected, statsAffected)
        : state.stats,
  };

  return {
    ...nextState,
    achievements: evaluateAchievements(nextState, now),
  };
}

export function toggleHabit(state: GameState, habitId: string, now: Date): GameState {
  const today = toIsoDate(now);
  let xpToApply = 0;
  let hpAffected: number | null = null;
  let statsAffected: string | null = null;

  const habits = state.habits.map((habit) => {
    if (habit.id !== habitId) {
      return habit;
    }

    if (habit.lastCompletedAt === today) {
      return {
        ...habit,
        lastCompletedAt: null,
        streak: Math.max(habit.streak - 1, 0),
      };
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const newStreak = habit.lastCompletedAt === toIsoDate(yesterday) ? habit.streak + 1 : 1;
    const awarding = habit.xpRewardedOn !== today;

    if (awarding) {
      xpToApply = habit.xpReward;
      hpAffected = habit.hpAffected;
      statsAffected = habit.statsAffected;
    }

    return {
      ...habit,
      lastCompletedAt: today,
      streak: newStreak,
      xpRewardedOn: awarding ? today : habit.xpRewardedOn,
    };
  });

  const nextState = {
    ...state,
    habits,
    stats:
      xpToApply > 0 || hpAffected !== null || statsAffected !== null
        ? applyProgress(state.stats, xpToApply, hpAffected, statsAffected)
        : state.stats,
  };

  return {
    ...nextState,
    achievements: evaluateAchievements(nextState, now),
  };
}

export function logHabitSlip(state: GameState, habitId: string, now: Date): GameState {
  const target = state.habits.find((habit) => habit.id === habitId);
  if (!target || target.type !== "bad") {
    return state;
  }

  const today = toIsoDate(now);
  const alreadyPenalized = state.statusEffects.some(
    (effect) => effect.name === "Temptation Hangover" && effect.appliedAt.startsWith(today),
  );

  const habits = state.habits.map((habit) =>
    habit.id === habitId
      ? {
          ...habit,
          lastCompletedAt: null,
          streak: 0,
          xpRewardedOn: null,
        }
      : habit,
  );

  const statusEffects: StatusEffect[] = alreadyPenalized
    ? state.statusEffects
    : [
        {
          id: randomId("effect"),
          name: "Temptation Hangover",
          description: "A slip happened today. Recover with one focused win.",
          cause: `Slip logged: ${target.title}`,
          duration: "1 day",
          penalty: "-1 WIL, -2 HP",
          isActive: true,
          appliedAt: nowIso(now),
          expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        },
        ...state.statusEffects,
      ];

  return {
    ...state,
    habits,
    statusEffects,
    stats: alreadyPenalized ? state.stats : applyProgress(state.stats, 0, -2, "-1 WIL"),
    dailyCheckIn: {
      ...state.dailyCheckIn,
      checkInDate: today,
      slipHappened: true,
    },
  };
}

export function saveDailyCheckIn(
  state: GameState,
  payload: Omit<DailyCheckIn, "checkInDate">,
  now: Date,
): GameState {
  const nextState = {
    ...state,
    dailyCheckIn: {
      checkInDate: toIsoDate(now),
      ...payload,
    },
  };

  return {
    ...nextState,
    achievements: evaluateAchievements(nextState, now),
  };
}

export function dashboardMetrics(
  state: GameState,
  now: Date,
): {
  questCompletionRate: number;
  todayGoodHabits: number;
  todayBadHabitsResisted: number;
  questsCompletedThisWeek: number;
  bestHabitStreak: number;
} {
  const today = toIsoDate(now);
  const completedQuestCount = state.quests.filter((quest) => quest.completed).length;
  const questCompletionRate =
    state.quests.length > 0 ? Math.round((completedQuestCount / state.quests.length) * 100) : 0;

  const todayGoodHabits = state.habits.filter(
    (habit) => habit.type === "good" && habit.lastCompletedAt === today,
  ).length;

  const todayBadHabitsResisted = state.habits.filter(
    (habit) => habit.type === "bad" && habit.lastCompletedAt === today,
  ).length;

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const questsCompletedThisWeek = state.quests.filter((quest) => {
    if (!quest.completedAt) {
      return false;
    }

    return new Date(quest.completedAt) >= new Date(weekAgo.toISOString().slice(0, 10));
  }).length;

  const bestHabitStreak = state.habits.reduce((max, habit) => Math.max(max, habit.streak), 0);

  return {
    questCompletionRate,
    todayGoodHabits,
    todayBadHabitsResisted,
    questsCompletedThisWeek,
    bestHabitStreak,
  };
}
