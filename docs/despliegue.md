# Despliegue con Docker (FitTrack)

Este documento describe la arquitectura de contenedores del proyecto FitTrack, cómo se comunican los servicios y los pasos básicos para levantar el entorno. Sirve como justificación técnica en un proyecto de DAW: separación de responsabilidades, puertos explícitos y flujo de peticiones trazable.

## Arquitectura actual

El stack se define en `deploy/docker-compose.yml` y agrupa cuatro servicios con nombres estables en la red interna de Docker:

| Servicio (Compose)   | Contenedor / rol        | Función |
|----------------------|-------------------------|---------|
| **fittrack-postgres** | `fittrack-postgres`     | Base de datos **PostgreSQL** (persistencia en volumen `fittrack_pgdata`). |
| **fittrack-php**      | `fittrack-php-fpm`      | **Backend Laravel** ejecutado con **PHP-FPM** (procesa la lógica de la API). |
| **fittrack-nginx**    | `fittrack-nginx`        | **Nginx** del backend: sirve el `public` de Laravel y delega PHP a FPM vía FastCGI. |
| **fittrack-front**    | `fittrack-front`        | **Frontend Vue** empaquetado y servido con **Nginx** (SPA + proxy hacia la API). |

En conjunto, cada capa tiene una única responsabilidad clara: datos (PostgreSQL), aplicación PHP (FPM), entrada HTTP del API (Nginx backend) y aplicación web (Nginx frontend).

## Cómo se comunican los servicios

1. **Navegador → frontend (puerto 8081)**  
   El usuario abre la aplicación Vue en el host. Ese puerto está mapeado al Nginx del contenedor `fittrack-front`.

2. **Frontend → `/api` → Nginx del backend**  
   Las peticiones a rutas bajo `/api/` no se resuelven en el build estático: el Nginx del frontend las **proxifica** al servicio `fittrack-nginx` (red interna Docker). Así el navegador sigue viendo el mismo origen para la app y la API bajo `/api`, evitando problemas típicos de CORS en desarrollo y despliegue unificado.

3. **Nginx backend → PHP-FPM (FastCGI)**  
   El Nginx del backend recibe la petición, enruta según la configuración de Laravel (`try_files` → `index.php`) y las peticiones PHP se envían a **FastCGI** al host `fittrack-php` en el puerto **9000** (estándar de PHP-FPM en contenedor).

4. **PHP → PostgreSQL**  
   Laravel usa la variable de entorno `DB_HOST=fittrack-postgres` (nombre del servicio en Compose) para conectar al motor **PostgreSQL** en el puerto interno **5432**.

### Diagrama del flujo (texto)

```
navegador → frontend (Nginx, :8081) → /api → nginx (backend) → php-fpm (Laravel) → postgres
```

En la práctica: una petición a la API desde el navegador entra por el frontend, el proxy reenvía al Nginx del API, este ejecuta Laravel vía FPM y Laravel consulta o actualiza PostgreSQL.

## Comandos de despliegue

El fichero Compose está en la carpeta **`deploy`**. Desde la raíz del repositorio:

```bash
docker compose -f deploy/docker-compose.yml build
docker compose -f deploy/docker-compose.yml up -d
```

Si ya te encuentras dentro de `deploy/`:

```bash
docker compose build
docker compose up -d
```

Tras el arranque, los contenedores quedan en segundo plano (`-d`). Para ver logs: `docker compose -f deploy/docker-compose.yml logs -f` (o el equivalente desde `deploy/`).

## Puertos en el host

| Servicio   | Puerto por defecto | Descripción |
|------------|--------------------|-------------|
| Frontend   | **8081**           | Aplicación Vue (mapeo `FRONT_HTTP_PORT`, por defecto 8081). |
| Backend API | **8080**        | Nginx que expone Laravel (mapeo `HTTP_PORT`, por defecto 8080). |

PostgreSQL puede exponerse en el host (por defecto **5432**, configurable con `POSTGRES_PORT`) para herramientas externas; la aplicación dentro de Docker usa siempre el nombre de servicio `fittrack-postgres`.

## Ventajas de este enfoque

- **Entorno reproducible**: cualquier máquina con Docker obtiene las mismas versiones de servicios y la misma topología de red.
- **Sin dependencias locales obligatorias**: no hace falta instalar PHP, Composer, Node, PostgreSQL ni Nginx en el sistema anfitrión para ejecutar el proyecto completo.
- **Preparado para producción**: la separación Nginx + PHP-FPM + base de datos es un patrón habitual en despliegues reales; el mismo tipo de capas se puede trasladar a un servidor o orquestador con ajustes de variables y secretos.

## Nota sobre CI/CD

Este despliegue **no incluye pipeline de CI/CD** (build automático en push, tests en cada merge, despliegue continuo a un servidor, etc.). Sí deja la **base preparada**: imágenes construibles, servicios nombrados y documentación del flujo, de modo que integrar GitHub Actions, GitLab CI u otro sistema sea un paso posterior acotado.
