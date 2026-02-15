<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        if (Schema::hasTable('roles') && Schema::hasTable('permissions') && Schema::hasTable('model_has_roles')) {
            $guardName = config('auth.defaults.guard', 'web');

            $permissionNames = collect([
                'access dashboard',
                'manage profile settings',
                'manage security settings',
            ])->map(fn (string $permission): string => Permission::findOrCreate($permission, $guardName)->name);

            $playerRole = Role::findOrCreate('player', $guardName);
            $playerRole->syncPermissions($permissionNames);

            $user->assignRole($playerRole);
        }

        return $user;
    }
}
