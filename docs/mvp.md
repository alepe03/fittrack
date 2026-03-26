# MVP (global real y defendible)

Este documento delimita el alcance actual **honesto** del proyecto FitTrack: qué está implementado y validado de punta a punta, y qué queda fuera por fase.

## Incluye actualmente (implementado / validado)
### Rutinas (end-to-end)
- Base de datos PostgreSQL con tablas:
  - `rutinas`, `rutina_ejercicios`, `rutina_series`.
- Modelos Eloquent y migraciones con relaciones y `onDelete` coherentes.
- API REST real en Laravel para gestionar una rutina completa:
  - `GET /api/rutinas` (incluye `ejercicios_count` real).
  - `GET /api/rutinas/{id}` (incluye ejercicios y series objetivo anidadas).
  - `POST /api/rutinas` (crea rutina + ejercicios + series en una transacción).
  - `PUT /api/rutinas/{id}` (reemplazo total en una transacción).
  - `DELETE /api/rutinas/{id}`.
  - `POST /api/rutinas/{id}/duplicar`.
- Frontend Vue 3 que consume la API real para listado/detalle/crear/editar/duplicar/borrar.

### Persistencia y UX de frontend
- Formulario de rutina con ejercicios y series objetivo dinámicos.
- Persistencia temporal del “entreno en curso” usando `sessionStorage`.
- Preferencia de orden de rutinas usando `localStorage`.

## Fuera de este MVP / en fase futura
- Autenticación real integrada con backend (por ahora el frontend usa token simulado en `localStorage`).
- CRUD de entrenos vía API REST (en esta fase el módulo de entrenos sigue usando persistencia mock en el lado cliente).
- Catálogo global de ejercicios, estadísticas y perfil de usuario.

## Decisión de alcance (defendible)
El MVP actual se centra en un flujo completo y consistente para **rutinas**, conectando frontend-backend-bd con una API REST real. Los entrenos y el catálogo global se dejan como evolución para mantener un desarrollo simple y defendible en el tiempo. 
