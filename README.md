# FitTrack

FitTrack es una aplicación web para el seguimiento de rutinas de gimnasio, entrenamientos y progreso físico.

## Tecnologías principales

### Frontend
- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Composition API

### Backend
- PHP
- Laravel
- API REST

### Despliegue
- Docker
- Docker Compose
- NGINX

### Documentación
- MkDocs
- GitHub Pages

## Primer arranque rápido (Docker)

Desde la **raíz del repositorio**, `./deploy/scripts/setup-env.sh`:

- crea `backend/.env`, `backend/.env.staging` y `backend/.env.production` desde los `.example` si faltan (no sobrescribe si ya existen);
- rellena **`APP_KEY`** con `openssl` (formato `base64:…`) en esos tres ficheros **solo si `APP_KEY` está vacía**, para evitar `MissingAppKeyException` en Laravel.

**Desarrollo local** (API `8080`, front `8081`, Postgres `5432` en el host). El compose base no publica puertos; se añaden con `deploy/docker-compose.host-ports.yml` para no duplicar mapeos al usar staging/prod:

```bash
./deploy/scripts/setup-env.sh && docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.host-ports.yml \
  up -d --build
```

**Staging** (solo `18080` / `18081` / `15432` en el host, sin 8080/8081/5432 duplicados):

```bash
./deploy/scripts/setup-env.sh && docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.staging.yml \
  -p fittrack-staging \
  up -d --build
```

**Production** (API en `8080`, front en `8081`, Postgres sin puerto público en el host):

```bash
./deploy/scripts/setup-env.sh && docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  -p fittrack-prod \
  up -d --build
```

## Entornos de despliegue (Docker Compose)

En `deploy/docker-compose.yml` **no** se usan `container_name` fijos: así cada proyecto Compose (`-p fittrack-staging`, `-p fittrack-prod`, etc.) genera nombres de contenedor únicos y puedes tener staging y production levantados a la vez sin conflictos. La comunicación entre servicios sigue usando los **nombres de servicio** (`fittrack-php`, `fittrack-nginx`, …), que es lo que resuelve la red interna de Docker.

El stack base está en `deploy/docker-compose.yml`. Los puertos al host para desarrollo local van en `deploy/docker-compose.host-ports.yml`. Los entornos usan overrides:
- `deploy/docker-compose.staging.yml`
- `deploy/docker-compose.prod.yml`

Antes de `docker compose`, ejecuta `./deploy/scripts/setup-env.sh` (o `bash deploy/scripts/setup-env.sh`).

### Levantar desarrollo local (puertos por defecto)

```bash
./deploy/scripts/setup-env.sh
docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.host-ports.yml \
  up -d --build
```

### Levantar staging

```bash
./deploy/scripts/setup-env.sh
docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.staging.yml \
  -p fittrack-staging \
  up -d --build
```

### Levantar production

```bash
./deploy/scripts/setup-env.sh
docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  -p fittrack-prod \
  up -d --build
```

## CI/CD actual (honesto)

- **CI de aplicación:** `.github/workflows/ci.yml` (build frontend, tests backend y validación de docs).
- **CD de documentación:** `.github/workflows/docs-pages.yml` publica MkDocs en GitHub Pages.
- **Build/push de imágenes Docker:** `.github/workflows/docker-images.yml` publica imágenes de backend/frontend en GHCR.
- **No automatizado:** despliegue remoto extremo a extremo del stack completo de la app.

## Documentación

La documentación del proyecto se gestiona con MkDocs.

Para servirla en local:

```bash
mkdocs serve
```

Para generar el sitio estático:

```bash
mkdocs build
```

## Estructura del proyecto

```text
fittrack/
  front/
  backend/
  docs/
  deploy/
```