<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Achievement>
 */
class AchievementFactory extends Factory
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
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->sentence(),
            'condition' => fake()->sentence(4),
            'reward' => fake()->sentence(3),
            'unlocked' => fake()->boolean(),
            'unlocked_at' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
