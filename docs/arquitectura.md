# Arquitectura

FitTrack se compone de dos capas principales:

**Frontend:**  
Una aplicación de una sola página (SPA) desarrollada con Vue 3 y TypeScript.

**Backend:**  
Una API REST desarrollada con Laravel (PHP).

## Estructura del proyecto

FitTrack/
  front/
  backend/
  docs/
  deploy/

### Frontend

El frontend sigue una estructura modular organizada por funcionalidades.

Tecnologías principales:
- Vue 3
- Composition API
- TypeScript
- Pinia
- Vue Router

Ruta real del frontend en este repositorio: `front/`.

Arquitectura aplicada en el código:
- `front/src/funcionalidades/*` para módulos (`autenticacion`, `rutinas`, `entrenamientos`)
- `view/pantallas` para vistas
- `viewmodel` para stores Pinia (enfoque MVVM)
- `data` para repositorios y acceso a datos (mock o API real, según el módulo)
- `model` para entidades tipadas
- `compartido/ui` para componentes reutilizables
- `compartido/composables` para lógica reutilizable

Estado actual (implementado):
- SPA con rutas y guard en `front/src/router/index.ts`
- Estado con Pinia en `front/src/funcionalidades/*/viewmodel/*`
- Persistencia local con `localStorage` y `sessionStorage`

Estado de integración por módulo (actual):
- **Rutinas:** integrado contra la API REST real de Laravel (`/api/rutinas` y endpoints asociados). El listado usa `ejercicios_count` y el detalle incluye `ejercicios` y `series`.
- **Entrenamientos:** todavía consumen datos mock en frontend (persistencia en `localStorage`). En backend existen tablas/modelos para entrenos, pero no se está usando su API REST desde estas pantallas en esta fase.
- **Autenticación:** gestionada de forma temporal en el frontend (token simulado en `localStorage`); no hay autenticación real integrada para proteger la API en este MVP.

### Backend

El backend expone una API REST mediante Laravel.

Gestiona (MVP y estado actual):
- API REST para **rutinas** en Laravel, con persistencia en PostgreSQL.
- Modelo de datos (Eloquent + migraciones) para rutinas y su estructura anidada (plantilla vs histórico).
- Tablas/migraciones para entrenos ya existen, pero el consumo REST desde frontend queda fuera del alcance actual.
