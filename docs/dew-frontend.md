# Criterios DEW - Frontend FitTrack

## 1. Alcance y objetivo

Este documento describe el cumplimiento real de criterios **DEW** en el frontend actual del repositorio (`front/`), con trazabilidad a archivos existentes.

## 2. Checklist DEW con trazabilidad

| Criterio | Estado | Evidencia principal |
|----------|--------|---------------------|
| Vue + TypeScript + SFC + Composition API | CUMPLE | `front/package.json`, `front/src/**/*.vue` |
| SPA (página no continua) | CUMPLE | `front/index.html`, `front/src/App.vue`, `front/src/router/index.ts` |
| Router | CUMPLE | `front/src/router/index.ts` |
| Reactividad (`ref`, `reactive`, `computed`) | CUMPLE | `login_screen.vue`, `rutinas_screen.vue`, `*_viewmodel.ts` |
| localStorage | CUMPLE | `storage.ts`, `useLocalStorage.ts`, `rutinas_screen.vue` |
| sessionStorage | CUMPLE | `useEntrenamientoEnCurso.ts`, `entreno_form_desde_rutina_screen.vue` |
| props / emits | CUMPLE | `TarjetaRutina.vue`, `BotonPrimario.vue`, `BaseModal.vue` |
| Pinia | CUMPLE | `front/src/main.ts`, `autenticacion_viewmodel.ts`, `rutinas_viewmodel.ts`, `entrenamientos_viewmodel.ts` |
| slots | CUMPLE | `BaseCard.vue`, `BaseModal.vue`, `AppLayout.vue` |
| composables | CUMPLE | `useLocalStorage.ts`, `useFiltrosRutinas.ts`, `useEntrenamientoEnCurso.ts` |

## 3. Evidencias por criterio

### Vue + TS + SFC + Composition API
- Dependencias: `vue`, `typescript`, `@vitejs/plugin-vue` en `front/package.json`.
- SFC tipados: componentes y pantallas en `front/src/**/*.vue` usan `<script setup lang="ts">`.

### SPA + Router
- Entrada única: `front/index.html` con `#app`.
- Montaje: `front/src/main.ts`.
- Navegación y guard: `front/src/router/index.ts` (`beforeEach`, rutas de login, rutinas y entrenos).

### Reactividad
- `reactive`: `front/src/funcionalidades/autenticacion/view/pantallas/login_screen.vue`.
- `ref` y `computed`: pantallas y stores, por ejemplo `front/src/funcionalidades/rutinas/viewmodel/rutinas_viewmodel.ts`.

### localStorage / sessionStorage
- Token y sesión: `front/src/nucleo/almacenamiento/storage.ts`.
- Preferencias: `front/src/compartido/composables/useLocalStorage.ts`.
- Entreno en curso: `front/src/compartido/composables/useEntrenamientoEnCurso.ts`.

### props / emits
- `front/src/compartido/ui/TarjetaRutina.vue` (`rutina`, `ver`).
- `front/src/compartido/ui/BotonPrimario.vue` (`type`, `disabled`, `click`).
- `front/src/compartido/ui/BaseModal.vue` (`visible`, `cerrar`).

### Pinia
- Registro de Pinia: `front/src/main.ts`.
- Stores por módulo:
  - `front/src/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel.ts`
  - `front/src/funcionalidades/rutinas/viewmodel/rutinas_viewmodel.ts`
  - `front/src/funcionalidades/entrenamientos/viewmodel/entrenamientos_viewmodel.ts`

### slots
- `front/src/compartido/ui/BaseCard.vue`: `titulo`, `default`, `acciones`.
- `front/src/compartido/ui/BaseModal.vue`: `titulo`, `default`, `pie`.
- `front/src/compartido/ui/AppLayout.vue`: slot principal de contenido.

### composables
- `front/src/compartido/composables/useLocalStorage.ts`
- `front/src/compartido/composables/useFiltrosRutinas.ts`
- `front/src/compartido/composables/useEntrenamientoEnCurso.ts`

## 4. Notas para defensa DEW

- La estructura real del frontend en este repositorio es `front/` (no `frontend/`).
- El componente de tarjeta de rutina implementado es `TarjetaRutina.vue`.
- El flujo principal defendible: **Vista -> Store Pinia (ViewModel) -> Repositorio -> API real (rutinas) / API mock (entrenos)**.
