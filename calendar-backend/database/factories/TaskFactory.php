<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Sprint;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(),
            'description' => fake()->paragraph(5),
            'deadline' => fake()->date(),
            'status' => fake()->word(),
            'user_id' => User::inRandomOrder()->first() ?? User::factory()->create(),
            'sprint_id' => Sprint::inRandomOrder()->first() ?? Sprint::factory()->create()
        ];
    }
}
