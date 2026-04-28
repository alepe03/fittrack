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
- No hay pasarela de pago real; la suscripcion se gestiona con simulacion segura.
- No se usa Stripe en esta fase.

### Futuro
- Pasarela de pago real y gestion de cobro.
- Exportacion opcional de comprobante en PDF.
- Catálogo global de ejercicios y estadísticas de progreso.

## Backend (Laravel + PostgreSQL)

### Implementado y validado
- Migraciones, modelos Eloquent y relaciones para:
  - `rutinas`
  - `rutina_ejercicios`
  - `rutina_series`
  - (tablas también existen para entrenos en el esquema)
- API REST de rutinas implementada:
  - `GET/POST/PUT/DELETE /api/rutinas`
  - `POST /api/rutinas/{id}/duplicar`
- API REST de entrenos implementada y consumida por frontend:
  - `GET/POST/PUT/DELETE /api/entrenos`
  - `GET /api/entrenos/{id}`
- API de autenticacion con Sanctum:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- API de suscripcion SSG:
  - `POST /api/subscription/upgrade-simulated` (ruta protegida con `auth:sanctum`)
  - `POST /api/subscription/cancel` (ruta protegida con `auth:sanctum`)
- Validacion de payload y operaciones en transacciones donde corresponde.

### Parcial / temporal
- No existe persistencia de facturas en base de datos (el comprobante de suscripcion se devuelve en la respuesta del upgrade y se muestra en frontend).
- El sistema de pago es simulado (sin cobro real).
- Si el usuario ya esta en Free, la cancelacion devuelve error `409` para evitar cambios inconsistentes.

### Futuro
- Integracion con pasarela de pago real.
- Historial de comprobantes/facturas persistidos y opcion PDF.

## Base de datos (PostgreSQL)
- Migraciones para rutinas: implementadas (y utilizadas por la API real).
- Tablas de entrenos: existentes en el esquema, pero aún sin flujo REST consumido por frontend en esta fase.
- Integridad referencial:
  - cascada en “plantilla”
  - `set null` en IDs del histórico cuando se pierde un elemento de la plantilla.

## Despliegue (Docker + CI + Pages)
- **Stack en `deploy/`:** `docker-compose.yml` con PostgreSQL, PHP-FPM (Laravel), Nginx del API y Nginx del frontend (Vue). Detalle de servicios, puertos y flujo en `docs/despliegue.md`.
- **Puertos habituales en el host:** frontend **8081**, API **8080** (variables `FRONT_HTTP_PORT` y `HTTP_PORT` en Compose).
- **Flujo de peticiones:** navegador → frontend → `/api/` → Nginx backend → PHP-FPM → PostgreSQL.
- **CI (GitHub Actions):** `.github/workflows/ci.yml` en push/PR a **`main`** y **`develop`**: build del frontend (`npm run build`), tests del backend (PHP **8.4**, `composer test` con SQLite en memoria) y `mkdocs build --strict`. No publica la aplicación en ningún servidor.
- **GitHub Pages:** `.github/workflows/docs-pages.yml` publica solo la **documentación MkDocs**; se dispara en push a **`main`** cuando cambian `docs/`, `mkdocs.yml`, `docs/requirements.txt` o ese workflow (y admite ejecución manual). No sustituye al despliegue Docker de la app.

## Criterios no cubiertos completamente (honestidad del alcance)
- **DSW / DPL:** Docker Compose + Nginx operativos en el repo; CI en Actions; documentación en Pages. **No** hay despliegue automático del stack de aplicación (imágenes/contenedores Vue+Laravel) a un servidor remoto de producción.
- **SSG (gestion empresarial):** el ciclo minimo de suscripcion esta implementado (alta con comprobante y cancelacion), protegido con Sanctum, pero sin cobro real ni facturacion fiscal completa.
- **SOJ e IPW (impacto/ODS y aspectos de mercado/sostenibilidad/marketing):** no están desarrollados ni documentados en el repo; se deja estructura para completar en una fase posterior si aplica en la entrega.

## Despliegue final

- **Staging operativo:** frontend en `18081`, API en `18080`, PostgreSQL en `15432` usando `deploy/docker-compose.staging.yml`.
- **Production operativo:** frontend en `8081`, API en `8080`, PostgreSQL sin puerto expuesto al host usando `deploy/docker-compose.prod.yml`.
- **Arranque y gestion de contenedores:** realizado con Docker Compose (`docker compose -f ...`).
- **Portainer:** los stacks creados por Compose son gestionables visualmente desde Portainer; el repositorio no incluye configuracion automatizada especifica de Portainer.
- **CI:** GitHub Actions valida frontend, backend y documentacion.
- **Publicacion de documentacion:** GitHub Pages con workflow dedicado.

