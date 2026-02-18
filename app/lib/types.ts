export type QuestType = "daily" | "weekly" | "major";
export type QuestDifficulty = "easy" | "medium" | "hard" | "boss";
export type HabitType = "good" | "bad";

export type StatShortCode = "STR" | "END" | "INT" | "WIS" | "CHA" | "WIL" | "HP";

export interface Stat {
  level: number;
  xp: number;
  hp: number;
  strength: number;
  endurance: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  willpower: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string | null;
  type: QuestType;
  difficulty: QuestDifficulty | null;
  xpReward: number;
  statsAffected: string | null;
  hpAffected: number | null;
  completed: boolean;
  dueDate: string | null;
  completedAt: string | null;
  xpRewardedAt: string | null;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  description: string | null;
  type: HabitType;
  xpReward: number;
  statsAffected: string | null;
  hpAffected: number | null;
  streak: number;
  lastCompletedAt: string | null;
  xpRewardedOn: string | null;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: string;
  reward: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  cause: string;
  duration: string;
  penalty: string;
  isActive: boolean;
  appliedAt: string;
  expiresAt: string | null;
}

export interface DailyCheckIn {
  checkInDate: string;
  dailyIntention: string;
  ifThenPlan: string | null;
  cravingIntensity: number | null;
  triggerNotes: string | null;
  reflection: string | null;
  slipHappened: boolean;
}

export interface GameState {
  stats: Stat;
  quests: Quest[];
  habits: Habit[];
  achievements: Achievement[];
  statusEffects: StatusEffect[];
  dailyCheckIn: DailyCheckIn;
}
