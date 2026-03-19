# MVP del frontend

## 1. Introducción

FitTrack es una aplicación web para el seguimiento de rutinas de gimnasio, entrenamientos y progreso físico. Este documento describe el alcance funcional mínimo del frontend según el estado actual del proyecto. Sirve como referencia del MVP real implementado o parcialmente implementado, sin inventar funcionalidades que no existan en el código. El objetivo es tener una base clara del alcance del frontend antes de diseñar el modelo de datos y la API REST del backend.

---

## 2. Pantallas principales del MVP

El frontend está organizado por funcionalidades y expone las siguientes pantallas, definidas en el router bajo las rutas indicadas.

### 2.1 Inicio de sesión

- **Ruta:** `/login`
- **Componente:** `login_screen.vue` (funcionalidad autenticación)
- **Objetivo:** Permitir al usuario identificarse con email y contraseña para acceder al resto de la aplicación.
- **Información que muestra:** Formulario con campos email y contraseña, mensaje de error si el login falla, texto de ayuda con credenciales de demo.
- **Acciones disponibles:** Enviar el formulario (login). Tras un login correcto se redirige a `/rutinas`.
- **Datos necesarios:** Credenciales (email, contraseña). El token se persiste en localStorage y el guard del router comprueba su existencia para permitir el acceso a rutas protegidas.

### 2.2 Listado de rutinas

- **Ruta:** `/rutinas`
- **Componente:** `rutinas_screen.vue`
- **Objetivo:** Mostrar todas las rutinas del usuario y permitir buscar, ordenar y acceder al detalle o a la creación de una nueva.
- **Información que muestra:** Título "Rutinas", lista de rutinas (nombre y número de ejercicios), buscador por nombre, selector de orden (A-Z, Z-A, más recientes primero). Estados de carga, error y listas vacías o sin resultados.
- **Acciones disponibles:** Crear nueva rutina (enlace a `/rutinas/nueva`), buscar por texto, cambiar orden (preferencia persistida en localStorage), hacer clic en una rutina para ir a su detalle (a través del componente RoutineCard y su emit `ver`).
- **Datos necesarios:** Lista de rutinas desde el store de Pinia (cargada por el viewmodel de rutinas). La preferencia de orden se lee y guarda en localStorage con la clave `fittrack_rutinas_orden`.

### 2.3 Crear rutina / Editar rutina

- **Rutas:** `/rutinas/nueva`, `/rutinas/:id/editar`
- **Componente:** `rutina_form_screen.vue`
- **Objetivo:** Crear una rutina nueva o editar una existente (nombre y ejercicios con series objetivo).
- **Información que muestra:** Título "Nueva rutina" o "Editar rutina", campo nombre de la rutina, lista de ejercicios con nombre y series objetivo (reps y peso sugerido por serie), mensajes de validación y de error del store.
- **Acciones disponibles:** Añadir y quitar ejercicios, añadir y quitar series objetivo por ejercicio, guardar (crear o actualizar), cancelar (vuelve al listado o al detalle según el modo).
- **Datos necesarios:** En edición, la rutina actual del store (cargada por id desde la ruta). Para guardar: nombre y lista de ejercicios con sus series (reps, pesoSugerido).

### 2.4 Detalle de rutina

- **Ruta:** `/rutinas/:id`
- **Componente:** `rutina_detail_screen.vue`
- **Objetivo:** Mostrar una rutina con sus ejercicios y series objetivo, y ofrecer acciones de edición, duplicado, borrado y registro de entreno.
- **Información que muestra:** Nombre de la rutina, lista de ejercicios con sus series (reps y peso sugerido), mensajes de carga y error. Modal de confirmación de borrado (BaseModal) con título, texto y botones Cancelar / Borrar.
- **Acciones disponibles:** Editar (navegación a `/rutinas/:id/editar`), Duplicar (crea una copia y navega al detalle de la nueva), Borrar (abre el modal y, al confirmar, borra y vuelve al listado), Registrar entreno (navegación a `/entrenos/nuevo/:rutinaId`).
- **Datos necesarios:** Id de la rutina desde la ruta; la rutina se carga por id en el store (rutinaActual).

### 2.5 Listado de entrenos

- **Ruta:** `/entrenos`
- **Componente:** `entrenos_screen.vue`
- **Objetivo:** Mostrar los entrenos ya registrados por el usuario.
- **Información que muestra:** Título "Entrenos", lista de entrenos con nombre de la rutina y fecha (formato día/mes/año), estados de carga, error y lista vacía.
- **Acciones disponibles:** Clic en un entreno para ir a su detalle (`/entrenos/:id`).
- **Datos necesarios:** Lista de entrenos del store (entrenosLista), cargada por el viewmodel de entrenamientos.

### 2.6 Registrar entreno desde una rutina

- **Ruta:** `/entrenos/nuevo/:rutinaId`
- **Componente:** `entreno_form_desde_rutina_screen.vue`
- **Objetivo:** Registrar un entreno basado en una rutina: el usuario rellena reps y peso realizados por cada serie de cada ejercicio.
- **Información que muestra:** Título "Registrar entreno", nombre de la rutina, lista de ejercicios con sus series y campos para reps y peso por serie, mensajes de validación y error.
- **Acciones disponibles:** Introducir reps y peso por serie, guardar entreno (crea el entreno y redirige al detalle del entreno), cancelar (vuelve al detalle de la rutina).
- **Datos necesarios:** Rutina cargada por `rutinaId` (parámetro de ruta). Opcionalmente se recupera un borrador desde sessionStorage (entrenamiento en curso) si existe para la misma rutina; al guardar correctamente se limpia sessionStorage.

### 2.7 Detalle del entreno registrado

- **Ruta:** `/entrenos/:id`
- **Componente:** `entreno_detail_screen.vue`
- **Objetivo:** Mostrar un entreno ya guardado (rutina, fecha/hora e ítems con series realizadas).
- **Información que muestra:** Nombre de la rutina del entreno, fecha y hora formateadas, lista de ejercicios con cada serie (reps y peso).
- **Acciones disponibles:** Solo consulta; no hay acciones de edición o borrado en esta pantalla en el estado actual.
- **Datos necesarios:** Id del entreno desde la ruta; el entreno se carga por id en el store (entrenoActual).

---

## 3. Flujo principal del usuario

1. **Acceso:** El usuario abre la aplicación. Si no tiene token en localStorage, el guard del router le redirige a `/login`.
2. **Login:** Introduce email y contraseña en la pantalla de login. Si el login es correcto, se guarda el token y se redirige a `/rutinas`.
3. **Listado de rutinas:** En `/rutinas` ve sus rutinas, puede buscar por nombre y cambiar el orden (A-Z, Z-A, más recientes). La preferencia de orden se persiste en localStorage.
4. **Crear rutina:** Desde "Nueva rutina" accede a `/rutinas/nueva`, define nombre y ejercicios con series objetivo, guarda y es redirigido al detalle de la rutina creada.
5. **Consultar rutina:** Desde el listado hace clic en una rutina (RoutineCard emite `ver`) y navega a `/rutinas/:id`, donde ve nombre, ejercicios y series objetivo.
6. **Editar / Duplicar / Borrar:** En el detalle puede editar (mismo formulario en modo edición), duplicar la rutina o borrarla; el borrado se confirma en un modal (BaseModal).
7. **Registrar entreno:** En el detalle de la rutina pulsa "Registrar entreno" y va a `/entrenos/nuevo/:rutinaId`. Rellena reps y peso por serie. Si recarga la página, los datos del formulario se recuperan de sessionStorage (entrenamiento en curso). Al guardar, se crea el entreno y se redirige al detalle del entreno; se limpia el borrador en sessionStorage.
8. **Ver entrenos:** Desde la navegación puede ir a `/entrenos` y ver la lista de entrenos registrados (nombre de rutina y fecha).
9. **Ver detalle de un entreno:** Al hacer clic en un entreno en el listado, navega a `/entrenos/:id` y ve el resumen del entreno (ejercicios y series con reps y peso).
10. **Salir:** Desde el layout (AppLayout) puede cerrar sesión; se borra el token y se redirige a `/login`.

---

## 4. Componentes reutilizables relevantes

- **BaseCard** (`compartido/ui/BaseCard.vue`): Contenedor con slots `titulo`, `default` y `acciones`. Se usa en RoutineCard (tarjeta de rutina en el listado) y en el detalle de rutina para el bloque "Ejercicios de la rutina". Da una estructura uniforme a las tarjetas y bloques de contenido.

- **BaseModal** (`compartido/ui/BaseModal.vue`): Modal con prop `visible`, emit `cerrar` y slots `titulo`, `default` y `pie`. Se usa en el detalle de rutina para la confirmación de borrado (título, texto explicativo y botones Cancelar / Borrar). Centraliza la presentación de diálogos modales.

- **RoutineCard** (`compartido/ui/RoutineCard.vue`): Tarjeta que muestra una rutina (nombre y número de ejercicios). Recibe la prop `rutina` y emite `ver` con el id al hacer clic. El padre (listado de rutinas) reacciona navegando al detalle. Refuerza el uso de props/emits y reutiliza BaseCard.

- **BotonPrimario** (`compartido/ui/BotonPrimario.vue`): Botón estilizado con props `type` y `disabled`, emit `click` y slot por defecto para el texto. Se usa en login, formularios de rutina y entreno, y en el detalle de rutina para "Registrar entreno" y "Guardar".

- **AppLayout** (`compartido/ui/AppLayout.vue`): Layout principal con cabecera (enlaces a Rutinas y Entrenos, botón Salir) y slot para el contenido. Se usa en todas las pantallas excepto en login; en `App.vue` se decide si mostrar el layout según la ruta.

- **Composables:**
  - **useLocalStorage** (`compartido/composables/useLocalStorage.ts`): Lectura y escritura reactiva de una clave en localStorage. En el MVP se usa para la preferencia de orden del listado de rutinas (`fittrack_rutinas_orden`).
  - **useEntrenamientoEnCurso** (`compartido/composables/useEntrenamientoEnCurso.ts`): Guardar y recuperar el borrador del formulario de "registrar entreno" en sessionStorage. Permite no perder los datos si el usuario recarga la página durante el registro.
  - **useFiltrosRutinas** (`compartido/composables/useFiltrosRutinas.ts`): A partir de la lista de rutinas y de los refs de texto de búsqueda y orden, devuelve un computed con la lista filtrada y ordenada. Usado en el listado de rutinas para buscar y ordenar sin duplicar lógica.

Estos componentes y composables apoyan la consistencia visual, la reutilización y el cumplimiento de los criterios del proyecto (slots, props/emits, localStorage, sessionStorage, composables).

---

## 5. Estado actual del MVP

**Implementado y en uso:**

- Login con token en localStorage y guard del router.
- Listado de rutinas con búsqueda, orden (persistido en localStorage) y navegación al detalle mediante RoutineCard.
- Creación y edición de rutinas (nombre, ejercicios, series objetivo).
- Detalle de rutina con ejercicios en BaseCard y acciones Editar, Duplicar, Borrar (con modal de confirmación) y Registrar entreno.
- Formulario de registro de entreno con recuperación de borrador en sessionStorage y limpieza al guardar.
- Listado de entrenos y detalle de un entreno (solo lectura).
- Navegación SPA con Vue Router, estado global con Pinia (autenticación, rutinas, entrenamientos) y componentes reutilizables (BaseCard, BaseModal, RoutineCard, BotonPrimario, AppLayout) y composables descritos.

**Posibles mejoras o ampliaciones futuras (no forman parte del MVP documentado aquí):**

- Edición o borrado de un entreno ya guardado desde el detalle del entreno.
- Filtros o paginación en el listado de entrenos.
- Componente reutilizable tipo "EntrenoCard" en el listado de entrenos (similar a RoutineCard).
- Estadísticas o gráficos de progreso a partir de los entrenos guardados.
- Perfil de usuario o preferencias adicionales (más allá del orden de rutinas).

El MVP actual asume que los datos se obtienen y persisten mediante los repositorios/API existentes en el frontend; la forma concreta (mock, backend real, etc.) depende de la capa de datos del proyecto.

---

## 6. Próximos pasos

Una vez definido este MVP del frontend, el siguiente paso lógico del proyecto es diseñar el modelo de datos y la API REST del backend en Laravel de forma coherente con las pantallas y flujos descritos. En concreto:

- **Modelo de datos:** Definir entidades (usuario, rutina, ejercicio, serie objetivo, entreno, ítem de entreno, serie realizada) y relaciones alineadas con lo que las vistas muestran y envían (por ejemplo, rutina con ejercicios y series objetivo; entreno con items y series con reps y peso).
- **API REST:** Definir endpoints que soporten login, CRUD de rutinas, listado y detalle de entrenos y creación de entrenos, de modo que los repositorios y viewmodels del frontend puedan consumirlos sin cambiar el flujo de usuario descrito en este documento.

Este documento sirve como referencia del alcance funcional del frontend para guiar el diseño de la base de datos y del backend.
