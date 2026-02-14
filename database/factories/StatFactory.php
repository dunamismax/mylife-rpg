<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stat>
 */
class StatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'level' => 1,
            'xp' => 0,
            'hp' => 100,
            'strength' => 10,
            'endurance' => 10,
            'intelligence' => 10,
            'wisdom' => 10,
            'charisma' => 10,
            'willpower' => 10,
        ];
    }
}
