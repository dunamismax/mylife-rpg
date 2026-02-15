<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;

test('database seeder provisions the default login credentials', function () {
    $this->seed(DatabaseSeeder::class);

    $response = $this->post(route('login.store'), [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticated();
});

test('database seeder refreshes the default login credentials when re-run', function () {
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => 'old-password',
    ]);

    $this->seed(DatabaseSeeder::class);

    $response = $this->post(route('login.store'), [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('dashboard', absolute: false));

    expect(User::query()->where('email', 'test@example.com')->count())->toBe(1);

    $this->assertAuthenticated();
});
