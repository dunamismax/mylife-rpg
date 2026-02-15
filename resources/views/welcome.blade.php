<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        @include('partials.head', ['title' => 'MyLife RPG'])
    </head>
    <body class="min-h-screen bg-zinc-100 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 lg:py-16">
            <section class="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-amber-100 via-white to-cyan-100 p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-cyan-950/40 md:p-12">
                <div class="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl dark:bg-cyan-500/10"></div>
                <div class="absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-cyan-300/25 blur-3xl dark:bg-emerald-500/10"></div>

                <div class="relative">
                    <p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">MyLife RPG • myliferpg.app</p>
                    <h1 class="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
                        Habit tracking that feels like progression, not punishment.
                    </h1>
                    <p class="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-300">
                        Build real-life momentum with quests, streaks, daily pledges, trigger notes, and fast recovery tools when you slip.
                    </p>

                    <div class="mt-8 flex flex-wrap gap-3">
                        @auth
                            <flux:button variant="primary" :href="route('dashboard')" wire:navigate>
                                {{ __('Go to Dashboard') }}
                            </flux:button>
                        @else
                            <flux:button variant="primary" :href="route('register')" wire:navigate>
                                {{ __('Start Your Campaign') }}
                            </flux:button>
                            <flux:button variant="ghost" :href="route('login')" wire:navigate>
                                {{ __('Log In') }}
                            </flux:button>
                        @endauth
                    </div>
                </div>
            </section>

            <section class="mt-8 grid gap-4 md:grid-cols-3">
                <article class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <flux:heading size="lg">{{ __('Daily Oath') }}</flux:heading>
                    <flux:text class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                        {{ __('Set your intention and if-then plan each day so urges have a pre-decided response.') }}
                    </flux:text>
                </article>

                <article class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <flux:heading size="lg">{{ __('Slip Recovery') }}</flux:heading>
                    <flux:text class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                        {{ __('Log slips, recover quickly, and keep the long-term campaign moving without rage-quitting your goals.') }}
                    </flux:text>
                </article>

                <article class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <flux:heading size="lg">{{ __('RPG Progression') }}</flux:heading>
                    <flux:text class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                        {{ __('Earn XP, level up stats, complete quests, and stack streaks across good and bad habit battles.') }}
                    </flux:text>
                </article>
            </section>
        </main>

        @fluxScripts
    </body>
</html>
