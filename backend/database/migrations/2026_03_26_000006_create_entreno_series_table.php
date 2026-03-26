<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entreno_series', function (Blueprint $table) {
            $table->id();

            $table->foreignId('entreno_ejercicio_id')
                ->constrained('entreno_ejercicios')
                ->cascadeOnDelete();

            $table->unsignedInteger('orden');
            $table->unsignedInteger('reps');
            $table->decimal('peso', 8, 2);
            $table->boolean('completada')->default(false);
            $table->unsignedInteger('rir')->nullable();
            $table->boolean('es_pr')->default(false);
            $table->string('comparativa_objetivo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entreno_series');
    }
};

