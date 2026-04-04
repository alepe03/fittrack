# Guion para presentación / defensa (FitTrack)

## Orden recomendado para exponer
1. **Qué es FitTrack y objetivo del proyecto** (1-2 min)
2. **Arquitectura real del monorepo** (frontend SPA + backend Laravel + PostgreSQL)
3. **MVP global real** (qué está validado y qué queda fuera)
4. **Frontend - DEW/DSW** (qué pantallas enseñar y por qué)
5. **Backend - API de rutinas** (endpoints, validación, transacciones y contratos JSON)
6. **Base de datos** (tablas, relaciones y reglas de borrado)
7. **Despliegue y automatización** (Docker Compose, flujo `/api/`, GitHub Actions CI, GitHub Pages solo para docs; aclarar qué **no** está en CD remoto de la app)
8. **Limitaciones actuales** (autenticación real y entrenos por API todavía pendientes)

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

## Qué enseñar de despliegue y CI/CD (breve)
- **Docker:** `deploy/docker-compose.yml`, los cuatro servicios y el diagrama navegador → front (:8081) → `/api/` → Nginx → PHP-FPM → Postgres.
- **CI:** pestaña Actions del repo — workflow que compila Vue, ejecuta tests Laravel y valida MkDocs en `main`/`develop`.
- **Pages:** URL de la documentación publicada; dejar claro que lo automático es **solo la doc**, no el despliegue del stack de aplicación a un servidor remoto.

## Puntos fuertes defendibles
- Arquitectura modular del frontend (funcionalidades + viewmodel + repositorios + entidades tipadas).
- Comunicación REST real para rutinas (contratos claros y mapeo en frontend).
- Integridad de BD: claves foráneas + `onDelete` coherente con “plantilla vs histórico”.
- Implementación simple y robusta en update: reemplazo total del contenido.
- Entorno Docker reproducible y CI en GitHub Actions; documentación versionada y publicada en Pages.

## Limitaciones actuales (explicables sin quedar mal)
- No hay autenticación real integrada con backend en esta fase.
- Los endpoints REST de entrenos no están conectados todavía desde el frontend (el módulo entrenos sigue con persistencia mock del lado cliente).
- No hay **despliegue continuo** del stack completo de la app (Vue + Laravel + Postgres) a un entorno remoto: Docker Compose es principalmente para ejecución local/controlada; la automatización de publicación aplica a la **documentación MkDocs** en GitHub Pages.

