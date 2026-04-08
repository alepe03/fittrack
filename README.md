# FitTrack

FitTrack es una aplicación web para el seguimiento de rutinas de gimnasio, entrenamientos y progreso físico, con frontend SPA y backend API desplegables en contenedores.

## Tecnologías utilizadas

- Frontend: Vue 3, TypeScript, Vite, Vue Router, Pinia
- Backend: Laravel (PHP)
- Base de datos: PostgreSQL
- Despliegue: Docker, Docker Compose, NGINX, PHP-FPM
- Documentación: MkDocs + GitHub Pages

## Arquitectura general

El proyecto se ejecuta con cuatro servicios Docker:

- `fittrack-front`: frontend Vue servido por NGINX
- `fittrack-nginx`: NGINX de backend (entrada a Laravel)
- `fittrack-php`: PHP-FPM con Laravel
- `fittrack-postgres`: base de datos PostgreSQL

Flujo: frontend -> nginx backend -> php-fpm -> postgres.

## Instrucciones de arranque

### Desarrollo

Frontend:

```bash
cd front
npm install
npm run dev
```

Backend:

```bash
cd backend
composer install
php artisan serve
```

### Staging (Docker)

```bash
./deploy/scripts/setup-env.sh && docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.staging.yml \
  -p fittrack-staging \
  up -d --build
```

### Produccion (Docker)

```bash
./deploy/scripts/setup-env.sh && docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  -p fittrack-prod \
  up -d --build
```

## Puertos

- Staging: frontend `18081`, API `18080`, PostgreSQL `15432`
- Production: frontend `8081`, API `8080` (PostgreSQL sin puerto publicado al host)

## Entornos: staging vs production

- **Staging**: entorno de validacion con puertos diferenciados y `APP_ENV=staging`.
- **Production**: entorno orientado a ejecucion estable, `APP_ENV=production`, `APP_DEBUG=false` y sin exponer PostgreSQL al host.

`deploy/scripts/setup-env.sh` prepara `.env` faltantes y genera `APP_KEY` si esta vacia, evitando errores de arranque en Laravel.

## CI/CD (estado real)

- CI de aplicacion: `.github/workflows/ci.yml` (build frontend, tests backend, validacion docs).
- CD de documentacion: `.github/workflows/docs-pages.yml` (GitHub Pages).
- Build/push de imagenes Docker: `.github/workflows/docker-images.yml` (GHCR).
- No hay despliegue remoto automatico completo del stack de aplicacion.