<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EntrenoEjercicio extends Model
{
    protected $fillable = [
        'entreno_id',
        'rutina_ejercicio_id',
        'nombre',
        'orden',
    ];

    public function entreno(): BelongsTo
    {
        return $this->belongsTo(Entreno::class);
    }

    public function rutinaEjercicio(): BelongsTo
    {
        return $this->belongsTo(RutinaEjercicio::class, 'rutina_ejercicio_id');
    }

    public function entrenoSeries(): HasMany
    {
        return $this->hasMany(EntrenoSerie::class);
    }
}

