<div class="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6">
    <section class="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/40">
        <div class="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-amber-300/20 blur-3xl dark:bg-emerald-400/10"></div>
        <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-3xl space-y-2">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">MyLife RPG</p>
                <flux:heading size="xl">{{ __('Your life is the campaign. Build momentum one turn at a time.') }}</flux:heading>
                <flux:text class="text-zinc-600 dark:text-zinc-300">
                    {{ __('Daily pledges, trigger tracking, and recovery actions keep progress moving even after tough days.') }}
                </flux:text>
            </div>

            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div class="rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-700 dark:bg-zinc-900/80">
                    <flux:text class="text-xs uppercase tracking-wide text-zinc-500">{{ __('Level') }}</flux:text>
                    <p class="mt-1 text-2xl font-semibold">{{ $stats->level }}</p>
                </div>
                <div class="rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-700 dark:bg-zinc-900/80">
                    <flux:text class="text-xs uppercase tracking-wide text-zinc-500">{{ __('XP') }}</flux:text>
                    <p class="mt-1 text-2xl font-semibold">{{ $stats->xp }}</p>
                </div>
                <div class="rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-700 dark:bg-zinc-900/80">
                    <flux:text class="text-xs uppercase tracking-wide text-zinc-500">{{ __('Best Streak') }}</flux:text>
                    <p class="mt-1 text-2xl font-semibold">{{ $bestHabitStreak }}</p>
                </div>
                <div class="rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-700 dark:bg-zinc-900/80">
                    <flux:text class="text-xs uppercase tracking-wide text-zinc-500">{{ __('Quest Rate') }}</flux:text>
                    <p class="mt-1 text-2xl font-semibold">{{ $questCompletionRate }}%</p>
                </div>
            </div>
        </div>
    </section>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <flux:text class="text-xs uppercase tracking-wide text-zinc-500">{{ __('Good Habits Today') }}</flux:text>
            <p class="mt-2 text-3xl font-semibold">{{ $todayGoodHabits }}</p>
            <flux:text class="mt-1 text-xs text-zinc-500">{{ __('Completed positive routines') }}</flux:text>
        </section>

        <section class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <flux:text class="text-xs uppercase tracking-wide text-zinc-500">{{ __('Bad Habits Resisted') }}</flux:text>
            <p class="mt-2 text-3xl font-semibold">{{ $todayBadHabitsResisted }}</p>
            <flux:text class="mt-1 text-xs text-zinc-500">{{ __('Wins against urges today') }}</flux:text>
        </section>

        <section class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <flux:text class="text-xs uppercase tracking-wide text-zinc-500">{{ __('Quests This Week') }}</flux:text>
            <p class="mt-2 text-3xl font-semibold">{{ $questsCompletedThisWeek }}</p>
            <flux:text class="mt-1 text-xs text-zinc-500">{{ __('Completed in the last 7 days') }}</flux:text>
        </section>

        <section class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <flux:text class="text-xs uppercase tracking-wide text-zinc-500">{{ __('Health Points') }}</flux:text>
            <p class="mt-2 text-3xl font-semibold">{{ $stats->hp }}</p>
            <flux:text class="mt-1 text-xs text-zinc-500">{{ __('Physical and mental reserve') }}</flux:text>
        </section>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
        <section class="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <flux:heading size="lg">{{ __('Character Stats') }}</flux:heading>
            <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <div><span class="font-semibold">Level:</span> {{ $stats->level }}</div>
                <div><span class="font-semibold">XP:</span> {{ $stats->xp }}</div>
                <div><span class="font-semibold">HP:</span> {{ $stats->hp }}</div>
                <div><span class="font-semibold">STR:</span> {{ $stats->strength }}</div>
                <div><span class="font-semibold">END:</span> {{ $stats->endurance }}</div>
                <div><span class="font-semibold">INT:</span> {{ $stats->intelligence }}</div>
                <div><span class="font-semibold">WIS:</span> {{ $stats->wisdom }}</div>
                <div><span class="font-semibold">CHA:</span> {{ $stats->charisma }}</div>
                <div><span class="font-semibold">WIL:</span> {{ $stats->willpower }}</div>
            </div>
        </section>

        <section class="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <flux:heading size="lg">{{ __('Achievements') }}</flux:heading>
            <div class="mt-4 space-y-2">
                @forelse ($achievements as $achievement)
                    <div wire:key="achievement-{{ $achievement->id }}" class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                        <div class="flex items-center justify-between gap-2">
                            <flux:text class="font-semibold">{{ $achievement->name }}</flux:text>
                            <flux:badge :color="$achievement->unlocked ? 'green' : 'zinc'">
                                {{ $achievement->unlocked ? __('Unlocked') : __('Locked') }}
                            </flux:badge>
                        </div>
                        @if ($achievement->description)
                            <flux:text class="mt-2 text-sm">{{ $achievement->description }}</flux:text>
                        @endif
                    </div>
                @empty
                    <flux:text>{{ __('No achievements yet.') }}</flux:text>
                @endforelse
            </div>
        </section>

        <section class="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <flux:heading size="lg">{{ __('Active Status Effects') }}</flux:heading>
            <div class="mt-4 space-y-2">
                @forelse ($statusEffects as $effect)
                    <div wire:key="status-effect-{{ $effect->id }}" class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                        <div class="flex items-center justify-between gap-2">
                            <flux:text class="font-semibold">{{ $effect->name }}</flux:text>
                            @if ($effect->expires_at)
                                <flux:text class="text-xs text-zinc-500">{{ $effect->expires_at->diffForHumans() }}</flux:text>
                            @endif
                        </div>
                        @if ($effect->penalty)
                            <flux:text class="mt-1 text-sm">{{ $effect->penalty }}</flux:text>
                        @endif
                        @if ($effect->description)
                            <flux:text class="mt-1 text-xs text-zinc-500">{{ $effect->description }}</flux:text>
                        @endif
                    </div>
                @empty
                    <flux:text>{{ __('No active status effects.') }}</flux:text>
                @endforelse
            </div>
        </section>
    </div>

    <section class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
        <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
                <flux:heading size="lg">{{ __('Daily Check-In') }}</flux:heading>
                <flux:text class="mt-1 text-sm text-zinc-500">{{ __('Use your intention, trigger notes, and reflections to recover faster and stay consistent.') }}</flux:text>
            </div>

            <div
                x-data="{
                    remaining: 300,
                    timer: null,
                    running: false,
                    format() {
                        const minutes = Math.floor(this.remaining / 60).toString().padStart(2, '0');
                        const seconds = (this.remaining % 60).toString().padStart(2, '0');
                        return `${minutes}:${seconds}`;
                    },
                    start() {
                        if (this.running) return;
                        this.running = true;
                        this.timer = setInterval(() => {
                            if (this.remaining === 0) {
                                clearInterval(this.timer);
                                this.running = false;
                                return;
                            }

                            this.remaining -= 1;
                        }, 1000);
                    },
                    reset() {
                        clearInterval(this.timer);
                        this.running = false;
                        this.remaining = 300;
                    }
                }"
                class="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
                <flux:text class="font-semibold">{{ __('Urge Shield Timer') }}</flux:text>
                <p class="mt-1 text-2xl font-semibold" x-text="format()"></p>
                <div class="mt-3 flex gap-2">
                    <flux:button size="sm" variant="primary" type="button" @click="start()" x-bind:disabled="running">
                        {{ __('Start 5m') }}
                    </flux:button>
                    <flux:button size="sm" variant="ghost" type="button" @click="reset()">
                        {{ __('Reset') }}
                    </flux:button>
                </div>
            </div>
        </div>

        @if (session()->has('daily-check-in-saved'))
            <div class="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300">
                {{ session('daily-check-in-saved') }}
            </div>
        @endif

        <form wire:submit="saveDailyCheckIn" class="mt-5 grid gap-4">
            <div class="grid gap-4 lg:grid-cols-2">
                <flux:input
                    wire:model="dailyIntention"
                    :label="__('Today\'s intention')"
                    :placeholder="__('Example: I stay clean by avoiding late-night scrolling.')"
                    required
                />

                <flux:input
                    wire:model="ifThenPlan"
                    :label="__('If-Then plan')"
                    :placeholder="__('If I feel an urge, then I will walk for 5 minutes.')"
                />
            </div>

            @error('dailyIntention') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror
            @error('ifThenPlan') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

            <div class="grid gap-4 lg:grid-cols-2">
                <flux:select wire:model="dailyCravingIntensity" :label="__('Craving intensity (0-10)')" :invalid="$errors->has('dailyCravingIntensity')" placeholder="{{ __('Select level') }}">
                    @for ($level = 0; $level <= 10; $level++)
                        <flux:select.option :value="(string) $level">{{ $level }}</flux:select.option>
                    @endfor
                </flux:select>

                <flux:checkbox wire:model="dailySlipHappened" :label="__('I slipped on a bad habit today')" />
            </div>

            @error('dailyCravingIntensity') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

            <flux:textarea
                wire:model="dailyTriggerNotes"
                :label="__('Trigger notes')"
                :placeholder="__('What situations, people, or emotions triggered you today?')"
                rows="3"
            />
            @error('dailyTriggerNotes') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

            <flux:textarea
                wire:model="dailyReflection"
                :label="__('Evening reflection')"
                :placeholder="__('What worked today, and what will you improve tomorrow?')"
                rows="3"
            />
            @error('dailyReflection') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

            <div>
                <flux:button type="submit" variant="primary" wire:loading.attr="disabled" wire:target="saveDailyCheckIn">
                    <span wire:loading.remove wire:target="saveDailyCheckIn">{{ __('Save Check-In') }}</span>
                    <span wire:loading wire:target="saveDailyCheckIn">{{ __('Saving...') }}</span>
                </flux:button>
            </div>
        </form>
    </section>

    <div class="grid gap-4 lg:grid-cols-2">
        <section class="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <div class="mb-4 flex items-center justify-between gap-2">
                <flux:heading size="lg">{{ __('Quests') }}</flux:heading>
            </div>

            <div class="space-y-2">
                @forelse ($quests as $quest)
                    <div wire:key="quest-{{ $quest->id }}" class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <flux:text class="font-semibold {{ $quest->completed ? 'line-through' : '' }}">{{ $quest->title }}</flux:text>
                                @if ($quest->description)
                                    <flux:text class="mt-1 text-sm text-zinc-500">{{ $quest->description }}</flux:text>
                                @endif
                                <flux:text class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    {{ strtoupper($quest->type) }}
                                    @if ($quest->difficulty)
                                        • {{ strtoupper($quest->difficulty) }}
                                    @endif
                                    @if ($quest->due_date)
                                        • {{ __('Due') }} {{ $quest->due_date->toDateString() }}
                                    @endif
                                    • {{ $quest->xp_reward }} XP
                                </flux:text>
                            </div>

                            <flux:button
                                size="sm"
                                :variant="$quest->completed ? 'ghost' : 'primary'"
                                wire:click="toggleQuest({{ $quest->id }})"
                                wire:loading.attr="disabled"
                                wire:target="toggleQuest({{ $quest->id }})"
                            >
                                {{ $quest->completed ? __('Undo') : __('Complete') }}
                            </flux:button>
                        </div>
                    </div>
                @empty
                    <flux:text>{{ __('No quests yet. Add one below.') }}</flux:text>
                @endforelse
            </div>

            <form wire:submit="createQuest" class="mt-6 space-y-3">
                <flux:input wire:model="questTitle" :label="__('Quest title')" type="text" required />
                @error('questTitle') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <flux:textarea wire:model="questDescription" :label="__('Quest details')" rows="2" />
                @error('questDescription') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <div class="grid gap-3 sm:grid-cols-2">
                    <flux:select wire:model="questType" :label="__('Type')" :invalid="$errors->has('questType')" required>
                        <flux:select.option value="daily">{{ __('Daily') }}</flux:select.option>
                        <flux:select.option value="weekly">{{ __('Weekly') }}</flux:select.option>
                        <flux:select.option value="major">{{ __('Major') }}</flux:select.option>
                    </flux:select>

                    <flux:select wire:model="questDifficulty" :label="__('Difficulty')" :invalid="$errors->has('questDifficulty')" placeholder="{{ __('Optional') }}">
                        <flux:select.option value="easy">{{ __('Easy') }}</flux:select.option>
                        <flux:select.option value="medium">{{ __('Medium') }}</flux:select.option>
                        <flux:select.option value="hard">{{ __('Hard') }}</flux:select.option>
                        <flux:select.option value="boss">{{ __('Boss') }}</flux:select.option>
                    </flux:select>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                    <flux:input wire:model="questDueDate" :label="__('Due date')" type="date" />
                    <flux:input wire:model="questXpReward" :label="__('XP reward')" type="number" min="1" required />
                </div>

                @error('questType') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror
                @error('questDifficulty') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror
                @error('questDueDate') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror
                @error('questXpReward') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <flux:button variant="primary" type="submit" wire:loading.attr="disabled" wire:target="createQuest">
                    <span wire:loading.remove wire:target="createQuest">{{ __('Add Quest') }}</span>
                    <span wire:loading wire:target="createQuest">{{ __('Adding...') }}</span>
                </flux:button>
            </form>
        </section>

        <section class="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <div class="mb-4 flex items-center justify-between gap-2">
                <flux:heading size="lg">{{ __('Habits') }}</flux:heading>
            </div>

            <div class="space-y-2">
                @forelse ($habits as $habit)
                    <div wire:key="habit-{{ $habit->id }}" class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <div class="flex items-center gap-2">
                                    <flux:text class="font-semibold">{{ $habit->title }}</flux:text>
                                    <flux:badge :color="$habit->type === 'bad' ? 'rose' : 'emerald'">
                                        {{ strtoupper($habit->type) }}
                                    </flux:badge>
                                </div>

                                @if ($habit->description)
                                    <flux:text class="mt-1 text-sm text-zinc-500">{{ $habit->description }}</flux:text>
                                @endif

                                <flux:text class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    {{ __('Streak') }}: {{ $habit->streak }} {{ __('days') }} • {{ $habit->xp_reward }} XP
                                </flux:text>
                            </div>

                            <div class="flex flex-wrap justify-end gap-2">
                                <flux:button
                                    size="sm"
                                    :variant="$habit->last_completed_at && $habit->last_completed_at->isToday() ? 'ghost' : 'primary'"
                                    wire:click="toggleHabit({{ $habit->id }})"
                                    wire:loading.attr="disabled"
                                    wire:target="toggleHabit({{ $habit->id }})"
                                >
                                    @if ($habit->type === 'bad')
                                        {{ $habit->last_completed_at && $habit->last_completed_at->isToday() ? __('Undo Resist') : __('Resisted Today') }}
                                    @else
                                        {{ $habit->last_completed_at && $habit->last_completed_at->isToday() ? __('Undo') : __('Mark Today') }}
                                    @endif
                                </flux:button>

                                @if ($habit->type === 'bad')
                                    <flux:button
                                        size="sm"
                                        variant="ghost"
                                        class="text-rose-600 dark:text-rose-300"
                                        wire:click="logHabitSlip({{ $habit->id }})"
                                        wire:loading.attr="disabled"
                                        wire:target="logHabitSlip({{ $habit->id }})"
                                    >
                                        {{ __('I Slipped') }}
                                    </flux:button>
                                @endif
                            </div>
                        </div>
                    </div>
                @empty
                    <flux:text>{{ __('No habits yet. Add one below.') }}</flux:text>
                @endforelse
            </div>

            <form wire:submit="createHabit" class="mt-6 space-y-3">
                <flux:input wire:model="habitTitle" :label="__('Habit title')" type="text" required />
                @error('habitTitle') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <flux:textarea
                    wire:model="habitDescription"
                    :label="__('Notes / trigger context')"
                    :placeholder="__('For bad habits, note cues and replacement behavior.')"
                    rows="2"
                />
                @error('habitDescription') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <div class="grid gap-3 sm:grid-cols-2">
                    <flux:select wire:model="habitType" :label="__('Type')" :invalid="$errors->has('habitType')" required>
                        <flux:select.option value="good">{{ __('Good') }}</flux:select.option>
                        <flux:select.option value="bad">{{ __('Bad') }}</flux:select.option>
                    </flux:select>
                    <flux:input wire:model="habitXpReward" :label="__('XP reward')" type="number" min="0" required />
                </div>

                @error('habitType') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror
                @error('habitXpReward') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <flux:button variant="primary" type="submit" wire:loading.attr="disabled" wire:target="createHabit">
                    <span wire:loading.remove wire:target="createHabit">{{ __('Add Habit') }}</span>
                    <span wire:loading wire:target="createHabit">{{ __('Adding...') }}</span>
                </flux:button>
            </form>
        </section>
    </div>
</div>
