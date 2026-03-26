<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rutina_series', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rutina_ejercicio_id')
                ->constrained('rutina_ejercicios')
                ->cascadeOnDelete();

            $table->unsignedInteger('orden');
            $table->unsignedInteger('reps_objetivo');
            $table->decimal('peso_sugerido', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rutina_series');
    }
};

