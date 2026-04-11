<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Usuario de desarrollo (Sanctum / login real). Ejecutar: php artisan db:seed
     * La contraseña en claro la hashea el cast "hashed" del modelo User.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'dev@fittrack.local'],
            [
                'name' => 'Usuario desarrollo',
                'password' => 'password',
            ]
        );
    }
}
