<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StatusEffect>
 */
class StatusEffectFactory extends Factory
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
            'name' => fake()->randomElement(['Fatigue', 'Focus', 'Burnout', 'Inspiration']),
            'description' => fake()->sentence(),
            'cause' => fake()->optional()->sentence(3),
            'duration' => fake()->optional()->randomElement(['4 hours', '1 day', '3 days']),
            'penalty' => fake()->optional()->sentence(3),
            'is_active' => true,
            'applied_at' => now(),
            'expires_at' => fake()->optional()->dateTimeBetween('now', '+3 days'),
        ];
    }
}
