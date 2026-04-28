<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rutina;
use App\Services\SubscriptionGuardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RutinaController extends Controller
{
    public function __construct(
        private SubscriptionGuardService $subscriptionGuard,
    ) {}

    public function index()
    {
        $rutinas = Rutina::query()
            ->where('user_id', auth()->id())
            ->withCount(['rutinaEjercicios as ejercicios_count'])
            ->orderByDesc('created_at')
            ->get([
                'id',
                'user_id',
                'nombre',
                'descripcion',
                'created_at',
                'updated_at',
            ]);

        return response()->json(
            $rutinas->map(fn (Rutina $rutina) => [
                'id' => $rutina->id,
                'user_id' => $rutina->user_id,
                'nombre' => $rutina->nombre,
                'descripcion' => $rutina->descripcion,
                'created_at' => $rutina->created_at,
                'updated_at' => $rutina->updated_at,
                'ejercicios_count' => $rutina->ejercicios_count,
            ])
        );
    }

    public function show(int $id)
    {
        $rutina = $this->loadRutinaCompleteParaUsuario($id);
        if (! $rutina) {
            return response()->json(['message' => 'Rutina no encontrada'], 404);
        }

        return response()->json($this->formatRutinaComplete($rutina), 200);
    }

    public function store(Request $request)
    {
        $this->subscriptionGuard->assertCanCreateRoutine($request->user());

        $data = $request->validate($this->rules());

        return DB::transaction(function () use ($data, $request) {
            $rutina = Rutina::create([
                'user_id' => $request->user()->id,
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'] ?? null,
            ]);

            foreach ($data['ejercicios'] as $ejercicio) {
                $rutinaEjercicio = $rutina->rutinaEjercicios()->create([
                    'nombre' => $ejercicio['nombre'],
                    'orden' => $ejercicio['orden'],
                ]);

                foreach ($ejercicio['series'] as $serie) {
                    $rutinaEjercicio->rutinaSeries()->create([
                        'orden' => $serie['orden'],
                        'reps_objetivo' => $serie['reps_objetivo'],
                        'peso_sugerido' => $serie['peso_sugerido'] ?? null,
                    ]);
                }
            }

            $rutina = $this->loadRutinaCompleteParaUsuario($rutina->id);

            return response()->json($this->formatRutinaComplete($rutina), 201);
        });
    }

    public function update(Request $request, int $id)
    {
        $rutina = Rutina::query()
            ->where('user_id', $request->user()->id)
            ->find($id);
        if (! $rutina) {
            return response()->json(['message' => 'Rutina no encontrada'], 404);
        }

        $data = $request->validate($this->rules());

        return DB::transaction(function () use ($rutina, $data) {
            $rutina->update([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'] ?? null,
            ]);

            // Reemplazo total: eliminamos ejercicios actuales (con cascada de series).
            $rutina->rutinaEjercicios()->delete();

            foreach ($data['ejercicios'] as $ejercicio) {
                $rutinaEjercicio = $rutina->rutinaEjercicios()->create([
                    'nombre' => $ejercicio['nombre'],
                    'orden' => $ejercicio['orden'],
                ]);

                foreach ($ejercicio['series'] as $serie) {
                    $rutinaEjercicio->rutinaSeries()->create([
                        'orden' => $serie['orden'],
                        'reps_objetivo' => $serie['reps_objetivo'],
                        'peso_sugerido' => $serie['peso_sugerido'] ?? null,
                    ]);
                }
            }

            $rutina = $this->loadRutinaCompleteParaUsuario($rutina->id);

            return response()->json($this->formatRutinaComplete($rutina), 200);
        });
    }

    public function destroy(Request $request, int $id)
    {
        $rutina = Rutina::query()
            ->where('user_id', $request->user()->id)
            ->find($id);
        if (! $rutina) {
            return response()->json(['message' => 'Rutina no encontrada'], 404);
        }

        $rutina->delete();

        return response()->noContent();
    }

    public function duplicar(Request $request, int $id)
    {
        $original = $this->loadRutinaCompleteParaUsuario($id);
        if (! $original) {
            return response()->json(['message' => 'Rutina no encontrada'], 404);
        }

        $this->subscriptionGuard->assertCanCreateRoutine($request->user());

        return DB::transaction(function () use ($original) {
            $nuevaRutina = Rutina::create([
                'user_id' => auth()->id(),
                'nombre' => $original->nombre.' (copia)',
                'descripcion' => $original->descripcion,
            ]);

            foreach ($original->rutinaEjercicios as $ejercicio) {
                $nuevoEjercicio = $nuevaRutina->rutinaEjercicios()->create([
                    'nombre' => $ejercicio->nombre,
                    'orden' => $ejercicio->orden,
                ]);

                foreach ($ejercicio->rutinaSeries as $serie) {
                    $nuevoEjercicio->rutinaSeries()->create([
                        'orden' => $serie->orden,
                        'reps_objetivo' => $serie->reps_objetivo,
                        'peso_sugerido' => $serie->peso_sugerido,
                    ]);
                }
            }

            $nuevaRutina = $this->loadRutinaCompleteParaUsuario($nuevaRutina->id);

            return response()->json($this->formatRutinaComplete($nuevaRutina), 201);
        });
    }

    private function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'ejercicios' => ['required', 'array', 'min:1'],
            'ejercicios.*.nombre' => ['required', 'string', 'max:255'],
            'ejercicios.*.orden' => ['required', 'integer', 'min:1'],
            'ejercicios.*.series' => ['required', 'array', 'min:1'],
            'ejercicios.*.series.*.orden' => ['required', 'integer', 'min:1'],
            'ejercicios.*.series.*.reps_objetivo' => ['required', 'integer', 'min:1'],
            'ejercicios.*.series.*.peso_sugerido' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    private function loadRutinaCompleteParaUsuario(int $id): ?Rutina
    {
        return Rutina::query()
            ->where('user_id', auth()->id())
            ->with([
                'rutinaEjercicios' => function ($query) {
                    $query->orderBy('orden')->with([
                        'rutinaSeries' => function ($seriesQuery) {
                            $seriesQuery->orderBy('orden');
                        },
                    ]);
                },
            ])
            ->find($id);
    }

    private function formatRutinaComplete(Rutina $rutina): array
    {
        return [
            'id' => $rutina->id,
            'user_id' => $rutina->user_id,
            'nombre' => $rutina->nombre,
            'descripcion' => $rutina->descripcion,
            'created_at' => $rutina->created_at,
            'updated_at' => $rutina->updated_at,
            'ejercicios' => $rutina->rutinaEjercicios->map(function ($ejercicio) {
                return [
                    'id' => $ejercicio->id,
                    'rutina_id' => $ejercicio->rutina_id,
                    'nombre' => $ejercicio->nombre,
                    'orden' => $ejercicio->orden,
                    'created_at' => $ejercicio->created_at,
                    'updated_at' => $ejercicio->updated_at,
                    'series' => $ejercicio->rutinaSeries->map(function ($serie) {
                        return [
                            'id' => $serie->id,
                            'rutina_ejercicio_id' => $serie->rutina_ejercicio_id,
                            'orden' => $serie->orden,
                            'reps_objetivo' => $serie->reps_objetivo,
                            'peso_sugerido' => $serie->peso_sugerido,
                            'created_at' => $serie->created_at,
                            'updated_at' => $serie->updated_at,
                        ];
                    })->values(),
                ];
            })->values(),
        ];
    }
}
