<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entrenos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('rutina_id')
                ->nullable()
                ->constrained('rutinas')
                ->nullOnDelete();

            $table->string('nombre_rutina');
            $table->timestamp('fecha_entreno');
            $table->text('nota_general')->nullable();
            $table->unsignedInteger('duracion_segundos')->nullable();
            $table->unsignedInteger('descanso_segundos_usado')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entrenos');
    }
};

