# Backend API (Laravel) - Rutinas

## Stack backend
- Laravel (PHP) con migraciones y Eloquent.
- PostgreSQL como motor de base de datos.
- API REST para el módulo `rutinas`.

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
- Estado actual: endpoints de `rutinas` implementados y consumidos por el frontend (integration end-to-end ya validada).
- Próximo paso lógico: integrar endpoints REST de `entrenos` y conectar el frontend de entrenamientos a la API real.
- Autenticación: por ahora no hay autenticación real integrada para proteger endpoints de esta fase (el frontend usa `user_id = 1` temporalmente).

