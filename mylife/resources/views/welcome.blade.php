<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        @include('partials.head', ['title' => 'MyLife RPG'])
    </head>
    <body class="min-h-screen bg-zinc-100 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <main class="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
            <div class="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-12">
                <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">MyLife RPG</p>
                <h1 class="text-3xl font-semibold leading-tight md:text-5xl">
                    Transform goals into quests and habits into stats.
                </h1>
                <p class="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-300">
                    Track quests, complete habits, gain XP, and level up your character as your real-life progress grows.
                </p>

                <div class="mt-8 flex flex-wrap gap-3">
                    @auth
                        <flux:button variant="primary" :href="route('dashboard')" wire:navigate>
                            {{ __('Go to Dashboard') }}
                        </flux:button>
                    @else
                        <flux:button variant="primary" :href="route('register')" wire:navigate>
                            {{ __('Start Your Quest') }}
                        </flux:button>
                        <flux:button variant="ghost" :href="route('login')" wire:navigate>
                            {{ __('Log In') }}
                        </flux:button>
                    @endauth
                </div>
            </div>
        </main>

        @fluxScripts
    </body>
</html>
