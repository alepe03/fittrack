<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EntrenoSerie extends Model
{
    protected $fillable = [
        'entreno_ejercicio_id',
        'orden',
        'reps',
        'peso',
        'completada',
        'rir',
        'es_pr',
        'comparativa_objetivo',
    ];

    protected $casts = [
        'completada' => 'boolean',
        'es_pr' => 'boolean',
    ];

    public function entrenoEjercicio(): BelongsTo
    {
        return $this->belongsTo(EntrenoEjercicio::class);
    }

    public function ejercicio(): BelongsTo
    {
        return $this->belongsTo(EntrenoEjercicio::class, 'entreno_ejercicio_id');
    }
}

