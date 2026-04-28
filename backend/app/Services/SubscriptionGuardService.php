<?php

namespace App\Services;

use App\Models\Rutina;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubscriptionGuardService
{
    private const FREE_ROUTINE_LIMIT = 3;
    private const FREE_ROUTINE_LIMIT_ERROR = [
        'code' => 'FREE_ROUTINE_LIMIT_REACHED',
        'message' => 'El plan Free permite hasta 3 rutinas. Hazte Premium para crear ilimitadas.',
        'required_plan' => 'premium',
    ];
    private const PREMIUM_FEATURE_REQUIRED_ERROR = [
        'code' => 'PREMIUM_FEATURE_REQUIRED',
        'message' => 'Función disponible solo para usuarios Premium.',
        'required_plan' => 'premium',
    ]; // El campo feature se añade dinámicamente por caso.

    public function assertCanCreateRoutine(User $user): void
    {
        if ($user->isPremium()) {
            return;
        }

        $rutinasCount = Rutina::query()
            ->where('user_id', $user->id)
            ->count();

        if ($rutinasCount >= self::FREE_ROUTINE_LIMIT) {
            throw new HttpResponseException(
                response()->json(self::FREE_ROUTINE_LIMIT_ERROR, 403)
            );
        }
    }

    public function assertCanUseAdvancedTrainingFeatures(User $user, array $payload): void
    {
        if ($user->isPremium()) {
            return;
        }

        // Fase temporal segura: solo bloquear uso avanzado de RIR.
        if ($this->isUsingRir($payload)) {
            throw new HttpResponseException(
                response()->json($this->premiumFeatureRequiredError('rir'), 403)
            );
        }
    }

    /**
     * @return array{code: string, message: string, required_plan: string, feature: string}
     */
    private function premiumFeatureRequiredError(string $feature): array
    {
        return [
            ...self::PREMIUM_FEATURE_REQUIRED_ERROR,
            'feature' => $feature,
        ];
    }

    private function isUsingRestTimer(array $payload): bool
    {
        return array_key_exists('descanso_segundos_usado', $payload)
            && $payload['descanso_segundos_usado'] !== null
            && is_numeric($payload['descanso_segundos_usado'])
            && (int) $payload['descanso_segundos_usado'] > 0;
    }

    private function isUsingRir(array $payload): bool
    {
        $ejercicios = $payload['ejercicios'] ?? [];
        if (! is_array($ejercicios)) {
            return false;
        }

        foreach ($ejercicios as $ejercicio) {
            if (! is_array($ejercicio)) {
                continue;
            }

            $series = $ejercicio['series'] ?? [];
            if (! is_array($series)) {
                continue;
            }

            foreach ($series as $serie) {
                if (! is_array($serie)) {
                    continue;
                }

                if (array_key_exists('rir', $serie) && $serie['rir'] !== null) {
                    return true;
                }
            }
        }

        return false;
    }
}
