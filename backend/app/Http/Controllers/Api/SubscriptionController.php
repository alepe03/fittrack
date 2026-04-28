<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    public function cancel(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user instanceof User) {
            abort(401);
        }

        if (! $user->isPremium()) {
            return response()->json([
                'message' => 'El usuario ya tiene el plan Free activo.',
            ], 409);
        }

        $user->forceFill([
            'plan' => 'free',
            'plan_changed_at' => now(),
        ])->save();

        return response()->json([
            'message' => 'Suscripción Premium cancelada correctamente.',
            'user' => [
                'id' => (int) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'plan' => $user->plan,
            ],
        ]);
    }

    public function upgradeSimulated(Request $request): JsonResponse
    {
        $data = $request->validate([
            'cardholder_name' => ['required', 'string', 'max:255'],
            'card_number' => ['required', 'string', 'regex:/^[0-9 ]{13,19}$/'],
            'expiry' => ['required', 'string', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
            'cvv' => ['required', 'string', 'regex:/^\d{3,4}$/'],
        ]);

        $user = $request->user();
        if (! $user instanceof User) {
            abort(401);
        }

        if ($user->isPremium()) {
            return response()->json([
                'message' => 'El usuario ya tiene el plan Premium activo.',
            ], 409);
        }

        $cardNumberDigits = preg_replace('/\D+/', '', (string) $data['card_number']);
        $cardLast4 = is_string($cardNumberDigits) && $cardNumberDigits !== ''
            ? substr($cardNumberDigits, -4)
            : null;

        // Flujo simulado: validamos formato, no persistimos datos de tarjeta y actualizamos plan.
        unset($data);

        $user->forceFill([
            'plan' => 'premium',
            'plan_changed_at' => now(),
        ])->save();

        return response()->json([
            'message' => 'Plan actualizado a Premium correctamente.',
            'user' => [
                'id' => (int) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'plan' => $user->plan,
            ],
            'receipt' => [
                'receipt_id' => (string) Str::uuid(),
                'issued_at' => now()->toIso8601String(),
                'plan' => 'premium',
                'amount' => 0,
                'currency' => 'EUR',
                'status' => 'paid_simulated',
                'user_email' => $user->email,
                'card_last4' => $cardLast4,
            ],
        ]);
    }
}
