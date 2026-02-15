<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $guardName = config('auth.defaults.guard', 'web');

        $permissions = collect([
            'access dashboard',
            'manage profile settings',
            'manage security settings',
            'view monitoring dashboards',
        ])->map(fn (string $permission) => Permission::findOrCreate($permission, $guardName));

        $playerRole = Role::findOrCreate('player', $guardName);
        $playerRole->syncPermissions(
            $permissions->whereIn('name', [
                'access dashboard',
                'manage profile settings',
                'manage security settings',
            ]),
        );

        $adminRole = Role::findOrCreate('admin', $guardName);
        $adminRole->syncPermissions($permissions);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
