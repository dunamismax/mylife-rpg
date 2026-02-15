<?php

use App\Livewire\RpgDashboard;
use App\Models\Habit;
use App\Models\Quest;
use App\Models\User;
use Carbon\CarbonImmutable;
use Livewire\Livewire;

test('a stat record is created for every new user', function () {
    $user = User::factory()->create();

    expect($user->fresh()->stat)->not->toBeNull()
        ->and($user->fresh()->stat->level)->toBe(1)
        ->and($user->fresh()->stat->xp)->toBe(0);
});

test('users can create quests from the dashboard component', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(RpgDashboard::class)
        ->set('questTitle', 'Morning Workout')
        ->set('questType', 'daily')
        ->set('questXpReward', 40)
        ->call('createQuest')
        ->assertHasNoErrors();

    $this->assertDatabaseHas('quests', [
        'user_id' => $user->id,
        'title' => 'Morning Workout',
        'type' => 'daily',
        'xp_reward' => 40,
    ]);
});

test('quest creation rejects unsupported quest types', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(RpgDashboard::class)
        ->set('questTitle', 'Invalid Quest Type')
        ->set('questType', 'monthly')
        ->set('questXpReward', 25)
        ->call('createQuest')
        ->assertHasErrors(['questType' => ['in']]);

    $this->assertDatabaseMissing('quests', [
        'user_id' => $user->id,
        'title' => 'Invalid Quest Type',
    ]);
});

test('habit creation rejects unsupported habit types', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(RpgDashboard::class)
        ->set('habitTitle', 'Invalid Habit Type')
        ->set('habitType', 'neutral')
        ->set('habitXpReward', 10)
        ->call('createHabit')
        ->assertHasErrors(['habitType' => ['in']]);

    $this->assertDatabaseMissing('habits', [
        'user_id' => $user->id,
        'title' => 'Invalid Habit Type',
    ]);
});

test('completing a quest marks it complete and awards xp', function () {
    $user = User::factory()->create();
    $quest = Quest::factory()->create([
        'user_id' => $user->id,
        'xp_reward' => 120,
        'completed' => false,
    ]);

    $this->actingAs($user);

    Livewire::test(RpgDashboard::class)
        ->call('toggleQuest', $quest->id);

    expect($quest->fresh()->completed)->toBeTrue()
        ->and($user->fresh()->stat->xp)->toBe(120)
        ->and($user->fresh()->stat->level)->toBe(2);

    $this->assertDatabaseHas('achievements', [
        'user_id' => $user->id,
        'name' => 'First Quest Complete',
        'unlocked' => true,
    ]);
});

test('marking a habit complete updates streak and xp', function () {
    CarbonImmutable::setTestNow('2026-02-14 08:00:00');
    try {
        $user = User::factory()->create();
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'streak' => 0,
            'xp_reward' => 25,
            'last_completed_at' => null,
        ]);

        $this->actingAs($user);

        Livewire::test(RpgDashboard::class)
            ->call('toggleHabit', $habit->id);

        expect($habit->fresh()->streak)->toBe(1)
            ->and($habit->fresh()->last_completed_at->toDateString())->toBe('2026-02-14')
            ->and($user->fresh()->stat->xp)->toBe(25);
    } finally {
        CarbonImmutable::setTestNow();
    }
});

test('completing a quest multiple times does not award duplicate xp', function () {
    $user = User::factory()->create();
    $quest = Quest::factory()->create([
        'user_id' => $user->id,
        'xp_reward' => 40,
        'completed' => false,
    ]);

    $this->actingAs($user);

    Livewire::test(RpgDashboard::class)
        ->call('toggleQuest', $quest->id)
        ->call('toggleQuest', $quest->id)
        ->call('toggleQuest', $quest->id);

    expect($user->fresh()->stat->xp)->toBe(40)
        ->and($quest->fresh()->xp_rewarded_at)->not->toBeNull();
});

test('marking a habit multiple times in one day does not award duplicate xp', function () {
    CarbonImmutable::setTestNow('2026-02-14 09:00:00');
    try {
        $user = User::factory()->create();
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'xp_reward' => 25,
            'streak' => 0,
            'last_completed_at' => null,
        ]);

        $this->actingAs($user);

        Livewire::test(RpgDashboard::class)
            ->call('toggleHabit', $habit->id)
            ->call('toggleHabit', $habit->id)
            ->call('toggleHabit', $habit->id);

        expect($user->fresh()->stat->xp)->toBe(25)
            ->and($habit->fresh()->xp_rewarded_on?->toDateString())->toBe('2026-02-14');
    } finally {
        CarbonImmutable::setTestNow();
    }
});
