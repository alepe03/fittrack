<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RutinaSerie extends Model
{
    protected $fillable = [
        'rutina_ejercicio_id',
        'orden',
        'reps_objetivo',
        'peso_sugerido',
    ];

    public function rutinaEjercicio(): BelongsTo
    {
        return $this->belongsTo(RutinaEjercicio::class);
    }
}

