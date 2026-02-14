<div class="flex h-full w-full flex-1 flex-col gap-4">
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
                    <div class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                        <div class="flex items-center justify-between gap-2">
                            <flux:text class="font-semibold">{{ $achievement->name }}</flux:text>
                            <flux:badge :color="$achievement->unlocked ? 'green' : 'red'">
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
                    <div class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                        <flux:text class="font-semibold">{{ $effect->name }}</flux:text>
                        @if ($effect->penalty)
                            <flux:text class="text-sm">{{ $effect->penalty }}</flux:text>
                        @endif
                    </div>
                @empty
                    <flux:text>{{ __('No active status effects.') }}</flux:text>
                @endforelse
            </div>
        </section>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
        <section class="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <div class="mb-4 flex items-center justify-between gap-2">
                <flux:heading size="lg">{{ __('Quests') }}</flux:heading>
            </div>

            <div class="space-y-2">
                @forelse ($quests as $quest)
                    <div class="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                        <div>
                            <flux:text class="{{ $quest->completed ? 'line-through' : '' }}">{{ $quest->title }}</flux:text>
                            <flux:text class="text-xs text-zinc-500 dark:text-zinc-400">
                                {{ strtoupper($quest->type) }} • {{ $quest->xp_reward }} XP
                            </flux:text>
                        </div>
                        <flux:button
                            size="sm"
                            :variant="$quest->completed ? 'ghost' : 'primary'"
                            wire:click="toggleQuest({{ $quest->id }})"
                        >
                            {{ $quest->completed ? __('Undo') : __('Complete') }}
                        </flux:button>
                    </div>
                @empty
                    <flux:text>{{ __('No quests yet. Add one below.') }}</flux:text>
                @endforelse
            </div>

            <form wire:submit="createQuest" class="mt-6 space-y-3">
                <flux:input wire:model="questTitle" :label="__('Quest title')" type="text" required />
                @error('questTitle') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <div class="grid gap-3 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ __('Type') }}</label>
                        <select wire:model="questType" class="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="major">Major</option>
                        </select>
                    </div>
                    <flux:input wire:model="questXpReward" :label="__('XP reward')" type="number" min="1" required />
                </div>
                @error('questType') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror
                @error('questXpReward') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <flux:button variant="primary" type="submit">{{ __('Add Quest') }}</flux:button>
            </form>
        </section>

        <section class="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
            <div class="mb-4 flex items-center justify-between gap-2">
                <flux:heading size="lg">{{ __('Habits') }}</flux:heading>
            </div>

            <div class="space-y-2">
                @forelse ($habits as $habit)
                    <div class="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                        <div>
                            <flux:text>{{ $habit->title }}</flux:text>
                            <flux:text class="text-xs text-zinc-500 dark:text-zinc-400">
                                {{ strtoupper($habit->type) }} • {{ $habit->streak }} day streak
                            </flux:text>
                        </div>
                        <flux:button
                            size="sm"
                            :variant="$habit->last_completed_at && $habit->last_completed_at->isToday() ? 'ghost' : 'primary'"
                            wire:click="toggleHabit({{ $habit->id }})"
                        >
                            {{ $habit->last_completed_at && $habit->last_completed_at->isToday() ? __('Undo') : __('Mark Today') }}
                        </flux:button>
                    </div>
                @empty
                    <flux:text>{{ __('No habits yet. Add one below.') }}</flux:text>
                @endforelse
            </div>

            <form wire:submit="createHabit" class="mt-6 space-y-3">
                <flux:input wire:model="habitTitle" :label="__('Habit title')" type="text" required />
                @error('habitTitle') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <div class="grid gap-3 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ __('Type') }}</label>
                        <select wire:model="habitType" class="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <option value="good">Good</option>
                            <option value="bad">Bad</option>
                        </select>
                    </div>
                    <flux:input wire:model="habitXpReward" :label="__('XP reward')" type="number" min="0" required />
                </div>
                @error('habitType') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror
                @error('habitXpReward') <flux:text class="!text-red-600">{{ $message }}</flux:text> @enderror

                <flux:button variant="primary" type="submit">{{ __('Add Habit') }}</flux:button>
            </form>
        </section>
    </div>
</div>
