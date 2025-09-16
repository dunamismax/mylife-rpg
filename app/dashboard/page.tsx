
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface UserStats {
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

interface Quest {
  id: string;
  title: string;
  description: string | null;
  type: string; // "daily", "weekly", "major"
  xpReward: number;
  difficulty: string | null;
  statsAffected: string | null;
  hpAffected: number | null;
  completed: boolean;
  dueDate: string | null;
  isRecurring: boolean;
  recurrencePattern: string | null;
}

interface Habit {
  id: string;
  title: string;
  description: string | null;
  type: string; // "good", "bad"
  xpReward: number | null;
  statsAffected: string | null;
  hpAffected: number | null;
  streak: number;
  lastCompleted: string | null;
}

interface Achievement {
  id: string;
  name: string;
  description: string | null;
  condition: string;
  reward: string | null;
  unlocked: boolean;
  unlockedAt: string | null;
}

interface StatusEffect {
  id: string;
  name: string;
  description: string | null;
  cause: string | null;
  duration: string | null;
  penalty: string | null;
  isActive: boolean;
  appliedAt: string;
  expiresAt: string | null;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [statusEffects, setStatusEffects] = useState<StatusEffect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestType, setNewQuestType] = useState('daily');
  const [newQuestXpReward, setNewQuestXpReward] = useState(0);

  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitType, setNewHabitType] = useState('good');
  const [newHabitXpReward, setNewHabitXpReward] = useState(0);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchQuests = async () => {
    try {
      const res = await fetch('/api/quests');
      if (!res.ok) {
        throw new Error('Failed to fetch quests');
      }
      const data = await res.json();
      setQuests(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchHabits = async () => {
    try {
      const res = await fetch('/api/habits');
      if (!res.ok) {
        throw new Error('Failed to fetch habits');
      }
      const data = await res.json();
      setHabits(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements');
      if (!res.ok) {
        throw new Error('Failed to fetch achievements');
      }
      const data = await res.json();
      setAchievements(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchStatusEffects = async () => {
    try {
      const res = await fetch('/api/status-effects');
      if (!res.ok) {
        throw new Error('Failed to fetch status effects');
      }
      const data = await res.json();
      setStatusEffects(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!session) return;

    Promise.all([
      fetchStats(),
      fetchQuests(),
      fetchHabits(),
      fetchAchievements(),
      fetchStatusEffects()
    ]).finally(() => setLoading(false));
  }, [session]);

  const handleAddQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle || newQuestXpReward <= 0) return;

    try {
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newQuestTitle,
          type: newQuestType,
          xpReward: newQuestXpReward,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to add quest');
      }

      setNewQuestTitle('');
      setNewQuestXpReward(0);
      fetchQuests(); // Refresh quests list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCompleteQuest = async (questId: string, currentCompletedStatus: boolean, xpReward: number, statsAffected: string | null, hpAffected: number | null) => {
    try {
      const res = await fetch(`/api/quests/${questId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !currentCompletedStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update quest');
      }

      // Update user progress
      if (!currentCompletedStatus) { // Only award XP if completing, not un-completing
        await fetch('/api/game/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ xpGained: xpReward, statsAffected, hpAffected }),
        });
        // Check for achievements after completing a quest
        await fetch('/api/achievements/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      fetchQuests(); // Refresh quests list
      fetchStats(); // Refresh stats as XP might have changed
      fetchAchievements(); // Refresh achievements
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle || newHabitXpReward <= 0) return;

    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newHabitTitle,
          type: newHabitType,
          xpReward: newHabitXpReward,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to add habit');
      }

      setNewHabitTitle('');
      setNewHabitXpReward(0);
      fetchHabits(); // Refresh habits list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCompleteHabit = async (habit: Habit) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastCompletedDate = habit.lastCompleted ? new Date(habit.lastCompleted).toISOString().split('T')[0] : null;

      let newStreak = habit.streak;
      let newLastCompleted = today;

      if (lastCompletedDate === today) {
        // Already completed today, do nothing or allow un-completion
        return;
      } else if (lastCompletedDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (lastCompletedDate === yesterdayString) {
          newStreak = habit.streak + 1;
        } else {
          newStreak = 1; // Streak broken, start new
        }
      } else {
        newStreak = 1; // First completion
      }

      const res = await fetch(`/api/habits/${habit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          streak: newStreak,
          lastCompleted: newLastCompleted,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update habit');
      }

      // Update user progress
      if (habit.xpReward) {
        await fetch('/api/game/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ xpGained: habit.xpReward, statsAffected: habit.statsAffected, hpAffected: habit.hpAffected }),
        });
        // Check for achievements after completing a habit
        await fetch('/api/achievements/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Apply status effect if it's a bad habit
      if (habit.type === 'bad') {
        await fetch('/api/status-effects/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Bad Habit: ${habit.title}`,
            description: `Penalty for ${habit.title}`,
            cause: habit.title,
            duration: '24 hours', // Example duration
            penalty: '-1 HP', // Example penalty
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          }),
        });
      }

      fetchHabits(); // Refresh habits list
      fetchStats(); // Refresh stats as XP might have changed
      fetchAchievements(); // Refresh achievements
      fetchStatusEffects(); // Refresh status effects
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Please log in to view your dashboard.</div>;
  }

  const dailyQuests = quests.filter(q => q.type === 'daily');
  const majorQuests = quests.filter(q => q.type === 'major');

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-700">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <h2 className="text-xl">Welcome, {session.user?.email}</h2>

          {stats && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Character Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <strong>Level:</strong> {stats.level}
                </div>
                <div>
                  <strong>XP:</strong> {stats.xp}
                </div>
                <div>
                  <strong>HP:</strong> {stats.hp}
                </div>
                <div>
                  <strong>Strength:</strong> {stats.strength}
                </div>
                <div>
                  <strong>Endurance:</strong> {stats.endurance}
                </div>
                <div>
                  <strong>Intelligence:</strong> {stats.intelligence}
                </div>
                <div>
                  <strong>Wisdom:</strong> {stats.wisdom}
                </div>
                <div>
                  <strong>Charisma:</strong> {stats.charisma}
                </div>
                <div>
                  <strong>Willpower:</strong> {stats.willpower}
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Add New Quest</h3>
            <form onSubmit={handleAddQuest} className="space-y-4">
              <div>
                <label htmlFor="questTitle" className="block text-sm font-medium text-gray-300">Quest Title</label>
                <input
                  id="questTitle"
                  type="text"
                  value={newQuestTitle}
                  onChange={(e) => setNewQuestTitle(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="questType" className="block text-sm font-medium text-gray-300">Quest Type</label>
                <select
                  id="questType"
                  value={newQuestType}
                  onChange={(e) => setNewQuestType(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="major">Major</option>
                </select>
              </div>
              <div>
                <label htmlFor="xpReward" className="block text-sm font-medium text-gray-300">XP Reward</label>
                <input
                  id="xpReward"
                  type="number"
                  value={newQuestXpReward}
                  onChange={(e) => setNewQuestXpReward(parseInt(e.target.value))}
                  className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="1"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Quest
              </button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Daily Quests</h3>
            {dailyQuests.length === 0 ? (
              <p className="text-gray-400">No daily quests yet. Add one above!</p>
            ) : (
              <ul className="space-y-2">
                {dailyQuests.map((quest) => (
                  <li key={quest.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={quest.completed}
                        onChange={() => handleCompleteQuest(quest.id, quest.completed, quest.xpReward, quest.statsAffected, quest.hpAffected)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`ml-3 text-lg ${quest.completed ? 'line-through text-gray-500' : ''}`}>
                        {quest.title} ({quest.xpReward} XP)
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Major Quests</h3>
            {majorQuests.length === 0 ? (
              <p className="text-gray-400">No major quests yet. Add one above!</p>
            ) : (
              <ul className="space-y-2">
                {majorQuests.map((quest) => (
                  <li key={quest.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                    <span className={`text-lg ${quest.completed ? 'line-through text-gray-500' : ''}`}>
                      {quest.title} ({quest.xpReward} XP)
                    </span>
                    <button
                      onClick={() => handleCompleteQuest(quest.id, quest.completed, quest.xpReward, quest.statsAffected, quest.hpAffected)}
                      className="ml-4 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      {quest.completed ? 'Undo' : 'Complete'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Add New Habit</h3>
            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label htmlFor="habitTitle" className="block text-sm font-medium text-gray-300">Habit Title</label>
                <input
                  id="habitTitle"
                  type="text"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="habitType" className="block text-sm font-medium text-gray-300">Habit Type</label>
                <select
                  id="habitType"
                  value={newHabitType}
                  onChange={(e) => setNewHabitType(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="good">Good</option>
                  <option value="bad">Bad</option>
                </select>
              </div>
              <div>
                <label htmlFor="habitXpReward" className="block text-sm font-medium text-gray-300">XP Reward (for good habits)</label>
                <input
                  id="habitXpReward"
                  type="number"
                  value={newHabitXpReward}
                  onChange={(e) => setNewHabitXpReward(parseInt(e.target.value))}
                  className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Habit
              </button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Habits</h3>
            {habits.length === 0 ? (
              <p className="text-gray-400">No habits yet. Add one above!</p>
            ) : (
              <ul className="space-y-2">
                {habits.map((habit) => (
                  <li key={habit.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={habit.lastCompleted === new Date().toISOString().split('T')[0]}
                        onChange={() => handleCompleteHabit(habit)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`ml-3 text-lg ${habit.lastCompleted === new Date().toISOString().split('T')[0] ? 'line-through text-gray-500' : ''}`}>
                        {habit.title} (Streak: {habit.streak})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            {achievements.length === 0 ? (
              <p className="text-gray-400">No achievements yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement) => (
                  <span key={achievement.id} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {achievement.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Active Status Effects</h3>
            {statusEffects.length === 0 ? (
              <p className="text-gray-400">No active status effects.</p>
            ) : (
              <ul className="space-y-2">
                {statusEffects.map((effect) => (
                  <li key={effect.id} className="bg-red-700 p-3 rounded-md text-white">
                    <strong>{effect.name}</strong>: {effect.penalty} (Cause: {effect.cause})
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
