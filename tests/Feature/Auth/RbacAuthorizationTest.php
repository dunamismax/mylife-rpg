<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;

test('dashboard requires the dashboard permission', function () {
    $user = User::factory()->create();
    $user->syncRoles([]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertForbidden();
});

test('settings security routes require the security permission', function () {
    $user = User::factory()->create();
    $user->syncRoles([]);

    $this->actingAs($user)
        ->get(route('user-password.edit'))
        ->assertForbidden();
});

test('non admin users cannot access monitoring dashboard gates', function () {
    $user = User::factory()->create();

    expect(Gate::forUser($user)->allows('viewPulse'))->toBeFalse();
    expect(Gate::forUser($user)->allows('viewTelescope'))->toBeFalse();
});

test('admin users can access monitoring dashboard gates', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->syncRoles(['admin']);

    expect(Gate::forUser($user)->allows('viewPulse'))->toBeTrue();
    expect(Gate::forUser($user)->allows('viewTelescope'))->toBeTrue();
});
