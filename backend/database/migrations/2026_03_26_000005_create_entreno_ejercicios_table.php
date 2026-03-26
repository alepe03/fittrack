<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entreno_ejercicios', function (Blueprint $table) {
            $table->id();

            $table->foreignId('entreno_id')
                ->constrained('entrenos')
                ->cascadeOnDelete();

            $table->foreignId('rutina_ejercicio_id')
                ->nullable()
                ->constrained('rutina_ejercicios')
                ->nullOnDelete();

            $table->string('nombre');
            $table->unsignedInteger('orden');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entreno_ejercicios');
    }
};

