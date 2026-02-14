<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quest>
 */
class QuestFactory extends Factory
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
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->sentence(),
            'type' => fake()->randomElement(['daily', 'weekly', 'major']),
            'xp_reward' => fake()->numberBetween(5, 100),
            'difficulty' => fake()->optional()->randomElement(['Easy', 'Medium', 'Hard']),
            'stats_affected' => null,
            'hp_affected' => null,
            'completed' => false,
            'due_date' => fake()->optional()->dateTimeBetween('now', '+1 month'),
            'is_recurring' => false,
            'recurrence_pattern' => null,
            'completed_at' => null,
        ];
    }
}
