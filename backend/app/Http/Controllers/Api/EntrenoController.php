<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Entreno;
use App\Models\EntrenoEjercicio;
use App\Models\EntrenoSerie;
use App\Models\Rutina;
use App\Models\RutinaSerie;
use App\Services\SubscriptionGuardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EntrenoController extends Controller
{
    public function __construct(
        private SubscriptionGuardService $subscriptionGuard,
    ) {}

    /**
     * Listado ligero (sin ejercicios/series): la UI del histórico solo necesita cabecera del entreno.
     */
    public function index(Request $request)
    {
        $entrenos = Entreno::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('fecha_entreno')
            ->orderByDesc('id')
            ->get([
                'id',
                'user_id',
                'rutina_id',
                'nombre_rutina',
                'fecha_entreno',
                'nota_general',
                'duracion_segundos',
                'descanso_segundos_usado',
                'created_at',
                'updated_at',
            ]);

        return response()->json($entrenos);
    }

    public function store(Request $request)
    {
        $request->validate($this->validationRules($request));
        $this->subscriptionGuard->assertCanUseAdvancedTrainingFeatures(
            $request->user(),
            $request->all()
        );

        return DB::transaction(function () use ($request) {
            $entreno = Entreno::create([
                'user_id' => $request->user()->id,
                'rutina_id' => $request->rutina_id,
                'nombre_rutina' => $request->nombre_rutina,
                'fecha_entreno' => $request->fecha_entreno,
                'nota_general' => $request->nota_general,
                'duracion_segundos' => $request->duracion_segundos,
                'descanso_segundos_usado' => $request->descanso_segundos_usado,
            ]);

            $this->reemplazarEjerciciosDesdePayload($entreno, $request->ejercicios);

            return response()->json([
                'message' => 'Entreno guardado correctamente',
                'entreno_id' => $entreno->id,
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $request->validate($this->validationRules($request));
        $this->subscriptionGuard->assertCanUseAdvancedTrainingFeatures(
            $request->user(),
            $request->all()
        );

        $entreno = Entreno::query()
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (! $entreno) {
            return response()->json([
                'message' => 'Entreno no encontrado',
            ], 404);
        }

        return DB::transaction(function () use ($request, $entreno) {
            $entreno->update([
                'rutina_id' => $request->rutina_id,
                'nombre_rutina' => $request->nombre_rutina,
                'fecha_entreno' => $request->fecha_entreno,
                'nota_general' => $request->nota_general,
                'duracion_segundos' => $request->duracion_segundos,
                'descanso_segundos_usado' => $request->descanso_segundos_usado,
            ]);

            $entreno->ejercicios()->delete();
            $this->reemplazarEjerciciosDesdePayload($entreno, $request->ejercicios);

            return response()->json([
                'message' => 'Entreno actualizado correctamente',
                'entreno_id' => $entreno->id,
            ]);
        });
    }

    public function destroy(Request $request, $id)
    {
        $entreno = Entreno::query()
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (! $entreno) {
            return response()->json([
                'message' => 'Entreno no encontrado',
            ], 404);
        }

        $entreno->delete();

        return response()->json([
            'message' => 'Entreno eliminado correctamente',
        ]);
    }

    public function show(Request $request, $id)
    {
        $entreno = Entreno::query()
            ->where('user_id', $request->user()->id)
            ->with([
                'ejercicios' => function ($query) {
                    $query->orderBy('orden')->with([
                        'series' => function ($subQuery) {
                            $subQuery->orderBy('orden');
                        },
                    ]);
                },
            ])
            ->find($id);

        if (! $entreno) {
            return response()->json([
                'message' => 'Entreno no encontrado',
            ], 404);
        }

        return response()->json($entreno);
    }

    /**
     * Compara reps/peso realizados con rutina_series (mismo rutina_ejercicio_id y orden).
     * Sin vínculo a rutina, sin fila objetivo o datos incompletos → null.
     * Si no hay peso_sugerido en la rutina, solo se compara por reps (superado / cumplido / debajo).
     */
    private function calcularComparativaObjetivo(
        ?int $rutinaEjercicioId,
        int $ordenSerie,
        int $reps,
        float $peso,
    ): ?string {
        if ($rutinaEjercicioId === null) {
            return null;
        }

        $objetivo = RutinaSerie::query()
            ->where('rutina_ejercicio_id', $rutinaEjercicioId)
            ->where('orden', $ordenSerie)
            ->first();

        if ($objetivo === null) {
            return null;
        }

        $repsObjetivo = (int) $objetivo->reps_objetivo;
        $pesoSugerido = $objetivo->peso_sugerido;

        if ($pesoSugerido === null) {
            if ($reps > $repsObjetivo) {
                return 'superado';
            }
            if ($reps >= $repsObjetivo) {
                return 'cumplido';
            }

            return 'debajo';
        }

        $pesoSugeridoNum = (float) $pesoSugerido;

        if ($reps > $repsObjetivo) {
            return 'superado';
        }

        if ($reps === $repsObjetivo && $peso > $pesoSugeridoNum) {
            return 'superado';
        }

        if ($reps === $repsObjetivo && abs($peso - $pesoSugeridoNum) < 0.01) {
            return 'cumplido';
        }

        return 'debajo';
    }

    /**
     * PR si la serie está completada y no hay ninguna serie histórica previa (otros entrenos) del mismo
     * ejercicio con más peso, o el mismo peso (±0,01) y más reps. Misma identidad: rutina_ejercicio_id o, si falta, nombre.
     */
    private function calcularEsPr(
        int $entrenoId,
        ?int $rutinaEjercicioId,
        string $nombreEjercicio,
        int $reps,
        float $peso,
        bool $completada,
    ): bool {
        if (! $completada) {
            return false;
        }

        $existsBetter = DB::table('entreno_series')
            ->join('entreno_ejercicios', 'entreno_series.entreno_ejercicio_id', '=', 'entreno_ejercicios.id')
            ->join('entrenos', 'entreno_ejercicios.entreno_id', '=', 'entrenos.id')
            ->where('entrenos.user_id', auth()->id())
            // Solo comparar contra entrenos anteriores para evitar inconsistencias.
            // Usar '<' en lugar de '!=' asegura un histórico temporal correcto (no mezcla entrenos posteriores ni el propio).
            ->where('entrenos.id', '<', $entrenoId)
            ->where('entreno_series.completada', true)
            ->where(function ($q) use ($rutinaEjercicioId, $nombreEjercicio) {
                if ($rutinaEjercicioId !== null) {
                    $q->where('entreno_ejercicios.rutina_ejercicio_id', $rutinaEjercicioId);
                } else {
                    $q->where('entreno_ejercicios.nombre', $nombreEjercicio);
                }
            })
            ->where(function ($q) use ($peso, $reps) {
                $q->whereRaw('entreno_series.peso > ? + 0.01', [$peso])
                    ->orWhere(function ($q2) use ($peso, $reps) {
                        $q2->whereRaw('ABS(entreno_series.peso - ?) < 0.01', [$peso])
                            ->where('entreno_series.reps', '>', $reps);
                    });
            })
            ->exists();

        return ! $existsBetter;
    }

    private function validationRules(Request $request): array
    {
        return [
            'rutina_id' => [
                'nullable',
                Rule::exists('rutinas', 'id')->where('user_id', $request->user()->id),
            ],
            'nombre_rutina' => ['required', 'string'],
            'fecha_entreno' => ['required', 'date'],
            'nota_general' => ['nullable', 'string'],
            'duracion_segundos' => ['nullable', 'integer'],
            'descanso_segundos_usado' => ['nullable', 'integer'],
            'ejercicios' => ['required', 'array'],
            'ejercicios.*.nombre' => ['required', 'string'],
            'ejercicios.*.orden' => ['required', 'integer'],
            'ejercicios.*.rutina_ejercicio_id' => [
                'nullable',
                'integer',
                Rule::exists('rutina_ejercicios', 'id')->whereIn(
                    'rutina_id',
                    Rutina::query()->where('user_id', $request->user()->id)->select('id')
                ),
            ],
            'ejercicios.*.series' => ['required', 'array'],
            'ejercicios.*.series.*.orden' => ['required', 'integer'],
            'ejercicios.*.series.*.reps' => ['required', 'integer'],
            'ejercicios.*.series.*.peso' => ['required', 'numeric'],
            'ejercicios.*.series.*.rir' => ['nullable', 'integer', 'between:0,5'],
            'ejercicios.*.series.*.completada' => ['required', 'boolean'],
        ];
    }

    private function reemplazarEjerciciosDesdePayload(Entreno $entreno, array $ejercicios): void
    {
        foreach ($ejercicios as $ejercicioData) {
            $entrenoEjercicio = EntrenoEjercicio::create([
                'entreno_id' => $entreno->id,
                'rutina_ejercicio_id' => $ejercicioData['rutina_ejercicio_id'] ?? null,
                'nombre' => $ejercicioData['nombre'],
                'orden' => $ejercicioData['orden'],
            ]);

            foreach ($ejercicioData['series'] as $serieData) {
                $rutinaEjId = $entrenoEjercicio->rutina_ejercicio_id !== null
                    ? (int) $entrenoEjercicio->rutina_ejercicio_id
                    : null;

                $comparativa = $this->calcularComparativaObjetivo(
                    $rutinaEjId,
                    (int) $serieData['orden'],
                    (int) $serieData['reps'],
                    (float) $serieData['peso'],
                );

                $esPr = $this->calcularEsPr(
                    (int) $entreno->id,
                    $rutinaEjId,
                    (string) $ejercicioData['nombre'],
                    (int) $serieData['reps'],
                    (float) $serieData['peso'],
                    (bool) $serieData['completada'],
                );

                EntrenoSerie::create([
                    'entreno_ejercicio_id' => $entrenoEjercicio->id,
                    'orden' => $serieData['orden'],
                    'reps' => $serieData['reps'],
                    'peso' => $serieData['peso'],
                    'rir' => $serieData['rir'] ?? null,
                    'completada' => $serieData['completada'],
                    'es_pr' => $esPr,
                    'comparativa_objetivo' => $comparativa,
                ]);
            }
        }
    }
}
