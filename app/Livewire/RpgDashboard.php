<?php

namespace App\Livewire;

use App\Models\Stat;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class RpgDashboard extends Component
{
    public string $questTitle = '';

    public string $questType = 'daily';

    public string $questXpReward = '25';

    public string $habitTitle = '';

    public string $habitType = 'good';

    public string $habitXpReward = '10';

    public function mount(): void
    {
        Auth::user()?->stat()->firstOrCreate();
    }

    public function createQuest(): void
    {
        $validated = $this->validate([
            'questTitle' => ['required', 'string', 'max:255'],
            'questType' => ['required', 'in:daily,weekly,major'],
            'questXpReward' => ['required', 'integer', 'min:1', 'max:10000'],
        ]);

        Auth::user()?->quests()->create([
            'title' => $validated['questTitle'],
            'type' => $validated['questType'],
            'xp_reward' => (int) $validated['questXpReward'],
        ]);

        $this->questTitle = '';
        $this->questXpReward = '25';
        $this->questType = 'daily';
    }

    public function createHabit(): void
    {
        $validated = $this->validate([
            'habitTitle' => ['required', 'string', 'max:255'],
            'habitType' => ['required', 'in:good,bad'],
            'habitXpReward' => ['required', 'integer', 'min:0', 'max:10000'],
        ]);

        Auth::user()?->habits()->create([
            'title' => $validated['habitTitle'],
            'type' => $validated['habitType'],
            'xp_reward' => (int) $validated['habitXpReward'],
        ]);

        $this->habitTitle = '';
        $this->habitXpReward = '10';
        $this->habitType = 'good';
    }

    public function toggleQuest(int $questId): void
    {
        $quest = Auth::user()->quests()->findOrFail($questId);
        $completingQuest = ! $quest->completed;
        $awardingXp = $completingQuest && $quest->xp_rewarded_at === null;

        $updates = [
            'completed' => $completingQuest,
            'completed_at' => $completingQuest ? now() : null,
        ];

        if ($awardingXp) {
            $updates['xp_rewarded_at'] = now();
        }

        $quest->update($updates);

        if ($awardingXp) {
            $this->applyProgress($quest->xp_reward, $quest->hp_affected, $quest->stats_affected);
            $this->checkAchievements();
        }
    }

    public function toggleHabit(int $habitId): void
    {
        $habit = Auth::user()->habits()->findOrFail($habitId);
        $today = CarbonImmutable::today();
        $lastCompleted = $habit->last_completed_at
            ? CarbonImmutable::parse($habit->last_completed_at->toDateString())
            : null;

        if ($lastCompleted?->equalTo($today)) {
            $habit->update([
                'last_completed_at' => null,
                'streak' => max($habit->streak - 1, 0),
            ]);

            return;
        }

        $newStreak = 1;
        if ($lastCompleted?->equalTo($today->subDay())) {
            $newStreak = $habit->streak + 1;
        }

        $awardingXp = ! $habit->xp_rewarded_on?->equalTo($today);

        $habit->update([
            'last_completed_at' => $today,
            'streak' => $newStreak,
        ] + ($awardingXp ? ['xp_rewarded_on' => $today] : []));

        if ($awardingXp) {
            $this->applyProgress($habit->xp_reward ?? 0, $habit->hp_affected, $habit->stats_affected);
            $this->checkAchievements();
        }
    }

    public function render(): View
    {
        $user = Auth::user();

        return view('livewire.rpg-dashboard', [
            'stats' => $user->stat()->firstOrCreate(),
            'quests' => $user->quests()->latest()->get(),
            'habits' => $user->habits()->latest()->get(),
            'achievements' => $user->achievements()->orderByDesc('unlocked')->orderBy('name')->get(),
            'statusEffects' => $user->statusEffects()
                ->where('is_active', true)
                ->where(fn ($query) => $query->whereNull('expires_at')->orWhere('expires_at', '>', now()))
                ->latest('applied_at')
                ->get(),
        ])->layout('layouts.app', ['title' => __('Dashboard')]);
    }

    protected function applyProgress(int $xpGained, ?int $hpAffected, ?string $statsAffected): void
    {
        /** @var Stat $stat */
        $stat = Auth::user()->stat()->firstOrCreate();
        $updates = [
            'xp' => max($stat->xp + max($xpGained, 0), 0),
            'hp' => max($stat->hp + ($hpAffected ?? 0), 0),
        ];

        $newLevel = intdiv($updates['xp'], 100) + 1;
        $levelUps = max($newLevel - $stat->level, 0);
        $updates['level'] = $newLevel;

        if ($levelUps > 0) {
            $updates['hp'] += $levelUps * 5;
            $updates['strength'] = $stat->strength + $levelUps;
            $updates['endurance'] = $stat->endurance + $levelUps;
            $updates['intelligence'] = $stat->intelligence + $levelUps;
            $updates['wisdom'] = $stat->wisdom + $levelUps;
            $updates['charisma'] = $stat->charisma + $levelUps;
            $updates['willpower'] = $stat->willpower + $levelUps;
        }

        $this->applyStatStringEffects($statsAffected, $stat, $updates);

        $stat->update($updates);
    }

    /**
     * @param  array<string, int>  $updates
     */
    protected function applyStatStringEffects(?string $statsAffected, Stat $stat, array &$updates): void
    {
        if (! is_string($statsAffected) || trim($statsAffected) === '') {
            return;
        }

        preg_match_all('/([+-]\d+)\s*(STR|END|INT|WIS|CHA|WIL|HP)/i', $statsAffected, $matches, PREG_SET_ORDER);

        $statMap = [
            'STR' => 'strength',
            'END' => 'endurance',
            'INT' => 'intelligence',
            'WIS' => 'wisdom',
            'CHA' => 'charisma',
            'WIL' => 'willpower',
            'HP' => 'hp',
        ];

        foreach ($matches as $match) {
            $amount = (int) $match[1];
            $shortCode = strtoupper($match[2]);
            $field = $statMap[$shortCode] ?? null;

            if (! $field) {
                continue;
            }

            $baseValue = $updates[$field] ?? $stat->{$field};
            $nextValue = $baseValue + $amount;
            $updates[$field] = $field === 'hp' ? max($nextValue, 0) : max($nextValue, 1);
        }
    }

    protected function checkAchievements(): void
    {
        $user = Auth::user();
        $completedQuestCount = $user->quests()->where('completed', true)->count();
        $bestHabitStreak = (int) $user->habits()->max('streak');

        if ($completedQuestCount >= 1) {
            $this->unlockAchievement(
                'First Quest Complete',
                'Completed your first quest.',
                'Complete 1 quest',
                '+50 XP bonus potential',
            );
        }

        if ($completedQuestCount >= 10) {
            $this->unlockAchievement(
                'Quest Grinder',
                'Completed at least ten quests.',
                'Complete 10 quests',
                '+2 Strength',
            );
        }

        if ($bestHabitStreak >= 7) {
            $this->unlockAchievement(
                'Habit Hero',
                'Built a seven-day habit streak.',
                'Reach a 7-day streak',
                '+2 Willpower',
            );
        }
    }

    protected function unlockAchievement(
        string $name,
        string $description,
        string $condition,
        string $reward,
    ): void {
        Auth::user()?->achievements()->updateOrCreate(
            ['name' => $name],
            [
                'description' => $description,
                'condition' => $condition,
                'reward' => $reward,
                'unlocked' => true,
                'unlocked_at' => now(),
            ],
        );
    }
}
