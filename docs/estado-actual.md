# Estado actual (implementado / parcial / futuro)

Este documento sirve como “hoja de ruta honesta” para la entrega y defensa: resume qué está hecho de verdad, qué está parcialmente cubierto y qué queda para fases futuras.

## Frontend (Vue 3 + TypeScript + SPA)

### Implementado y validado en esta fase
- Pantallas y flujo de **rutinas**:
  - listado (`/rutinas`) con `ejercicios_count`
  - detalle (`/rutinas/:id`) con ejercicios y series objetivo anidadas
  - crear/editar rutina (`/rutinas/nueva`, `/rutinas/:id/editar`)
  - duplicar rutina
  - borrar rutina (con modal de confirmación)
- Persistencias:
  - preferencia de orden en `localStorage`
  - “entreno en curso” en `sessionStorage` para el formulario de registro de entreno
- Arquitectura:
  - Pinia stores (viewmodels)
  - composables de utilidades (filtros/orden, persistencia temporal)

### Parcial / temporal
- Autenticación: token “simulado” desde el frontend (no autenticación real contra backend protegida).
- Entrenos: el frontend mantiene el flujo con persistencia mock; en esta fase no está integrado vía endpoints REST reales de entrenos.

### Futuro
- Integración REST completa de entrenos desde frontend.
- Autenticación real integrada con backend (protección de endpoints).
- Catálogo global de ejercicios y estadísticas de progreso.

## Backend (Laravel + PostgreSQL)

### Implementado y validado (rutinas)
- Migraciones, modelos Eloquent y relaciones para:
  - `rutinas`
  - `rutina_ejercicios`
  - `rutina_series`
  - (tablas también existen para entrenos en el esquema)
- API REST de rutinas implementada:
  - `GET/POST/PUT/DELETE /api/rutinas`
  - `POST /api/rutinas/{id}/duplicar`
- Validación del payload y operaciones en transacciones.

### Parcial / sin integración REST todavía
- Aunque el esquema BD incluye tablas de entrenos y relaciones, en esta fase no están conectados a endpoints REST consumidos por el frontend.

### Futuro
- Endpoints REST de entrenos (crear/listar/detalle según el frontend).
- Autenticación real y protección de rutas API.

## Base de datos (PostgreSQL)
- Migraciones para rutinas: implementadas (y utilizadas por la API real).
- Tablas de entrenos: existentes en el esquema, pero aún sin flujo REST consumido por frontend en esta fase.
- Integridad referencial:
  - cascada en “plantilla”
  - `set null` en IDs del histórico cuando se pierde un elemento de la plantilla.

## Despliegue (Docker + Nginx)
- **Stack en `deploy/`:** `docker-compose.yml` con PostgreSQL, PHP-FPM (Laravel), Nginx del API y Nginx del frontend (Vue).
- **Puertos habituales en el host:** frontend **8081**, API **8080** (configurables con variables de entorno del Compose).
- **Flujo de peticiones:** el navegador usa el frontend; las rutas `/api/` se proxifican al Nginx del backend, que habla con PHP-FPM y este con PostgreSQL (detalle en `docs/despliegue.md`).
- **CI (GitHub Actions):** en `.github/workflows/ci.yml` se validan frontend (Vue), backend (Laravel/tests) y build de MkDocs en cada push/PR a `main` o `develop`.
- **Documentación en GitHub Pages:** workflow `.github/workflows/docs-pages.yml` publica el sitio generado por MkDocs (sin despliegue automático de la app Docker a un servidor; eso sigue siendo manual o fase futura).

## Criterios no cubiertos completamente (honestidad del alcance)
- **DSW / DPL:** **Docker Compose + Nginx** documentado; **CI** con Actions para código y docs; **Pages** para la documentación MkDocs. No hay despliegue automático del stack de aplicación (Vue/Laravel) a un entorno de producción remoto.
- **SSG (gestión de usuarios/clientes y paneles):** actualmente existe autenticación simulada en frontend y no hay gestión real de usuarios en backend protegida por auth.
- **SOJ e IPW (impacto/ODS y aspectos de mercado/sostenibilidad/marketing):** no están desarrollados ni documentados en el repo; se deja estructura para completar en una fase posterior si aplica en la entrega.

