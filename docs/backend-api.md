# Backend API (Laravel) - Rutinas + Suscripcion

## Stack backend
- Laravel (PHP) con migraciones y Eloquent.
- PostgreSQL como motor de base de datos.
- API REST para los modulos `rutinas`, `entrenos`, autenticacion y suscripcion.

## Tablas principales (MVP de rutinas)
- `rutinas`
- `rutina_ejercicios`
- `rutina_series`

## Relaciones principales
- `rutinas (1) -> (N) rutina_ejercicios`
- `rutina_ejercicios (1) -> (N) rutina_series`
- `rutinas` pertenece a `users` (FK).

## Endpoints de rutinas implementados
Base: `/api/rutinas`

1. `GET /api/rutinas`
   - Orden: `created_at` descendente.
   - Devuelve: listado con `ejercicios_count` (recuento real de `rutina_ejercicios`).

2. `GET /api/rutinas/{id}`
   - Devuelve una rutina completa con:
     - `ejercicios` ordenados por `orden` asc.
     - `series` de cada ejercicio ordenadas por `orden` asc.

3. `POST /api/rutinas`
   - Crea rutina + ejercicios + series objetivo en una transacción.

4. `PUT /api/rutinas/{id}`
   - Actualiza la rutina con reemplazo total:
     - borra `rutina_ejercicios`/`rutina_series` actuales asociados
     - recrea con el nuevo payload

5. `DELETE /api/rutinas/{id}`
   - Borra la rutina. La cascada en BD elimina el resto dependiente.

6. `POST /api/rutinas/{id}/duplicar`
   - Duplica rutina + ejercicios + series respetando `orden`.
   - Nombre de la copia: `"{nombre original} (copia)"`.

## Endpoint de suscripcion (SSG)

Base: `/api/subscription`

1. `POST /api/subscription/upgrade-simulated`
   - Protegido con `auth:sanctum`.
   - Requiere payload de pago simulado:
     - `cardholder_name`
     - `card_number`
     - `expiry` (`MM/YY`)
     - `cvv`
   - Comportamiento:
     - Si el usuario ya es Premium: error `409` con mensaje claro.
     - Si es Free: actualiza `plan = premium` y `plan_changed_at`.
   - Devuelve:
     - `user` actualizado
     - `receipt` (comprobante simulado con UUID, fecha, estado y metadatos de pago seguro).

2. `POST /api/subscription/cancel`
   - Protegido con `auth:sanctum`.
   - No requiere payload.
   - Comportamiento:
     - Si el usuario es Premium: actualiza `plan = free` y `plan_changed_at`.
     - Si el usuario ya es Free: error `409` con mensaje claro.
   - Devuelve:
     - `user` actualizado en cancelacion correcta.

### Ejemplo de respuesta exitosa de suscripcion
```json
{
  "message": "Plan actualizado a Premium correctamente.",
  "user": {
    "id": 1,
    "name": "Usuario",
    "email": "usuario@fittrack.dev",
    "plan": "premium"
  },
  "receipt": {
    "receipt_id": "7f11f31c-6fe5-4d23-8f4e-3f76e8f5f53c",
    "issued_at": "2026-04-28T10:30:00+00:00",
    "plan": "premium",
    "amount": 0,
    "currency": "EUR",
    "status": "paid_simulated",
    "user_email": "usuario@fittrack.dev",
    "card_last4": "4242"
  }
}
```

## Contrato JSON (formato esperado)

### GET /api/rutinas (listado)
Devuelve un array:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "nombre": "Piernas",
    "descripcion": "Rutina de prueba",
    "created_at": "2026-03-26T...",
    "updated_at": "2026-03-26T...",
    "ejercicios_count": 1
  }
]
```

### GET /api/rutinas/{id} (detalle)
```json
{
  "id": 1,
  "user_id": 1,
  "nombre": "Piernas",
  "descripcion": "Rutina de prueba",
  "created_at": "2026-03-26T...",
  "updated_at": "2026-03-26T...",
  "ejercicios": [
    {
      "id": 3,
      "rutina_id": 1,
      "nombre": "Hacka",
      "orden": 1,
      "created_at": "2026-03-26T...",
      "updated_at": "2026-03-26T...",
      "series": [
        {
          "id": 3,
          "rutina_ejercicio_id": 3,
          "orden": 1,
          "reps_objetivo": 10,
          "peso_sugerido": "60.00",
          "created_at": "2026-03-26T...",
          "updated_at": "2026-03-26T..."
        }
      ]
    }
  ]
}
```

### POST /api/rutinas y PUT /api/rutinas/{id} (payload)
```json
{
  "user_id": 1,
  "nombre": "Piernas",
  "descripcion": null,
  "ejercicios": [
    {
      "nombre": "Hacka",
      "orden": 1,
      "series": [
        { "orden": 1, "reps_objetivo": 10, "peso_sugerido": 50 }
      ]
    }
  ]
}
```

## Decisiones de implementación
- Validación de payload con reglas explícitas (`exists:users,id`, `min:1`, etc.).
- Uso de transacciones para mantener consistencia (crear/editar rutina completa).
- Reemplazo total en `PUT` para evitar lógica incremental/diff en un formulario dinámico.
- Cascadas y `set null` coherentes con el histórico:
  - cuando se pierde el “template” de un elemento, el histórico se mantiene con `null` donde aplica.

## Estado actual y próximos pasos
- Estado actual:
  - autenticacion real con Sanctum (`/api/auth/*`);
  - endpoints de `rutinas` y `entrenos` protegidos y consumidos por frontend;
  - flujo SSG de suscripcion Free/Premium operativo con alta, comprobante y cancelacion.
- Seguridad de pagos simulados:
  - no se persiste tarjeta completa;
  - no se persiste CVV;
  - el comprobante se devuelve en respuesta sin almacenar datos sensibles.
- Alcance de pago:
  - no hay pagos reales;
  - no se usa Stripe en esta fase.
- Proximo paso logico:
  - incorporar pasarela de pago real en otra fase;
  - opcion de comprobante PDF descargable.

