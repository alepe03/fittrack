# FitTrack

Documentación oficial del proyecto FitTrack.

FitTrack es una aplicación web orientada al seguimiento de rutinas de gimnasio, entrenamientos y progreso físico del usuario.

## Objetivo general
Demostrar un producto funcional y defendible con una arquitectura moderna:
- Frontend SPA con Vue 3 + TypeScript (SFC + Composition API, Vue Router, Pinia).
- Backend REST con Laravel + PostgreSQL.
- Integración real (ya validada) del módulo **rutinas** entre frontend-backend-bd.

## Stack principal
- Frontend: Vue 3 + TypeScript + SFC + Composition API + Vue Router + Pinia.
- Backend: Laravel (API REST) + PostgreSQL.
- Documentación: MkDocs.

## Estructura del repositorio (monorepo)
En este repositorio encontrarás:
- `front/`: SPA Vue (módulos por funcionalidades).
- `backend/`: API Laravel.
- `docs/`: documentación del proyecto (MkDocs).
- `deploy/`: configuración/guías previstas (puede estar incompleta según la fase).

## Índice de la documentación
- `arquitectura.md`: arquitectura real y estado de integración actual.
- `requisitos.md`: requisitos funcionales y técnicos (implementado vs futuro).
- `decisiones.md`: decisiones técnicas defendibles.
- `mvp.md`: MVP global real (alcance defendible).
- `frontend-mvp.md`: MVP detallado del frontend y pantallas/flujo.
- `dew-frontend.md`: criterios DEW del frontend (documento específico).
- `auditoria-dew-fit-track.md`: auditoría DEW/DOR (coherente con el estado actual).
- `backend-api.md`: backend (tablas, relaciones y endpoints de rutinas).
- `backend-bd.md`: base de datos (modelo, cascadas y diseño de histórico).
- `presentacion-guion.md`: guía breve para presentación/defensa.
- `estado-actual.md`: hoja de estado honesta (implementado / parcial / futuro).
