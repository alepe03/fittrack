<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entreno extends Model
{
    protected $fillable = [
        'user_id',
        'rutina_id',
        'nombre_rutina',
        'fecha_entreno',
        'nota_general',
        'duracion_segundos',
        'descanso_segundos_usado',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rutina(): BelongsTo
    {
        return $this->belongsTo(Rutina::class, 'rutina_id');
    }

    public function entrenoEjercicios(): HasMany
    {
        return $this->hasMany(EntrenoEjercicio::class);
    }

    public function ejercicios(): HasMany
    {
        return $this->hasMany(EntrenoEjercicio::class);
    }
}

