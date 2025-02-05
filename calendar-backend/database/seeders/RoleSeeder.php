<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create(['name' => Role::SCRUM_MASTER]);
        Role::create(['name' => Role::PRODUCT_OWNER]);
        Role::create(['name' => Role::DEVELOPER]);
    }
}
