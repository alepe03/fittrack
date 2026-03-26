# Requisitos

## Requisitos funcionales (implementados)
- Flujo SPA con rutas de Vue Router y estado global con Pinia.
- Gestión de rutinas:
  - Listado (`GET /api/rutinas`) con `ejercicios_count`.
  - Detalle con ejercicios y series objetivo (`GET /api/rutinas/{id}`).
  - Crear rutina completa (rutina + ejercicios + series) (`POST /api/rutinas`).
  - Editar rutina completa con reemplazo total (`PUT /api/rutinas/{id}`).
  - Duplicar rutina (`POST /api/rutinas/{id}/duplicar`).
  - Borrar rutina (`DELETE /api/rutinas/{id}`) con cascada en BD.
- Formulario de rutina con ejercicios y series objetivo dinámicos.
- Registro de entreno y detalle de entrenos en frontend (por ahora con persistencia mock en el lado cliente; en esta fase no hay integración REST de entrenos).
- Persistencia de:
  - Preferencia de orden en `localStorage`.
  - “Entorno en curso” del formulario de entreno en `sessionStorage`.

## Requisitos funcionales (futuros / no incluidos en MVP)
- Autenticación real integrada con el backend (actualmente el frontend usa un token simulado).
- Catálogo global de ejercicios.
- Estadísticas básicas de progreso.
- Gestión de perfil.
- CRUD e integración REST completa para entrenos desde el frontend.
- Paneles/canales de administración (si aplica en el proyecto final).

## Requisitos técnicos
**Frontend**
- Vue 3 + TypeScript + SFC + Composition API.
- Vue Router (SPA).
- Pinia.
- localStorage y sessionStorage.

**Backend**
- Laravel (PHP) + PostgreSQL.
- API REST (controladores, validación y transacciones).

## Restricciones y decisiones actuales
- Temporalmente se usa `user_id = 1` en el frontend para crear/actualizar rutinas (mientras no exista auth real).
- Las pantallas de rutinas ya consumen la API real; el módulo de entrenos sigue en modo mock en frontend.
- Despliegue (Docker/Compose/NGINX/CI-CD): si no existen artefactos en el repo, se documenta como plan/fase futura (no como estado implementado).
