# Guion para presentación / defensa (FitTrack)

## Orden recomendado para exponer
1. **Qué es FitTrack y objetivo del proyecto** (1-2 min)
2. **Arquitectura real del monorepo** (frontend SPA + backend Laravel + PostgreSQL)
3. **MVP global real** (qué está validado y qué queda fuera)
4. **Frontend - DEW/DSW** (qué pantallas enseñar y por qué)
5. **Backend - API de rutinas** (endpoints, validación, transacciones y contratos JSON)
6. **Base de datos** (tablas, relaciones y reglas de borrado)
7. **Limitaciones actuales** (autenticación real y entrenos por API todavía pendientes)

## Qué enseñar del frontend (rutinas)
- Pantalla de listado (`/rutinas`)
  - mostrar búsqueda, orden y tarjetas.
  - demostrar que el listado usa `ejercicios_count`.
- Pantalla de detalle (`/rutinas/:id`)
  - mostrar ejercicios y series objetivo anidadas.
- Formulario de crear/editar (`/rutinas/nueva`, `/rutinas/:id/editar`)
  - ejercicios dinámicos y series dinámicas.
  - al guardar:
    - `POST /api/rutinas` (crear)
    - `PUT /api/rutinas/{id}` (reemplazo total)
- Duplicar (`POST /api/rutinas/{id}/duplicar`)
- Borrar (`DELETE /api/rutinas/{id}`) y explicar que la cascada la hace la BD.

## Qué enseñar del backend
- Destacar que `rutinas` es un flujo completo y coherente:
  - creación/edición en una transacción
  - validación del payload con reglas explícitas
  - estructura JSON anidada en ejercicios -> series
  - actualización por reemplazo total (sin diff)

## Qué enseñar de la base de datos
- Explicar “plantilla vs histórico”:
  - `rutinas*` representa el template que puede cambiar.
  - `entrenos*` representa el histórico.
- Mostrar decisiones de integridad:
  - cascadas en plantilla (cuando se borra rutina/ejercicio)
  - `set null` en histórico (para no borrar el pasado)

## Capturas / demos recomendadas
- Captura del Network tab para:
  - `GET /api/rutinas`
  - `GET /api/rutinas/{id}`
  - `POST /api/rutinas` con payload anidado
  - `PUT /api/rutinas/{id}` mostrando que reemplaza el contenido
  - `POST /api/rutinas/{id}/duplicar`
  - `DELETE /api/rutinas/{id}`
- Ejemplo breve de respuesta JSON del detalle para enseñar anidación.

## Puntos fuertes defendibles
- Arquitectura modular del frontend (funcionalidades + viewmodel + repositorios + entidades tipadas).
- Comunicación REST real para rutinas (contratos claros y mapeo en frontend).
- Integridad de BD: claves foráneas + `onDelete` coherente con “plantilla vs histórico”.
- Implementación simple y robusta en update: reemplazo total del contenido.

## Limitaciones actuales (explicables sin quedar mal)
- No hay autenticación real integrada con backend en esta fase.
- Los endpoints REST de entrenos no están conectados todavía desde el frontend (el módulo entrenos sigue con persistencia mock del lado cliente).
- Despliegue (Docker/NGINX/CI-CD) no está materializado en artefactos del repo y se deja como evolución/plan.

