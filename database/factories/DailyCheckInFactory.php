<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DailyCheckIn>
 */
class DailyCheckInFactory extends Factory
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
            'check_in_date' => fake()->dateTimeBetween('-14 days', 'today')->format('Y-m-d'),
            'daily_intention' => fake()->sentence(6),
            'if_then_plan' => fake()->sentence(8),
            'craving_intensity' => fake()->numberBetween(0, 10),
            'trigger_notes' => fake()->optional()->sentence(),
            'reflection' => fake()->optional()->paragraph(),
            'slip_happened' => fake()->boolean(20),
        ];
    }
}
