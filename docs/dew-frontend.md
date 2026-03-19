# Criterios DEW – Frontend FitTrack

## 1. Introducción

Este documento describe cómo el frontend del proyecto FitTrack cumple los criterios de evaluación de la asignatura (DEW). El frontend está desarrollado con **Vue 3**, **TypeScript**, **Composition API** y **SFC**, siguiendo una estructura por funcionalidades y un enfoque tipo **MVVM**. No se ha rehecho la aplicación desde cero; se han aplicado mejoras incrementales para dejar explícito el cumplimiento de cada criterio.

---

## 2. Criterios DEW evaluados

| Criterio | Cumplimiento |
|----------|--------------|
| Vue + TypeScript + SFC + Composition API | Sí |
| Página no continua (SPA) | Sí |
| Uso de Router | Sí |
| Uso de reactividad: ref, reactive, computed | Sí |
| Uso de localStorage | Sí |
| Uso de sessionStorage | Sí |
| Uso de props / emits | Sí |
| Uso de Pinia | Sí |
| Uso de slots | Sí |
| Uso de composables | Sí |

---

## 3. Dónde se cumple cada criterio

### Vue 3 + TypeScript + SFC + Composition API

- **Ubicación:** Todo el frontend en `front/src/`.
- Los componentes son archivos `.vue` (SFC) con `<script setup lang="ts">` y Composition API.
- Ejemplos: `rutinas_screen.vue`, `rutina_form_screen.vue`, `entreno_form_desde_rutina_screen.vue`, `login_screen.vue`, `AppLayout.vue`, `BotonPrimario.vue`, `RoutineCard.vue`, `BaseCard.vue`, `BaseModal.vue`.

### Página no continua (SPA)

- **Ubicación:** `front/src/App.vue`, `front/src/router/index.ts`.
- La aplicación es una SPA: una única carga HTML y navegación mediante Vue Router sin recargas completas de página.
- `<RouterView />` en `App.vue` y rutas definidas en `router/index.ts` (login, rutinas, rutina detalle/edición, entrenos, entreno detalle).

### Uso de Router

- **Ubicación:** `front/src/router/index.ts`, y en todas las pantallas que usan `useRouter()` / `useRoute()`.
- Rutas: `/login`, `/rutinas`, `/rutinas/nueva`, `/rutinas/:id`, `/rutinas/:id/editar`, `/entrenos`, `/entrenos/nuevo/:rutinaId`, `/entrenos/:id`.
- Guard de navegación `beforeEach` que redirige a `/login` si no hay token (excepto rutas públicas).
- Navegación mediante `RouterLink` y `router.push()` en los componentes.

### Uso de reactividad: ref, reactive, computed

- **ref:** En viewmodels (Pinia) y en pantallas: `ref('')`, `ref<OrdenRutinas>('az')`, `ref<EntrenoItem[]>([])`, `ref(false)`, etc. Ejemplos: `rutinas_screen.vue` (textoBusqueda, orden), `rutina_form_screen.vue` (nombreRutina, ejercicios, errorValidacion), `entreno_form_desde_rutina_screen.vue` (items, errorValidacion), `login_screen.vue` (enviado), `rutina_detail_screen.vue` (mostrarModalBorrar).
- **reactive:** En `login_screen.vue`: `const form = reactive({ email: '', password: '' })` para el formulario de login.
- **computed:** En viewmodels (Pinia): `rutinasLista`, `entrenosLista`, `estaLogueado`. En pantallas: `id`, `idEditar`, `esEdicion`, `rutinasFiltradasYOrdenadas`, `nombreRutina`, `orden` (get/set), etc. En `App.vue`: `usarLayout`.

### Uso de localStorage

- **Ubicación:**
  - `front/src/nucleo/almacenamiento/storage.ts`: token de autenticación (`obtenerToken`, `guardarToken`, `borrarToken`).
  - `front/src/compartido/composables/useLocalStorage.ts`: composable genérico para preferencias.
  - `front/src/funcionalidades/rutinas/view/pantallas/rutinas_screen.vue`: preferencia de **orden de rutinas** (A-Z, Z-A, más recientes) persistida con la clave `fittrack_rutinas_orden`. Al cambiar el desplegable se guarda en localStorage; al cargar la pantalla se recupera el último valor.

### Uso de sessionStorage

- **Ubicación:**
  - `front/src/compartido/composables/useEntrenamientoEnCurso.ts`: composable que guarda y recupera el **entrenamiento en curso** (rutinaId, nombreRutina, items con series/reps/peso).
  - `front/src/funcionalidades/entrenamientos/view/pantallas/entreno_form_desde_rutina_screen.vue`: al montar, si existe un entrenamiento guardado para la misma rutina se restauran los items; al modificar los items se persisten en sessionStorage; al guardar el entreno con éxito se limpia sessionStorage. Así, si el usuario recarga la página no pierde el formulario; si cierra la pestaña/navegador, los datos se pierden.

### Uso de props y emits

- **Ubicación:**
  - **RoutineCard** (`front/src/compartido/ui/RoutineCard.vue`): prop `rutina` (tipo `Rutina`), emit `ver` con el `id` de la rutina. El padre (`rutinas_screen.vue`) usa `:rutina="r"` y `@ver="irARutina"`.
  - **BotonPrimario** (`front/src/compartido/ui/BotonPrimario.vue`): props `type`, `disabled`; emit `click` (evento de clic). Uso en múltiples pantallas con `@click="..."`.
  - **BaseModal** (`front/src/compartido/ui/BaseModal.vue`): prop `visible`, emit `cerrar`. Usado en `rutina_detail_screen.vue` para el modal de confirmación de borrado.
  - **BaseCard** (`front/src/compartido/ui/BaseCard.vue`): solo slots (sin props de datos); se usa para estructura de contenido.

### Uso de Pinia

- **Ubicación:** `front/src/main.ts` (`app.use(createPinia())`) y stores en viewmodels:
  - **Autenticación:** `front/src/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel.ts` – `useAutenticacionViewModel`: login, logout, estaLogueado, cargando, error.
  - **Rutinas:** `front/src/funcionalidades/rutinas/viewmodel/rutinas_viewmodel.ts` – `useRutinasViewModel`: cargarRutinas, cargarRutinaPorId, crearRutina, actualizarRutina, borrarRutina, duplicarRutina, rutinasLista, rutinaActual, cargando, error.
  - **Entrenamientos:** `front/src/funcionalidades/entrenamientos/viewmodel/entrenamientos_viewmodel.ts` – `useEntrenamientosViewModel`: cargarEntrenos, cargarEntrenoPorId, crearEntreno, entrenosLista, entrenoActual, cargando, error.

Los stores usan Composition API (setup function) con `ref` y `computed` internamente.

### Uso de slots

- **Ubicación:**
  - **BaseCard** (`front/src/compartido/ui/BaseCard.vue`): slots nombrados `titulo`, `default`, `acciones`. Usado en `RoutineCard` (titulo + default) y en `rutina_detail_screen.vue` (titulo “Ejercicios de la rutina” + contenido de la lista).
  - **BaseModal** (`front/src/compartido/ui/BaseModal.vue`): slots `titulo`, `default` (contenido), `pie` (acciones). Usado en `rutina_detail_screen.vue` para el modal de confirmar borrado (titulo, texto, botones Cancelar / Borrar).
  - **BotonPrimario**: slot por defecto para el texto del botón.
  - **AppLayout**: slot por defecto para el contenido del layout.

### Uso de composables

- **Ubicación:** `front/src/compartido/composables/`
  - **useLocalStorage.ts:** Lectura/escritura reactiva de una clave en localStorage. Uso: preferencia de orden de rutinas en `rutinas_screen.vue`.
  - **useEntrenamientoEnCurso.ts:** Obtener, guardar y limpiar el entrenamiento en curso en sessionStorage. Uso: `entreno_form_desde_rutina_screen.vue`.
  - **useFiltrosRutinas.ts:** Recibe la lista de rutinas (Ref), texto de búsqueda (Ref) y orden (Ref); devuelve un `computed` con la lista filtrada y ordenada. Uso: `rutinas_screen.vue`.

---

## 4. Componentes creados o refactorizados

| Componente | Descripción |
|-----------|-------------|
| **BaseCard** | Contenedor con slots `titulo`, `default`, `acciones`. Uso: tarjetas de rutina y bloque de ejercicios en detalle de rutina. |
| **BaseModal** | Modal con slots `titulo`, `default`, `pie`. Prop `visible`, emit `cerrar`. Uso: confirmación de borrado de rutina. |
| **RoutineCard** | Muestra una rutina (nombre + número de ejercicios). Prop `rutina`, emit `ver(id)`. Usa BaseCard por dentro. Uso: listado de rutinas. |
| **BotonPrimario** | Refactorizado: se añade emit explícito `click` además de props `type` y `disabled` y slot. |

---

## 5. Stores creados

Los stores ya existían; se mantienen y se documentan aquí:

| Store | Archivo | Uso principal |
|-------|---------|----------------|
| **autenticación** | `autenticacion_viewmodel.ts` | Login, logout, estado de sesión (token en localStorage). |
| **rutinas** | `rutinas_viewmodel.ts` | CRUD de rutinas, listado, detalle, duplicar. |
| **entrenamientos** | `entrenamientos_viewmodel.ts` | Listado de entrenos, detalle, crear entreno. |

---

## 6. Composables creados

| Composable | Archivo | Uso |
|------------|---------|-----|
| **useLocalStorage** | `compartido/composables/useLocalStorage.ts` | Preferencia de orden de rutinas (localStorage). |
| **useEntrenamientoEnCurso** | `compartido/composables/useEntrenamientoEnCurso.ts` | Persistir y recuperar el formulario de “registrar entreno” en sessionStorage. |
| **useFiltrosRutinas** | `compartido/composables/useFiltrosRutinas.ts` | Filtro por texto y orden (A-Z, Z-A, recientes) sobre la lista de rutinas. |

---

## 7. Uso de localStorage y sessionStorage

- **localStorage**
  - Token de autenticación: `nucleo/almacenamiento/storage.ts` (clave `token`).
  - Orden de rutinas: clave `fittrack_rutinas_orden` mediante `useLocalStorage` en `rutinas_screen.vue`.
- **sessionStorage**
  - Entrenamiento en curso: clave `fittrack_entreno_en_curso` mediante `useEntrenamientoEnCurso` en el formulario de registrar entreno. Objeto: `{ rutinaId, nombreRutina, items }`.

---

## 8. Conclusión

El frontend de FitTrack cumple todos los criterios DEW indicados. La estructura por funcionalidades y el enfoque MVVM se han mantenido; los cambios son incrementales (composables, componentes base con slots, persistencia en localStorage y sessionStorage, uso explícito de props/emits y de ref/reactive/computed). La aplicación sigue siendo una SPA con Vue 3, TypeScript, Composition API, Router y Pinia, adecuada para su defensa como proyecto de curso.
