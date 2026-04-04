# Despliegue, Docker y CI/CD (FitTrack)

Este documento describe cómo se ejecuta el proyecto en contenedores, cómo fluyen las peticiones entre frontend y API, y qué partes están automatizadas con **GitHub Actions** y **GitHub Pages**. Está pensado para una defensa de proyecto DAW: lo que existe en el repo es lo que se cuenta; lo que no está automatizado se indica explícitamente.

## Arquitectura de despliegue local (Docker)

El stack para levantar la aplicación completa en local (o en una máquina con Docker) se define en `deploy/docker-compose.yml`. Cuatro servicios con responsabilidades separadas:

| Servicio (Compose) | Contenedor (nombre) | Función |
|--------------------|---------------------|---------|
| **fittrack-postgres** | `fittrack-postgres` | Base de datos **PostgreSQL**; datos persistentes en el volumen `fittrack_pgdata`. |
| **fittrack-php** | `fittrack-php-fpm` | **Backend Laravel** con **PHP-FPM** (lógica de la API). |
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

Desde la **raíz del repositorio**:

```bash
docker compose -f deploy/docker-compose.yml build
docker compose -f deploy/docker-compose.yml up -d
```

Desde **`deploy/`**:

```bash
docker compose build
docker compose up -d
```

Para ver logs: `docker compose -f deploy/docker-compose.yml logs -f` (o el equivalente si el contexto es `deploy/`).

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

## GitHub Pages: publicación de la documentación

La documentación MkDocs se publica con el workflow `.github/workflows/docs-pages.yml`, que usa el flujo recomendado por GitHub (**Actions** como fuente de Pages: artefacto + `deploy-pages`).

- **Cuándo se ejecuta:** en **push** a la rama **`main`** si cambian rutas relevantes (`docs/**`, `mkdocs.yml`, `docs/requirements.txt` o el propio workflow), o de forma manual (`workflow_dispatch`).
- **Qué se publica:** el sitio estático generado por MkDocs (tema Material), no la SPA ni el backend.

La URL pública suele seguir el patrón de proyecto en GitHub Pages: `https://<usuario u organización>.github.io/<nombre-del-repo>/` (el workflow sustituye el marcador de `site_url` en CI para que enlaces y recursos cuadren con esa base).

## Qué está automatizado y qué no

| Automatizado | No automatizado (en este proyecto) |
|--------------|-----------------------------------|
| CI en cada push/PR a `main` o `develop`: build frontend, tests backend, build estricto de docs. | Despliegue automático del **stack Docker** (Vue + Laravel + Postgres) a un VPS, PaaS o registro de imágenes. |
| Publicación automática de la **documentación MkDocs** en GitHub Pages al subir cambios a `main` (según el filtro de rutas). | Pipeline que construya imágenes Docker y las publique, o que ejecute `docker compose` en remoto. |

En resumen: **sí** hay CI reproducible y **sí** hay despliegue continuo de la **documentación**; **no** hay CD de la aplicación completa a un entorno de producción remoto: eso queda como paso manual (por ejemplo `docker compose` en una máquina propia) o como evolución futura del proyecto.

## Ventajas del enfoque Docker local

- **Entorno reproducible** entre desarrolladores y máquinas de práctica.
- **Menos dependencias en el anfitrión**: no es obligatorio instalar PHP, Composer, Node, PostgreSQL o Nginx en el sistema solo para ejecutar el stack completo.
- **Alineado con patrones de producción**: Nginx delante, PHP-FPM y base de datos separados facilitan razonar sobre un despliegue real más adelante.
