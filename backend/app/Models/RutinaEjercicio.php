<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RutinaEjercicio extends Model
{
    protected $fillable = [
        'rutina_id',
        'nombre',
        'orden',
    ];

    public function rutina(): BelongsTo
    {
        return $this->belongsTo(Rutina::class);
    }

    public function rutinaSeries(): HasMany
    {
        return $this->hasMany(RutinaSerie::class);
    }

    public function entrenoEjercicios(): HasMany
    {
        return $this->hasMany(EntrenoEjercicio::class);
    }
}

