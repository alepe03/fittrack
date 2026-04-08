# Despliegue, Docker y CI/CD (FitTrack)

Este documento describe cómo se ejecuta el proyecto en contenedores, cómo fluyen las peticiones entre frontend y API, y qué partes están automatizadas con **GitHub Actions** y **GitHub Pages**. Está pensado para una defensa de proyecto DAW: lo que existe en el repo es lo que se cuenta; lo que no está automatizado se indica explícitamente.

## Arquitectura de despliegue local (Docker)

El stack para levantar la aplicación completa en local (o en una máquina con Docker) se define en `deploy/docker-compose.yml`. Cuatro servicios con responsabilidades separadas:

**Nota:** no se declaran `container_name` fijos en el compose base. Así cada `docker compose -p <proyecto>` puede coexistir sin choque de nombres en el host; el descubrimiento entre contenedores usa el **nombre del servicio** en la red del proyecto (p. ej. `fittrack-php`, `fittrack-nginx`).

**Puertos al host y fusión de Compose:** al combinar varios ficheros, Docker Compose **concatena** las listas `ports` de cada servicio. Por eso el `docker-compose.yml` base **no** define `ports` en Postgres, Nginx ni front: los mapeos por defecto (`5432`, `8080`, `8081`) viven en `deploy/docker-compose.host-ports.yml`. Así el override de **staging** solo añade `15432`, `18080` y `18081`, sin acumular también `8080`/`8081`/`5432`.

| Servicio (Compose) | Nombre DNS interno | Función |
|--------------------|--------------------|---------|
| **fittrack-postgres** | `fittrack-postgres` | Base de datos **PostgreSQL**; datos persistentes en el volumen `fittrack_pgdata`. |
| **fittrack-php** | `fittrack-php` | **Backend Laravel** con **PHP-FPM** (lógica de la API). |
| **fittrack-nginx** | `fittrack-nginx` | **Nginx** del backend: sirve `public/` de Laravel y envía PHP a FPM por **FastCGI**. |
| **fittrack-front** | `fittrack-front` | **Frontend Vue** construido y servido con **Nginx** (SPA + proxy de `/api/` hacia el backend). |

## Flujo de peticiones (navegador → API → datos)

1. **Navegador → frontend (puerto 8081 en el host, por defecto)**  
   El usuario abre la SPA; el mapeo apunta al Nginx dentro de `fittrack-front`.

2. **Frontend → ruta `/api/` → Nginx del backend**  
   El Nginx del contenedor frontend **no** sirve esas rutas como ficheros estáticos: las **proxifica** al servicio `fittrack-nginx` en la red Docker. El navegador sigue viendo un solo origen (mismo host/puerto del front), lo que evita en la práctica los problemas habituales de CORS en este despliegue.

3. **Nginx (backend) → PHP-FPM**  
   Laravel se ejecuta vía **FastCGI** hacia el host `fittrack-php` en el puerto **9000** (configuración en `deploy/docker/nginx/default.conf`).

4. **PHP (Laravel) → PostgreSQL**  
   La aplicación usa `DB_HOST=fittrack-postgres` (nombre del servicio en Compose) y el puerto interno **5432**.

### Diagrama del flujo (texto)

```
navegador → frontend (Nginx, :8081) → /api/ → nginx (backend) → php-fpm (Laravel) → PostgreSQL
```

## Docker Compose: comandos habituales

El fichero Compose está en la carpeta **`deploy/`**.

Desde la **raíz del repositorio**, con puertos típicos en el host (tras `./deploy/scripts/setup-env.sh`):

```bash
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.host-ports.yml build
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.host-ports.yml up -d
```

Desde **`deploy/`** (añadiendo `-f docker-compose.host-ports.yml` igual que arriba si necesitas publicar puertos).

Para ver logs: `docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.host-ports.yml logs -f` (o el equivalente según los `-f` que uses).

## Entornos diferenciados: staging y production

El repositorio define dos overrides reales sobre el compose base:

- `deploy/docker-compose.staging.yml`
- `deploy/docker-compose.prod.yml`

Ambos se aplican junto a `deploy/docker-compose.yml`.

Usa siempre un **nombre de proyecto** distinto por entorno (`-p fittrack-staging`, `-p fittrack-prod`, …) para aislar contenedores, redes y volúmenes; al no forzar `container_name`, no habrá colisiones entre proyectos.

### Ficheros `.env` del backend (sin pasos manuales obligatorios)

Docker Compose exige que existan los ficheros listados en `env_file`. Para no tener que copiar a mano las plantillas en el primer arranque, el repo incluye `deploy/scripts/setup-env.sh`, que:

- crea `backend/.env.staging` desde `backend/.env.staging.example` si no existe;
- crea `backend/.env.production` desde `backend/.env.production.example` si no existe;
- crea `backend/.env` desde `backend/.env.example` si no existe (útil para el stack base);
- genera **`APP_KEY`** (vía `openssl rand -base64`, prefijo `base64:`) en `backend/.env`, `backend/.env.staging` y `backend/.env.production` **solo cuando `APP_KEY` está vacía**, para que Laravel no lance `MissingAppKeyException`.

Si ya tienes esos ficheros (por ejemplo con valores propios), el script **no** los sobrescribe; si ya hay `APP_KEY` definida, no la cambia.

Ejecución desde la raíz del repo:

```bash
./deploy/scripts/setup-env.sh
```

(Si no tienes permisos de ejecución: `bash deploy/scripts/setup-env.sh`.)

### Comandos exactos por entorno

Levantar **staging** (recomendado encadenar el script):

```bash
./deploy/scripts/setup-env.sh && docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.staging.yml \
  -p fittrack-staging \
  up -d --build
```

Levantar **production**:

```bash
./deploy/scripts/setup-env.sh && docker compose \
  -f deploy/docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  -p fittrack-prod \
  up -d --build
```

### Diferencias defendibles entre entornos

| Aspecto | Staging | Production |
|---------|---------|------------|
| `APP_ENV` | `staging` | `production` |
| `APP_DEBUG` | `true` | `false` |
| Nginx API host | `18080` | `8080` |
| Frontend host | `18081` | `8081` |
| PostgreSQL host | `15432` expuesto | No expuesto al host (`ports: []`) |
| Restart policy | `unless-stopped` | `unless-stopped` |
| `.env` del backend | `backend/.env.staging` | `backend/.env.production` |

## Puertos por defecto en el host

| Qué | Puerto (defecto) | Variable en Compose (ejemplo) |
|-----|------------------|-------------------------------|
| Frontend (Vue) | **8081** | `FRONT_HTTP_PORT` |
| API (Nginx + Laravel) | **8080** | `HTTP_PORT` |
| PostgreSQL (opcional, herramientas externas) | **5432** | `POSTGRES_PORT` |

Dentro de la red Docker, los servicios se resuelven por **nombre** (`fittrack-postgres`, `fittrack-nginx`, etc.), no hace falta usar la IP del host.

## GitHub Actions: integración continua (CI)

En `.github/workflows/ci.yml` hay un workflow de **CI** que se ejecuta en **push** y **pull request** hacia las ramas **`main`** y **`develop`**, y también se puede lanzar a mano (`workflow_dispatch`).

Incluye tres jobs en paralelo:

| Job | Qué valida |
|-----|------------|
| **Frontend (Vue)** | En `front/`: `npm ci` y `npm run build` (typecheck con `vue-tsc` y build de Vite). |
| **Backend (Laravel)** | En `backend/`: PHP **8.4**, `composer install`, copia de `.env` desde `.env.example`, generación de `APP_KEY`, y `composer test` (tests con SQLite en memoria según `phpunit.xml`). |
| **Documentación (MkDocs)** | Instala dependencias desde `docs/requirements.txt`, ajusta `site_url` para la URL típica de GitHub Pages y ejecuta `mkdocs build --strict`. |

Este CI **no despliega** la aplicación Docker ni el frontend compilado a ningún servidor: solo **comprueba** que el repositorio construye y que los tests del backend pasan.

## GitHub Actions: build/push de imágenes Docker (sin deploy remoto)

En `.github/workflows/docker-images.yml` hay un workflow mínimo para construir y publicar imágenes en **GHCR**:

- **Cuándo se ejecuta:** `push` a `main` y ejecución manual (`workflow_dispatch`).
- **Qué publica:** dos imágenes:
  - backend desde `deploy/docker/backend/Dockerfile`
  - frontend desde `deploy/docker/front/Dockerfile`
- **Tags:** `latest` y `${{ github.sha }}`.

Este workflow **no** hace despliegue remoto automático; solo genera artefactos de despliegue (imágenes versionadas).

## GitHub Pages: publicación de la documentación

La documentación MkDocs se publica con el workflow `.github/workflows/docs-pages.yml`, que usa el flujo recomendado por GitHub (**Actions** como fuente de Pages: artefacto + `deploy-pages`).

- **Cuándo se ejecuta:** en **push** a la rama **`main`** si cambian rutas relevantes (`docs/**`, `mkdocs.yml`, `docs/requirements.txt` o el propio workflow), o de forma manual (`workflow_dispatch`).
- **Qué se publica:** el sitio estático generado por MkDocs (tema Material), no la SPA ni el backend.

La URL pública suele seguir el patrón de proyecto en GitHub Pages: `https://<usuario u organización>.github.io/<nombre-del-repo>/` (el workflow sustituye el marcador de `site_url` en CI para que enlaces y recursos cuadren con esa base).

## Qué está automatizado y qué no

| Automatizado | No automatizado (en este proyecto) |
|--------------|-----------------------------------|
| CI en cada push/PR a `main` o `develop`: build frontend, tests backend, build estricto de docs. | Despliegue remoto extremo a extremo del stack (arrancar/actualizar contenedores en un servidor). |
| Publicación automática de la **documentación MkDocs** en GitHub Pages al subir cambios a `main` (según el filtro de rutas). | Promoción automática entre entornos (staging -> producción). |
| Build y push de imágenes Docker a GHCR en `main` (`docker-images.yml`). | Orquestación remota automatizada con Kamal/Portainer/Podman. |

En resumen: **sí** hay CI reproducible, **sí** hay CD de la documentación y **sí** hay publicación automática de imágenes Docker; **no** hay despliegue remoto completo automatizado de la aplicación (ese paso sigue siendo manual en una máquina/servidor propio).

## Ventajas del enfoque Docker local

- **Entorno reproducible** entre desarrolladores y máquinas de práctica.
- **Menos dependencias en el anfitrión**: no es obligatorio instalar PHP, Composer, Node, PostgreSQL o Nginx en el sistema solo para ejecutar el stack completo.
- **Alineado con patrones de producción**: Nginx delante, PHP-FPM y base de datos separados facilitan razonar sobre un despliegue real más adelante.
