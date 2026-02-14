<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Habit>
 */
class HabitFactory extends Factory
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
            'title' => fake()->sentence(3),
            'description' => fake()->optional()->sentence(),
            'type' => fake()->randomElement(['good', 'bad']),
            'xp_reward' => fake()->numberBetween(0, 50),
            'stats_affected' => null,
            'hp_affected' => null,
            'streak' => fake()->numberBetween(0, 5),
            'last_completed_at' => fake()->optional()->dateTimeBetween('-7 days', 'today'),
        ];
    }
}
