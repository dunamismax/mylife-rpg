<?php

namespace App\Livewire;

use App\Models\Habit;
use App\Models\Quest;
use App\Models\Stat;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class RpgDashboard extends Component
{
    public string $questTitle = '';

    public string $questDescription = '';

    public string $questType = 'daily';

    public string $questDifficulty = '';

    public string $questDueDate = '';

    public string $questXpReward = '25';

    public string $habitTitle = '';

    public string $habitDescription = '';

    public string $habitType = 'good';

    public string $habitXpReward = '10';

    public string $dailyIntention = '';

    public string $ifThenPlan = '';

    public string $dailyCravingIntensity = '';

    public string $dailyTriggerNotes = '';

    public string $dailyReflection = '';

    public bool $dailySlipHappened = false;

    public function mount(): void
    {
        $this->user()->stat()->firstOrCreate();
        $this->loadTodayCheckIn();
    }

    public function createQuest(): void
    {
        $validated = $this->validate([
            'questTitle' => ['required', 'string', 'max:255'],
            'questDescription' => ['nullable', 'string', 'max:1000'],
            'questType' => ['required', 'in:daily,weekly,major'],
            'questDifficulty' => ['nullable', 'in:easy,medium,hard,boss'],
            'questDueDate' => ['nullable', 'date', 'after_or_equal:today'],
            'questXpReward' => ['required', 'integer', 'min:1', 'max:10000'],
        ]);

        $this->user()->quests()->create([
            'title' => $validated['questTitle'],
            'description' => $validated['questDescription'] !== '' ? $validated['questDescription'] : null,
            'type' => $validated['questType'],
            'difficulty' => $validated['questDifficulty'] !== '' ? $validated['questDifficulty'] : null,
            'due_date' => $validated['questDueDate'] !== ''
                ? CarbonImmutable::parse($validated['questDueDate'])->endOfDay()
                : null,
            'xp_reward' => (int) $validated['questXpReward'],
        ]);

        $this->questTitle = '';
        $this->questDescription = '';
        $this->questXpReward = '25';
        $this->questType = 'daily';
        $this->questDifficulty = '';
        $this->questDueDate = '';
    }

    public function createHabit(): void
    {
        $validated = $this->validate([
            'habitTitle' => ['required', 'string', 'max:255'],
            'habitDescription' => ['nullable', 'string', 'max:1000'],
            'habitType' => ['required', 'in:good,bad'],
            'habitXpReward' => ['required', 'integer', 'min:0', 'max:10000'],
        ]);

        $this->user()->habits()->create([
            'title' => $validated['habitTitle'],
            'description' => $validated['habitDescription'] !== '' ? $validated['habitDescription'] : null,
            'type' => $validated['habitType'],
            'xp_reward' => (int) $validated['habitXpReward'],
        ]);

        $this->habitTitle = '';
        $this->habitDescription = '';
        $this->habitXpReward = '10';
        $this->habitType = 'good';
    }

    public function toggleQuest(int $questId): void
    {
        $quest = $this->user()->quests()->findOrFail($questId);
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
        $habit = $this->user()->habits()->findOrFail($habitId);
        $today = $this->today();
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

    public function logHabitSlip(int $habitId): void
    {
        $habit = $this->user()->habits()->findOrFail($habitId);

        if ($habit->type !== 'bad') {
            return;
        }

        $today = $this->today()->toDateString();

        $habit->update([
            'last_completed_at' => null,
            'streak' => 0,
            'xp_rewarded_on' => null,
        ]);

        $alreadyPenalizedToday = $this->user()->statusEffects()
            ->where('name', 'Temptation Hangover')
            ->whereDate('applied_at', $today)
            ->exists();

        if (! $alreadyPenalizedToday) {
            $this->applyProgress(0, -2, '-1 WIL');

            $this->user()->statusEffects()->create([
                'name' => 'Temptation Hangover',
                'description' => 'A slip happened today. Recover with one focused win.',
                'cause' => "Slip logged: {$habit->title}",
                'duration' => '1 day',
                'penalty' => '-1 WIL, -2 HP',
                'is_active' => true,
                'applied_at' => now(),
                'expires_at' => now()->addDay(),
            ]);
        }

        $this->updateTodayCheckIn(['slip_happened' => true]);
        $this->dailySlipHappened = true;
    }

    public function saveDailyCheckIn(): void
    {
        $validated = $this->validate([
            'dailyIntention' => ['required', 'string', 'max:255'],
            'ifThenPlan' => ['nullable', 'string', 'max:255'],
            'dailyCravingIntensity' => ['nullable', 'integer', 'min:0', 'max:10'],
            'dailyTriggerNotes' => ['nullable', 'string', 'max:1000'],
            'dailyReflection' => ['nullable', 'string', 'max:1000'],
            'dailySlipHappened' => ['boolean'],
        ]);

        $this->updateTodayCheckIn([
            'daily_intention' => $validated['dailyIntention'],
            'if_then_plan' => $validated['ifThenPlan'] !== '' ? $validated['ifThenPlan'] : null,
            'craving_intensity' => $validated['dailyCravingIntensity'] !== ''
                ? (int) $validated['dailyCravingIntensity']
                : null,
            'trigger_notes' => $validated['dailyTriggerNotes'] !== '' ? $validated['dailyTriggerNotes'] : null,
            'reflection' => $validated['dailyReflection'] !== '' ? $validated['dailyReflection'] : null,
            'slip_happened' => (bool) $validated['dailySlipHappened'],
        ]);

        $this->checkAchievements();

        session()->flash('daily-check-in-saved', __('Daily check-in saved.'));
    }

    public function render(): View
    {
        $user = $this->user();
        $today = $this->today();
        $stats = $user->stat()->firstOrCreate();
        $quests = $user->quests()->latest()->get();
        $habits = $user->habits()->latest()->get();

        $completedQuestCount = $quests->where('completed', true)->count();
        $questCompletionRate = $quests->count() > 0
            ? (int) round(($completedQuestCount / $quests->count()) * 100)
            : 0;

        $todayGoodHabits = $habits
            ->where('type', 'good')
            ->filter(fn (Habit $habit) => $habit->last_completed_at?->isSameDay($today))
            ->count();

        $todayBadHabitsResisted = $habits
            ->where('type', 'bad')
            ->filter(fn (Habit $habit) => $habit->last_completed_at?->isSameDay($today))
            ->count();

        $questsCompletedThisWeek = $quests
            ->filter(fn (Quest $quest) => $quest->completed_at !== null
                && CarbonImmutable::parse($quest->completed_at)->greaterThanOrEqualTo($today->subDays(6)->startOfDay()))
            ->count();

        return view('livewire.rpg-dashboard', [
            'stats' => $stats,
            'quests' => $quests,
            'habits' => $habits,
            'achievements' => $user->achievements()->orderByDesc('unlocked')->orderBy('name')->get(),
            'statusEffects' => $user->statusEffects()
                ->where('is_active', true)
                ->where(fn ($query) => $query->whereNull('expires_at')->orWhere('expires_at', '>', now()))
                ->latest('applied_at')
                ->get(),
            'todayGoodHabits' => $todayGoodHabits,
            'todayBadHabitsResisted' => $todayBadHabitsResisted,
            'questCompletionRate' => $questCompletionRate,
            'questsCompletedThisWeek' => $questsCompletedThisWeek,
            'bestHabitStreak' => (int) $habits->max('streak'),
        ])->layout('layouts.app', ['title' => __('Dashboard')]);
    }

    protected function loadTodayCheckIn(): void
    {
        $checkIn = $this->user()->dailyCheckIns()
            ->whereDate('check_in_date', $this->today()->toDateString())
            ->first();

        if (! $checkIn) {
            return;
        }

        $this->dailyIntention = $checkIn->daily_intention ?? '';
        $this->ifThenPlan = $checkIn->if_then_plan ?? '';
        $this->dailyCravingIntensity = $checkIn->craving_intensity !== null ? (string) $checkIn->craving_intensity : '';
        $this->dailyTriggerNotes = $checkIn->trigger_notes ?? '';
        $this->dailyReflection = $checkIn->reflection ?? '';
        $this->dailySlipHappened = $checkIn->slip_happened;
    }

    /**
     * @param  array<string, bool|int|string|null>  $attributes
     */
    protected function updateTodayCheckIn(array $attributes): void
    {
        $this->user()->dailyCheckIns()->updateOrCreate(
            ['check_in_date' => $this->today()->toDateString()],
            $attributes,
        );
    }

    protected function applyProgress(int $xpGained, ?int $hpAffected, ?string $statsAffected): void
    {
        /** @var Stat $stat */
        $stat = $this->user()->stat()->firstOrCreate();
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
        $user = $this->user();
        $completedQuestCount = $user->quests()->where('completed', true)->count();
        $bestHabitStreak = (int) $user->habits()->max('streak');
        $dailyCheckInCount = $user->dailyCheckIns()->count();

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

        if ($dailyCheckInCount >= 3) {
            $this->unlockAchievement(
                'Mindful Adventurer',
                'Completed three daily check-ins.',
                'Complete 3 daily check-ins',
                '+1 Wisdom',
            );
        }
    }

    protected function unlockAchievement(
        string $name,
        string $description,
        string $condition,
        string $reward,
    ): void {
        $this->user()->achievements()->updateOrCreate(
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

    protected function user(): User
    {
        /** @var User $user */
        $user = Auth::user();

        return $user;
    }

    protected function today(): CarbonImmutable
    {
        return CarbonImmutable::today();
    }
}
