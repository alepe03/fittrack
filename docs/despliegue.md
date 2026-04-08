# Despliegue, Docker y CI/CD (FitTrack)

Estado real de despliegue del proyecto para defensa DAW (DPL), basado en lo implementado en el repositorio.

## Stack Docker Compose

El despliegue se define con Docker Compose y cuatro servicios:

- `fittrack-postgres`: PostgreSQL
- `fittrack-php`: Laravel sobre PHP-FPM
- `fittrack-nginx`: NGINX del backend (FastCGI a PHP-FPM)
- `fittrack-front`: frontend Vue servido por NGINX

### Flujo de peticiones

Frontend -> NGINX backend -> PHP-FPM -> PostgreSQL.

En detalle:

1. El navegador carga la SPA en `fittrack-front`.
2. Las rutas `/api/` se proxifican a `fittrack-nginx`.
3. NGINX backend envía PHP a `fittrack-php:9000`.
4. Laravel conecta con `fittrack-postgres:5432`.

## Por que no se usan `container_name`

No se fijan `container_name` en `deploy/docker-compose.yml` para permitir varios proyectos Compose en paralelo (`-p fittrack-staging`, `-p fittrack-prod`) sin conflictos de nombres globales de contenedor.

La red interna usa nombres de servicio (`fittrack-php`, `fittrack-nginx`, etc.), por lo que no se rompe la comunicacion interna.

## `docker-compose.host-ports.yml` y puertos duplicados

Docker Compose concatena listas `ports` al fusionar ficheros.  
Para evitar duplicaciones (por ejemplo `8080` + `18080` a la vez), el compose base no publica puertos; los mapeos de desarrollo local (`5432`, `8080`, `8081`) estan en `deploy/docker-compose.host-ports.yml`.

Asi:

- desarrollo local: usa `docker-compose.host-ports.yml`
- staging: usa `docker-compose.staging.yml` con `15432`, `18080`, `18081`
- production: usa `docker-compose.prod.yml` con `8080`, `8081` y DB sin puerto publico

## Script `setup-env.sh`

`deploy/scripts/setup-env.sh`:

- crea `backend/.env`, `backend/.env.staging` y `backend/.env.production` desde sus `.example` si faltan;
- genera `APP_KEY` si esta vacia en esos ficheros (sin sobrescribir claves existentes).

Esto evita errores de `env_file` y `MissingAppKeyException` en el arranque.

## Entornos diferenciados

### Staging

```bash
./deploy/scripts/setup-env.sh && docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.staging.yml \
  -p fittrack-staging \
  up -d --build
```

Puertos host: front `18081`, API `18080`, PostgreSQL `15432`.

### Production

```bash
./deploy/scripts/setup-env.sh && docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  -p fittrack-prod \
  up -d --build
```

Puertos host: front `8081`, API `8080`. PostgreSQL no se expone al host.

## Uso de Portainer (estado documentable)

El repo no contiene definiciones especificas de Portainer (plantillas, manifests o API), pero los stacks creados con `docker compose` son compatibles con gestion visual desde Portainer.

Defensa honesta:

- los contenedores se crean con Docker Compose;
- la gestion visual (estado, restart, logs) puede hacerse desde Portainer sobre esos stacks;
- no hay automatizacion de despliegue remota propia de Portainer versionada en este repositorio.

## CI/CD

- CI de aplicacion en `.github/workflows/ci.yml`: build frontend, tests backend y build estricto de docs.
- Publicacion de documentacion en GitHub Pages con `.github/workflows/docs-pages.yml`.
- Build/push de imagenes Docker a GHCR con `.github/workflows/docker-images.yml`.
- No hay CD automatico completo de la aplicacion a servidor remoto; el despliegue del stack es manual con Docker Compose (criterio coherente con entorno academico).
