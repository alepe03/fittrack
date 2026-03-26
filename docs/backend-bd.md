# Backend - Base de datos (BD) - Modelo actual

## Tablas actuales (MVP)
### Rutinas (plantilla)
- `rutinas`
  - Campos: `id`, `user_id`, `nombre`, `descripcion` (nullable), `created_at`, `updated_at`
- `rutina_ejercicios`
  - Campos: `id`, `rutina_id`, `nombre`, `orden`, `created_at`, `updated_at`
- `rutina_series`
  - Campos: `id`, `rutina_ejercicio_id`, `orden`, `reps_objetivo`, `peso_sugerido` (nullable), `created_at`, `updated_at`

### Entrenos (histórico)
Las tablas existen en el esquema (migraciones/modelos) pero, en esta fase, el frontend aún no está conectado a endpoints REST de entrenos.
- `entrenos`
- `entreno_ejercicios`
- `entreno_series`

## Relaciones y decisiones de borrado (`onDelete`)

### Rutinas -> ejercicios -> series (plantilla)
- `rutinas.user_id`:
  - `onDelete cascade`
  - Si se borra un usuario, se borran sus rutinas.
- `rutina_ejercicios.rutina_id`:
  - `onDelete cascade`
  - Si se borra una rutina, se borran sus ejercicios de rutina.
- `rutina_series.rutina_ejercicio_id`:
  - `onDelete cascade`
  - Si se borra un ejercicio de rutina, se borran sus series objetivo.

### Histórico (entrenos) y “set null” cuando aplica
- `entrenos.user_id`:
  - `onDelete cascade`
  - Si se borra el usuario, se borran sus entrenos.
- `entrenos.rutina_id` (nullable):
  - `onDelete set null`
  - Si se borra la rutina, el entreno histórico queda con `rutina_id = null`.
  - `nombre_rutina` se mantiene como snapshot.
- `entreno_ejercicios.rutina_ejercicio_id` (nullable):
  - `onDelete set null`
  - Si se borra el ejercicio de rutina original, el histórico queda con `rutina_ejercicio_id = null`.
- `entreno_ejercicios.entreno_id`:
  - `onDelete cascade`
  - Si se borra el entreno, se borran sus ejercicios realizados.
- `entreno_series.entreno_ejercicio_id`:
  - `onDelete cascade`
  - Si se borra el ejercicio realizado, se borran sus series.

## Por qué existe separación entre “plantilla” y “histórico”
- Las entidades de `rutinas` representan la estructura objetivo del usuario y pueden cambiar con el tiempo.
- Los `entrenos` representan el registro histórico de lo que se hizo en una sesión.
- Por eso:
  - `entrenos` y los registros realizados guardan snapshots de texto/estructura cuando la plantilla deja de existir (`*_id` en nullable + `*nombre` como snapshot).
  - Las FK con `set null` evitan huérfanos “históricos” y mantienen integridad sin borrar el pasado cuando se elimina una plantilla.

## Estado actual
- Rutinas: **validado end-to-end** (BD + endpoints + frontend).
- Entrenos: tablas y relaciones existen en el esquema, pero falta conectar el frontend a los endpoints REST de entrenos en esta fase.

