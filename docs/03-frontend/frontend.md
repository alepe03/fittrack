# 3. Frontend (DEW)

## 1. Introducción

El frontend de FitTrack es una SPA orientada a la gestión de rutinas y al registro de entrenamientos, con un flujo real de uso que cubre planificación, ejecución y seguimiento.

La implementación está organizada por dominios funcionales (`autenticacion`, `rutinas`, `entrenamientos`) y por capas (`view`, `viewmodel`, `data`, `model`), lo que facilita la trazabilidad de criterios técnicos y su defensa académica.

Este documento se centra únicamente en DEW y demuestra el cumplimiento criterio por criterio, aplicado al proyecto real.

---

## 2. Tecnologías utilizadas

- **Vue 3 + TypeScript:** base del cliente con tipado estático y componentes mantenibles.
- **Composition API:** gestión de lógica con `ref`, `computed`, `watch` y composables.
- **Pinia:** estado global por dominio, desacoplado de la interfaz.
- **Vue Router:** navegación SPA con rutas públicas/protegidas y guard de acceso.

Este stack no se usa de forma superficial: está integrado en el funcionamiento diario de la aplicación.

---

## 3. Cumplimiento de criterios DEW

### 3.1 Vue + TypeScript + SFC + Composition API

**Explicación aplicada al proyecto**  
FitTrack usa componentes SFC (`.vue`) con `script setup lang="ts"` tanto en pantallas como en componentes reutilizables. Esto permite separar vista y lógica sin perder tipado ni coherencia estructural.

**Dónde se usa**  
- Pantallas de dominio (`rutinas_screen.vue`, `rutina_detail_screen.vue`, `entreno_form_desde_rutina_screen.vue`, `entreno_detail_screen.vue`).
- Componentes compartidos (`BotonPrimario.vue`, `BaseCard.vue`, `BaseModal.vue`, `TarjetaRutina.vue`).

**Por qué está bien implementado**  
La app mantiene una estructura homogénea, tipada y modular; no hay mezcla caótica de lógica y presentación, y cada componente tiene responsabilidad clara.

**Evidencia:**  
- Aquí se añadirá captura de una pantalla con su flujo activo (ejemplo: formulario de entreno).  
- Aquí se añadirá código de `script setup lang="ts"` en un SFC real del proyecto.

### 3.2 Router

**Explicación aplicada al proyecto**  
La navegación SPA está centralizada en `router/index.ts` y define acceso público y protegido según estado de sesión.

**Dónde se usa**  
- Rutas públicas: `/login`, `/registro`.
- Rutas protegidas: `/rutinas`, `/rutinas/:id`, `/entrenos`, `/entrenos/:id`, etc.
- Guard global `beforeEach` con validación de token y `asegurarSesion()`.

**Por qué está bien implementado**  
El enrutado cubre escenarios reales de acceso: redirige a login si no hay sesión, evita volver a login/registro estando autenticado y mantiene consistencia de navegación.

**Evidencia:**  
- Aquí se añadirá captura de redirección a `/login` al intentar acceder a una ruta protegida sin token.  
- Aquí se añadirá código del `beforeEach` de `router/index.ts`.

### 3.3 Reactividad (`ref`, `reactive`, `computed`)

**Explicación aplicada al proyecto**  
La reactividad se utiliza para estado de formularios, estados visuales, validaciones y datos derivados, no solo para variables simples.

**Dónde se usa**  
- `rutinas_screen.vue`: búsqueda reactiva y orden persistido.
- `entreno_form_desde_rutina_screen.vue`: series, nota, cronómetro, descanso y resumen en tiempo real.
- ViewModels Pinia: estado de carga/error y colecciones derivadas.

**Por qué está bien implementado**  
La UI responde a cambios de estado en tiempo real y reduce lógica manual imperativa, mejorando mantenibilidad y claridad en defensa.

**Evidencia:**  
- Aquí se añadirá captura de progreso de entreno actualizándose al marcar series.  
- Aquí se añadirá código con `ref` y `computed` en `entreno_form_desde_rutina_screen.vue`.

### 3.4 Gestión de estado (Pinia)

**Explicación aplicada al proyecto**  
El estado global se modela por dominio con stores específicas, evitando dispersión de lógica en componentes.

**Dónde se usa**  
- `useAutenticacionViewModel`: login, registro, sesión, logout y limpieza local.
- `useRutinasViewModel`: CRUD de rutinas y estado de rutina actual.
- `useEntrenamientosViewModel`: listado, detalle, creación, edición y borrado de entrenos.

**Por qué está bien implementado**  
Cada store encapsula estado y acciones asíncronas, con interfaz clara para la vista. Esto mejora reutilización y hace trazable el flujo de datos.

**Evidencia:**  
- Aquí se añadirá captura del listado de rutinas cargado desde store.  
- Aquí se añadirá código de una store de Pinia (estado + acciones + `computed`).

### 3.5 Props / emits

**Explicación aplicada al proyecto**  
La comunicación entre componentes sigue patrón unidireccional: datos por `props` y eventos por `emits`.

**Dónde se usa**  
- `TarjetaRutina.vue`: recibe `rutina` y emite `ver` con el `id`.
- `BaseModal.vue`: recibe `visible` y emite `cerrar`.
- `BotonPrimario.vue`: emite evento de interacción reutilizable.

**Por qué está bien implementado**  
Se evita acoplamiento entre componentes y se mantiene control explícito del flujo de interacción desde el componente padre.

**Evidencia:**  
- Aquí se añadirá captura de interacción padre-hijo (clic en tarjeta o cierre de modal).  
- Aquí se añadirá código de `defineProps` y `defineEmits` en `TarjetaRutina.vue` o `BaseModal.vue`.

### 3.6 `localStorage` / `sessionStorage`

**Explicación aplicada al proyecto**  
FitTrack diferencia persistencia estable y temporal según tipo de dato, aplicando cada storage con criterio funcional.

**Dónde se usa**  
- `localStorage`: token de sesión, preferencia de orden de rutinas, fallback local de entrenos.
- `sessionStorage`: borrador de entrenamiento en curso (`fittrack_entreno_en_curso`).

**Por qué está bien implementado**  
La persistencia coincide con el ciclo de vida del dato: lo estable permanece entre sesiones y lo temporal se conserva solo mientras dura la sesión activa.

**Evidencia:**  
- Aquí se añadirá captura del formulario de entreno recuperado tras recarga.  
- Aquí se añadirá código de `useLocalStorage.ts` y `useEntrenamientoEnCurso.ts`.

### 3.7 Slots

**Explicación aplicada al proyecto**  
Los slots se usan para componer componentes base sin duplicar estructura de marcado.

**Dónde se usa**  
- `BaseModal.vue`: slots `titulo`, `default` y `pie`.
- `BaseCard.vue`: slots `titulo`, `default` y `acciones`.
- Uso en pantallas de detalle para insertar contenido y acciones contextuales.

**Por qué está bien implementado**  
Permite reutilización real de contenedores UI manteniendo flexibilidad por contexto, con una API de componente clara.

**Evidencia:**  
- Aquí se añadirá captura de modal de confirmación con cabecera, cuerpo y acciones.  
- Aquí se añadirá código de definición y consumo de slots (`BaseModal.vue` + pantalla que lo usa).

### 3.8 Composables

**Explicación aplicada al proyecto**  
La lógica transversal se extrae a composables para evitar duplicación y mantener componentes centrados en presentación y flujo.

**Dónde se usa**  
- `useMetricasEntreno`: volumen, PR, porcentaje y comparativa con objetivo.
- `useCronometroSesion`: control de tiempo de sesión.
- `useTemporizadorDescanso`: descanso configurable y estados.
- `useEntrenamientoEnCurso`: persistencia temporal del formulario.
- `useLocalStorage` y `useFiltrosRutinas`: persistencia de preferencias y filtrado.

**Por qué está bien implementado**  
Se encapsulan responsabilidades concretas con interfaz reutilizable, lo que mejora testabilidad, mantenimiento y defensa técnica del diseño.

**Evidencia:**  
- Aquí se añadirá captura del cronómetro/descanso y resumen de métricas en el formulario de entreno.  
- Aquí se añadirá código de uno o dos composables clave (`useMetricasEntreno.ts`, `useTemporizadorDescanso.ts`).

---

## 4. Conclusión

El frontend de FitTrack cumple de forma aplicada y verificable los criterios DEW solicitados: uso de Vue 3 + TypeScript con SFC y Composition API, navegación SPA con guard, reactividad funcional, gestión de estado con Pinia, comunicación por props/emits, uso diferenciado de `localStorage` y `sessionStorage`, composición por slots y encapsulación de lógica mediante composables.

Cada criterio está integrado en casos reales de la aplicación y preparado para evidenciarse en defensa con capturas y fragmentos de código dentro de su apartado correspondiente.
# 3. Frontend (DEW)

## 1. Introducción

El frontend de FitTrack es una SPA orientada a gestionar rutinas y registrar entrenamientos en un flujo continuo de uso real: planificar, ejecutar, revisar y ajustar.

A nivel técnico, el cliente está construido con Vue 3 y TypeScript, organizado por dominios funcionales (`autenticacion`, `rutinas`, `entrenamientos`) y con una separación clara entre vista, estado, acceso a datos y modelo.

Este documento se centra exclusivamente en **DEW (Desarrollo web en entorno cliente)** y está redactado para que cada criterio pueda verificarse de forma directa en el proyecto.

---

## 2. Tecnologías utilizadas

- **Vue 3 + TypeScript:** base del frontend con tipado estático y componentes SFC.
- **Composition API:** organización de la lógica mediante `ref`, `computed`, `watch` y composables.
- **Pinia:** gestión de estado por dominios en stores desacopladas de la vista.
- **Vue Router:** navegación SPA con rutas públicas/protegidas y guard de sesión.

La selección tecnológica responde a criterios de mantenibilidad, escalabilidad y trazabilidad de evidencias en defensa.

---

## 3. Cumplimiento de criterios DEW

### 3.1 Uso de Vue + TypeScript + SFC + Composition API

El proyecto implementa componentes `.vue` con `script setup lang="ts"` en las pantallas y componentes reutilizables.  
Esto permite combinar plantilla, lógica y estilo de forma modular y tipada.

Aplicación real en FitTrack:

- Pantallas funcionales por dominio (`rutinas_screen`, `rutina_detail_screen`, `entreno_form_desde_rutina_screen`, etc.).
- Componentes reutilizables (`BotonPrimario`, `BaseCard`, `BaseModal`, `TarjetaRutina`).
- Lógica de presentación con Composition API en vistas y stores.

No se usa Vue solo como capa visual: la composición tipada se aplica al flujo funcional completo de la app.

### 3.2 Uso de Router

La navegación está centralizada en `router/index.ts` y define rutas públicas y privadas:

- Públicas: `/login`, `/registro`
- Protegidas: `/rutinas`, `/rutinas/:id`, `/entrenos`, `/entrenos/:id`, etc.
- Redirección raíz: `/` -> `/rutinas`

Además, existe un `beforeEach` que:

- Permite acceso directo a rutas públicas.
- Redirige a `/login` si no hay token en rutas protegidas.
- Ejecuta `asegurarSesion()` para validar sesión cuando hay token.
- Evita que un usuario autenticado vuelva a login/registro.

Esto demuestra control real de navegación y de acceso en cliente.

### 3.3 Reactividad (`ref`, `reactive`, `computed`)

La reactividad se usa de forma transversal:

- **Formularios:** valores de entrada (búsqueda, campos de rutina, datos por serie en entreno).
- **Estado UI:** carga, errores, modales, estados de cronómetro y descanso.
- **Derivados:** filtros ordenados, resúmenes de entreno, porcentaje completado, estados de sesión.

Ejemplos reales:

- `rutinas_screen.vue`: `ref` para búsqueda + `computed` para orden persistido.
- `entreno_form_desde_rutina_screen.vue`: `ref` para series/nota + `computed` para resúmenes y estados visuales.
- Stores Pinia: estado base con `ref` y colecciones derivadas con `computed`.

### 3.4 Gestión de estado (Pinia)

El estado global se organiza por dominio mediante stores:

- `useAutenticacionViewModel`: login, registro, sesión y logout.
- `useRutinasViewModel`: listado, detalle, crear, editar, duplicar y borrar rutinas.
- `useEntrenamientosViewModel`: listado, detalle, crear, editar y borrar entrenos.

Cada store gestiona:

- Estado reactivo (`cargando`, `error`, entidades actuales).
- Acciones asíncronas coordinadas con repositorios.
- Exposición limpia para las vistas (sin lógica de acceso a datos incrustada en plantilla).

### 3.5 Props / emits

La comunicación entre componentes se implementa con `props` y `emits` tipados:

- `TarjetaRutina.vue` recibe `rutina` por prop y emite `ver` con el `id` al padre.
- `BaseModal.vue` recibe `visible` por prop y emite `cerrar` para controlar el estado desde la pantalla contenedora.
- `BotonPrimario.vue` emite `click`, reutilizando comportamiento en distintas pantallas.

Este patrón mantiene flujo de datos unidireccional y evita acoplamiento entre componentes.

### 3.6 `localStorage` y `sessionStorage`

Se usan con objetivos diferenciados y concretos:

- **`localStorage` (persistencia estable):**
  - token de sesión (`storage.ts`),
  - preferencia de orden de rutinas (`fittrack_rutinas_orden` con `useLocalStorage`),
  - fallback de entrenos en cliente en escenarios de error puntual API.

- **`sessionStorage` (persistencia temporal de sesión):**
  - borrador de entrenamiento en curso (`useEntrenamientoEnCurso`), que sobrevive recargas pero no sesiones completas.

Esta separación demuestra criterio técnico de persistencia según ciclo de vida del dato.

### 3.7 Uso de slots

Los slots se aplican en componentes base para composición flexible:

- `BaseModal.vue`: slots `titulo`, `default` y `pie`.
- `BaseCard.vue`: slots `titulo`, `default` y `acciones`.
- `AppLayout.vue` y `BotonPrimario.vue`: slot principal para contenido.

Uso real en pantallas:

- `rutina_detail_screen.vue` y `entreno_detail_screen.vue` inyectan contenido y acciones en `BaseModal`.
- `TarjetaRutina.vue` compone `BaseCard` inyectando título y cuerpo.

Así se reutiliza estructura sin duplicar HTML ni perder control semántico.

### 3.8 Uso de composables

La lógica reutilizable se encapsula en composables especializados:

- `useMetricasEntreno`: resumen de series, volumen, PR y comparativas objetivo.
- `useCronometroSesion`: control de tiempo de sesión (inicio/pausa/reanudación/reinicio).
- `useTemporizadorDescanso`: descanso configurable con estados y formateo.
- `useEntrenamientoEnCurso`: persistencia temporal de entreno en `sessionStorage`.
- `useLocalStorage`: persistencia reactiva de preferencias del usuario.
- `useFiltrosRutinas`: búsqueda y orden de listados.

Beneficio directo: menor duplicación de lógica, mayor testabilidad y mayor claridad al defender responsabilidades por capa.

---

## 4. Evidencias prácticas

Este apartado queda preparado para añadir pruebas visuales y fragmentos de código durante la defensa.

### 4.1 Evidencia Router y guard

- Aquí se añadirá captura de navegación entre `/rutinas`, `/entrenos` y rutas de detalle.
- Aquí se añadirá captura de redirección a `/login` cuando no hay token.
- Aquí se añadirá fragmento de código de `router.beforeEach`.

### 4.2 Evidencia Pinia

- Aquí se añadirá captura de flujo de carga de rutinas/entrenos desde store.
- Aquí se añadirá código de `useRutinasViewModel` (estado + acciones).
- Aquí se añadirá código de `useAutenticacionViewModel` (sesión y logout).

### 4.3 Evidencia reactividad

- Aquí se añadirá captura de formulario de entreno con progreso en tiempo real.
- Aquí se añadirá código con `ref` y `computed` de `entreno_form_desde_rutina_screen.vue`.
- Aquí se añadirá código de resumen derivado (`useMetricasEntreno`).

### 4.4 Evidencia props/emits y slots

- Aquí se añadirá código de `TarjetaRutina` (`props` + `emit`).
- Aquí se añadirá código de `BaseModal` (slots `titulo/default/pie`).
- Aquí se añadirá captura de modal de confirmación reutilizado.

### 4.5 Evidencia storage y composables

- Aquí se añadirá código de `useLocalStorage` y su uso en orden de rutinas.
- Aquí se añadirá código de `useEntrenamientoEnCurso` con `sessionStorage`.
- Aquí se añadirá captura de recuperación de entreno en curso tras recarga.

---

## 5. Conclusión DEW

El frontend de FitTrack cumple de forma verificable los criterios principales de DEW: SPA con router y guard, desarrollo tipado con Vue 3 + TypeScript, reactividad aplicada a casos reales, gestión de estado por Pinia, comunicación entre componentes mediante props/emits, uso efectivo de slots, persistencia diferenciada en `localStorage` y `sessionStorage`, y composición de lógica mediante composables.
