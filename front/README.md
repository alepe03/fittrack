# FitTrack — Frontend (DEW)

Frontend de **FitTrack**, una aplicación de seguimiento de entrenamientos de gimnasio, desarrollado para la asignatura **Desarrollo Web en Entorno Cliente (DEW)**.

Está construido con **Vue 3 + TypeScript + Vite** siguiendo una arquitectura **MVVM por funcionalidades** y cumpliendo los criterios de la asignatura (router, Pinia, composables, slots, reactividad, `localStorage`/`sessionStorage`, etc.).

---

## 1. Arranque del proyecto

```bash
cd front
npm install
npm run dev
```

Abre la URL que muestre Vite (por ejemplo `http://localhost:5173`).

### Credenciales demo

- **Email:** `admin@demo.com`
- **Contraseña:** `1234`

Si no hay token en `localStorage`, el guard del router redirige a `/login`. Tras iniciar sesión se guarda el token y se redirige a la lista de rutinas.

---

## 2. Arquitectura del frontend y MVVM en Vue

La organización del frontend sigue una estructura **modular por funcionalidad** y una adaptación de **MVVM**:

- **Model (`model/`)**  
  - Definición de tipos y entidades de dominio (`entidades.ts`) para cada módulo.  
  - Ejemplo: `src/funcionalidades/rutinas/model/entidades.ts`.

- **Data (`data/`)**  
  - Capa de acceso a datos:
    - `*_api.ts`: implementación de llamadas a API (mock ahora, lista para API real).
    - `*_repositorio.ts`: repositorios que exponen métodos de alto nivel (`listar`, `obtenerPorId`, `crear`, etc.).
  - Ejemplos:
    - `src/funcionalidades/rutinas/data/rutinas_api.ts`
    - `src/funcionalidades/rutinas/data/rutinas_repositorio.ts`

- **ViewModel (`viewmodel/`) — Pinia como ViewModel**  
  - Stores de Pinia que representan el **ViewModel** de cada funcionalidad:
    - Estado reactivo (`ref`, `computed`).
    - Acciones de uso desde las vistas (cargar, crear, actualizar, borrar, login, logout).
    - Manejo de errores y flags de carga.
  - Ejemplos:
    - `src/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel.ts`
    - `src/funcionalidades/rutinas/viewmodel/rutinas_viewmodel.ts`
    - `src/funcionalidades/entrenamientos/viewmodel/entrenamientos_viewmodel.ts`

- **View (`view/pantallas/`)**  
  - Pantallas `.vue` que:
    - Pintan la interfaz.
    - Consumen el ViewModel (stores de Pinia).
    - Navegan con `vue-router`.
  - Ejemplos:
    - `src/funcionalidades/autenticacion/view/pantallas/login_screen.vue`
    - `src/funcionalidades/rutinas/view/pantallas/rutinas_screen.vue`
    - `src/funcionalidades/entrenamientos/view/pantallas/entrenos_screen.vue`

- **Núcleo (`src/nucleo/`)**  
  - Código compartido de infraestructura:
    - `nucleo/almacenamiento/storage.ts`: token en `localStorage`.
    - `nucleo/red/cliente_api.ts`: cliente HTTP preparado para API real.
    - `nucleo/utils/fechas.ts`: utilidades de formato de fechas usadas en las vistas de entrenos.

- **Compartido (`src/compartido/`)**  
  - Componentes de UI reutilizables (`ui/`), composables comunes (`composables/`), etc.
  - Ejemplos:
    - `compartido/ui/AppLayout.vue`, `BotonPrimario.vue`, `BaseCard.vue`, `BaseModal.vue`, `TarjetaRutina.vue`.
    - `compartido/composables/useLocalStorage.ts`, `useFiltrosRutinas.ts`, `useEntrenamientoEnCurso.ts`.

---

## 3. Adaptación de MVVM en Vue

En este proyecto, el patrón **MVVM** se adapta a Vue de la siguiente forma:

- **View (Vista)**  
  - Componentes en `view/pantallas`.
  - Encargados de mostrar la UI y capturar la interacción del usuario (clicks, formularios, navegación).

- **ViewModel**  
  - Implementado con **Pinia** (stores en `viewmodel/`).
  - Contiene:
    - Estado reactivo (`ref`, `computed`).
    - Lógica de presentación y orquestación de casos de uso que usan las vistas.

- **Model**  
  - Entidades en `model/` (`entidades.ts`).
  - Representan la estructura de los datos de dominio (Rutina, Entreno, Usuario, etc.).

- **Data**  
  - Repositorios y APIs en `data/`.
  - Encargados de acceder a la fuente de datos (mock actual o futura API real).

Flujo general:

> **View → ViewModel → Repositorio → API**

Las vistas nunca hablan directamente con la API, sino que pasan siempre por el ViewModel y los repositorios, lo que hace que la arquitectura sea más mantenible y fácilmente defendible.

### Diagrama verbal de flujo MVVM

Ejemplo flujo “listar rutinas”:

1. La ruta `/rutinas` monta la vista `rutinas_screen.vue`.
2. La vista usa el ViewModel `useRutinasViewModel` (Pinia).
3. El ViewModel llama al repositorio `rutinas_repositorio`.
4. El repositorio delega en `rutinas_api` para obtener datos (mock/API real).
5. La vista muestra `rutinasLista` y maneja filtros/orden con composables (`useFiltrosRutinas`, `useLocalStorage`).

---

## 4. Flujo principal de la aplicación

Flujo típico de usuario en la aplicación:

1. El usuario inicia sesión desde la pantalla de login (`login_screen.vue`).
2. El ViewModel de autenticación (`useAutenticacionViewModel`) gestiona el estado y guarda el token en `localStorage`.
3. El usuario accede a la vista de rutinas (`rutinas_screen.vue`).
4. El ViewModel de rutinas (`useRutinasViewModel`) carga los datos desde el repositorio de rutinas.
5. El usuario puede:
   - Filtrar rutinas mediante el composable `useFiltrosRutinas`.
   - Ordenarlas, con la preferencia persistida en `localStorage` usando `useLocalStorage`.
6. Al seleccionar una rutina:
   - Se navega a su detalle (`rutina_detail_screen.vue`).
7. Al iniciar un entrenamiento desde una rutina:
   - Se abre el formulario de entreno (`entreno_form_desde_rutina_screen.vue`).
   - El estado del entrenamiento en curso se guarda en `sessionStorage` mediante `useEntrenamientoEnCurso`.
8. El usuario registra ejercicios y series (reps, peso por serie).
9. Al finalizar y guardar:
   - Se crea un nuevo entreno a través del ViewModel de entrenamientos (`useEntrenamientosViewModel`).
   - Se limpia el estado temporal del entrenamiento en curso en `sessionStorage`.

Este flujo demuestra cómo se combinan **router, ViewModels, repositorios, composables y almacenamiento web** para cubrir el caso de uso principal de FitTrack.

---

## 5. Estructura de carpetas (resumen)

```text
src/
  main.ts
  App.vue
  router/index.ts

  nucleo/
    almacenamiento/storage.ts  # Token en localStorage
    red/cliente_api.ts         # Cliente HTTP preparado para API real
    utils/fechas.ts            # Formato de fechas para entrenos

  compartido/
    ui/
      AppLayout.vue            # Layout principal (nav: Rutinas, Entrenos, Salir)
      BotonPrimario.vue
      BaseCard.vue
      BaseModal.vue
      TarjetaRutina.vue
    compartido/composables/
      useLocalStorage.ts
      useFiltrosRutinas.ts
      useEntrenamientoEnCurso.ts

  funcionalidades/
    autenticacion/
      model/entidades.ts
      data/autenticacion_api.ts
      data/autenticacion_repositorio.ts
      viewmodel/autenticacion_viewmodel.ts
      viewmodel/autenticacion_estado.ts
      view/pantallas/login_screen.vue

    rutinas/
      model/entidades.ts
      data/rutinas_api.ts
      data/rutinas_repositorio.ts
      viewmodel/rutinas_viewmodel.ts
      viewmodel/rutinas_estado.ts
      view/pantallas/rutinas_screen.vue
      view/pantallas/rutina_detail_screen.vue
      view/pantallas/rutina_form_screen.vue

    entrenamientos/
      model/entidades.ts
      data/entrenamientos_api.ts
      data/entrenamientos_repositorio.ts
      viewmodel/entrenamientos_viewmodel.ts
      viewmodel/entrenamientos_estado.ts
      view/pantallas/entrenos_screen.vue
      view/pantallas/entreno_detail_screen.vue
      view/pantallas/entreno_form_desde_rutina_screen.vue
```

---

## 6. Rutas y navegación (Vue Router)

Archivo principal: `src/router/index.ts`.

| Ruta                    | Pantalla                                                       |
|-------------------------|----------------------------------------------------------------|
| `/login`                | `login_screen.vue` (pública)                                   |
| `/rutinas`              | Lista de rutinas                                               |
| `/rutinas/nueva`        | Formulario de creación de rutina                               |
| `/rutinas/:id`          | Detalle de rutina + acción “Registrar entreno”                 |
| `/rutinas/:id/editar`   | Edición de rutina                                              |
| `/entrenos`             | Histórico de entrenos                                          |
| `/entrenos/nuevo/:rutinaId` | Registrar entreno desde una rutina                        |
| `/entrenos/:id`         | Detalle de un entreno                                          |

El router define un **guard global**:

- Si la ruta no es pública (`meta.publica !== true`) y no hay token en `localStorage`, se redirige a `/login`.
- Esto garantiza rutas protegidas de forma centralizada.

---

## 7. Cumplimiento de requisitos DEW (frontend)

### 5.1 Vue + TypeScript + SFC + Composition API

- Todas las pantallas y componentes usan **SFC con `<script setup lang="ts">`**.
- Ejemplos:
  - `login_screen.vue`, `rutinas_screen.vue`, `entrenos_screen.vue`.

### 5.2 Router

- Uso de **Vue Router 4** en `src/router/index.ts`.
- Rutas para login, rutinas y entrenos.
- **Guardia de autenticación** basada en token (`obtenerToken` de `storage.ts`).

### 5.3 Reactividad real: `ref`, `reactive`, `computed`

- En vistas:
  - `login_screen.vue`: `reactive` para el formulario, `ref` para `enviado`.
  - `rutinas_screen.vue`: `ref` para texto de búsqueda, `computed` para el orden (getter/setter).
- En ViewModels (Pinia):
  - `rutinas_viewmodel.ts`, `entrenamientos_viewmodel.ts`, `autenticacion_viewmodel.ts` usan `ref` y `computed` para estado y propiedades derivadas.

### 5.4 `localStorage` y `sessionStorage`

- **`localStorage`**:
  - `nucleo/almacenamiento/storage.ts`:
    - Guarda y lee el **token de sesión** (`guardarToken`, `obtenerToken`, `borrarToken`).
  - `compartido/composables/useLocalStorage.ts`:
    - Composable genérico para preferencias de usuario (por ejemplo, orden de rutinas).
  - Uso concreto:
    - `rutinas_screen.vue` guarda la preferencia de orden (`fittrack_rutinas_orden`).
- **`sessionStorage`**:
  - `useEntrenamientoEnCurso.ts`:
    - Guarda el **entrenamiento en curso** para que no se pierda al recargar la página.
    - Al cerrar pestaña/navegador se limpia automáticamente, lo cual es el comportamiento deseado.

### 5.5 Props y emits

- **Ejemplos**:
  - `BotonPrimario.vue`:
    - `defineProps` con `type` y `disabled`.
    - `defineEmits` para el evento `click`.
  - `TarjetaRutina.vue`:
    - `props` con `rutina: Rutina`.
    - `emits` con `ver: [id: string]`, usado en la vista `rutinas_screen.vue`.
  - `BaseModal.vue`:
    - `props: visible`, `emit('cerrar')` al hacer clic en el overlay.

### 5.6 Pinia

- `main.ts` registra Pinia (`app.use(createPinia())`).
- Los ViewModels se definen con `defineStore`:
  - `useAutenticacionViewModel`
  - `useRutinasViewModel`
  - `useEntrenamientosViewModel`
- **Pinia como ViewModel**:
  - Cada store concentra:
    - Estado de la pantalla/funcionalidad.
    - Acciones que las vistas disparan.
    - Manejo de errores y `cargando`.
  - Las vistas solo consumen el store y llaman a sus métodos, sin hablar directamente con la capa `data`.

### 5.7 Slots

- Componentes base reutilizables con slots:
  - `BaseCard.vue`:
    - Slots `titulo`, default y `acciones`.
    - Usado por `TarjetaRutina.vue`.
  - `BaseModal.vue`:
    - Slots `titulo`, default (contenido) y `pie` (acciones).

### 5.8 Composables

- **`useLocalStorage`**:
  - Encapsula lectura/escritura en `localStorage` de forma reactiva.
- **`useFiltrosRutinas`**:
  - Aplica filtrado por texto y orden (`az`, `za`, `recientes`) sobre la lista de rutinas.
- **`useEntrenamientoEnCurso`**:
  - Encapsula el caso de uso de “entreno en curso” con `sessionStorage`.

### 5.9 Utilidades compartidas (`nucleo/utils`)

- `utils/fechas.ts`:
  - `formatearFechaCorta`: usada en `entrenos_screen.vue` para mostrar la fecha de cada entreno en el listado.
  - `formatearFechaConHora`: usada en `entreno_detail_screen.vue` para mostrar fecha + hora del entreno.
  - Extrae lógica de formato fuera de las vistas para mantenerlas más limpias.

---

## 8. Justificación de decisiones clave

- **Pinia como ViewModel**  
  - Cada store de Pinia representa el estado y las acciones de una parte de la interfaz (autenticación, rutinas, entrenos).
  - Las vistas dependen solo del ViewModel y no de la capa de datos, lo que encaja con el patrón MVVM.

- **Uso de `localStorage`**  
  - Se usa para:
    - Persistir el **token de sesión** (autenticación).
    - Guardar **preferencias de usuario** como el orden de rutinas.
  - Justificación: son datos que deben sobrevivir a recargas y cierres del navegador.

- **Uso de `sessionStorage`**  
  - Se usa para el **entrenamiento en curso** (`useEntrenamientoEnCurso`):
    - Si el usuario recarga la página en medio de un formulario largo, no pierde datos.
    - Al cerrar pestaña/navegador se limpia (no interesa guardar un entreno a medias para siempre).

- **Composables**  
  - Encapsulan lógica reutilizable (filtros, almacenamiento, sesión de entreno) que podría usarse en diferentes vistas sin duplicación.

- **Slots en componentes base**  
  - Permiten crear componentes genéricos (tarjetas, modales) que se adaptan a diferentes contenidos:
    - Facilitan la reutilización y simplifican las vistas, que solo rellenan los slots necesarios.

---

## 9. Cómo defender el proyecto en la presentación

Algunas ideas de discurso:

- Empezar explicando la **estructura por funcionalidades** (`autenticacion`, `rutinas`, `entrenamientos`) y cómo cada una sigue MVVM.
- Mostrar un ejemplo completo:
  - Vista `rutinas_screen.vue` → `useRutinasViewModel` → `rutinas_repositorio` → `rutinas_api`.
- Enseñar un **composable** (`useFiltrosRutinas`, `useLocalStorage`, `useEntrenamientoEnCurso`) y cómo evita duplicar lógica.
- Enseñar un **componente con slots** (`BaseCard`, `BaseModal`) y un uso concreto (`TarjetaRutina`).
- Comentar brevemente:
  - Router + guardia de autenticación.
  - Uso de `localStorage` y `sessionStorage` con justificación.
  - Uso de `ref`, `reactive`, `computed` en vistas y ViewModels.

Con esto, el frontend queda más **coherente, limpio y defendible** de cara a la entrega de DEW.
