# Auditoría DEW - FitTrack

## 1. Vue + TypeScript + SFC + Composition API
- **Estado:** CUMPLE
- **Archivos:**
  - `front/package.json` (vue ^3.5.25, typescript ^5.9.3, @vitejs/plugin-vue)
  - `front/tsconfig.json`, `front/tsconfig.app.json` (paths, strict, include .vue)
  - Todos los `.vue` en `front/src/`: `App.vue`, `AppLayout.vue`, `BaseCard.vue`, `BaseModal.vue`, `BotonPrimario.vue`, `TarjetaRutina.vue`, y todas las pantallas en `funcionalidades/*/view/pantallas/*.vue`
- **Evidencia:**
  - Cada componente usa `<script setup lang="ts">` y Composition API (no hay `data()`, `methods` ni Options API).
  - Ejemplo `App.vue`: `import { computed } from 'vue'` y `const usarLayout = computed(...)`.
  - Ejemplo `login_screen.vue`: `import { ref, reactive } from 'vue'` y `const form = reactive({ email: '', password: '' })`.
- **Observaciones:** Ninguna. El proyecto está íntegramente en Vue 3 + TypeScript + SFC + Composition API.

---

## 2. SPA / página no continua
- **Estado:** CUMPLE
- **Archivos:**
  - `front/index.html`: un único `<div id="app"></div>` y un solo script de entrada.
  - `front/src/main.ts`: `createApp(App).use(router).mount('#app')`.
  - `front/src/App.vue`: un único árbol con `<RouterView />` (con o sin `AppLayout`).
  - `front/src/router/index.ts`: todas las rutas cargan componentes mediante `component: () => import(...)` (lazy load), sin recargas de página.
- **Evidencia:**
  - `App.vue`: `<AppLayout v-if="usarLayout"><RouterView /></AppLayout>` y `<RouterView v-else />`. Una sola instancia de la app y la navegación se hace por rutas.
  - No existe más de un documento HTML ni enlaces que recarguen la página.
- **Observaciones:** Ninguna. Es una SPA clara.

---

## 3. Vue Router
- **Estado:** CUMPLE
- **Archivos:**
  - `front/src/router/index.ts` (definición de rutas y guard).
  - `front/src/main.ts` (`app.use(router)`).
  - Pantallas que usan `useRouter()` y/o `useRoute()`: `App.vue`, `login_screen.vue`, `rutinas_screen.vue`, `rutina_detail_screen.vue`, `rutina_form_screen.vue`, `entreno_form_desde_rutina_screen.vue`, `AppLayout.vue`.
  - Uso de `RouterLink`: `AppLayout.vue`, `entrenos_screen.vue`.
- **Evidencia:**
  - Router: `createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes: [...] })` con rutas `/login`, `/rutinas`, `/rutinas/nueva`, `/rutinas/:id/editar`, `/rutinas/:id`, `/entrenos`, `/entrenos/nuevo/:rutinaId`, `/entrenos/:id`, y redirect `/` → `/rutinas`.
  - Guard: `router.beforeEach((to, _from, next) => { ... if (!token && !to.meta.publica) next('/login'); else next() })`.
  - Navegación: `router.push('/rutinas')`, `router.push(\`/rutinas/${id}\`)`, etc. en pantallas; `RouterLink to="/rutinas"` en layout.
- **Observaciones:** Ninguna.

---

## 4. Reactividad (ref, reactive, computed)
- **Estado:** CUMPLE
- **Archivos:**
  - **ref:** `login_screen.vue` (enviado), `rutinas_screen.vue` (textoBusqueda, ordenRef vía useLocalStorage), `rutina_detail_screen.vue` (mostrarModalBorrar), `rutina_form_screen.vue` (nombreRutina, ejercicios, errorValidacion), `entreno_form_desde_rutina_screen.vue` (items, errorValidacion), y los tres viewmodels Pinia (cargando, error, rutinas/entrenos, rutinaActual/entrenoActual).
  - **reactive:** `login_screen.vue`: `const form = reactive({ email: '', password: '' })`.
  - **computed:** `App.vue` (usarLayout), `rutinas_screen.vue` (orden get/set, rutinasFiltradasYOrdenadas vía useFiltrosRutinas), `rutina_detail_screen.vue` (id), `rutina_form_screen.vue` (idEditar, esEdicion), `entreno_form_desde_rutina_screen.vue` (rutinaId, nombreRutina), `entreno_detail_screen.vue` (id). En stores: rutinasLista, entrenosLista, estaLogueado. En `useFiltrosRutinas.ts`: rutinasFiltradasYOrdenadas.
- **Evidencia:**
  - `login_screen.vue` líneas 10-11: `const form = reactive({ email: '', password: '' })` y `const enviado = ref(false)`.
  - `rutinas_viewmodel.ts` líneas 11-16: `const cargando = ref(...)`, `const rutinas = ref<Rutina[]>(...)`, `const rutinasLista = computed(() => rutinas.value)`.
  - `App.vue` línea 8: `const usarLayout = computed(() => route.path !== '/login')`.
- **Observaciones:** Los tres (ref, reactive, computed) están usados de forma clara y en varios sitios.

---

## 5. localStorage
- **Estado:** CUMPLE
- **Archivos:**
  - `front/src/nucleo/almacenamiento/storage.ts`: token (obtenerToken, guardarToken, borrarToken).
  - `front/src/compartido/composables/useLocalStorage.ts`: composable genérico reactivo para una clave.
  - `front/src/funcionalidades/rutinas/view/pantallas/rutinas_screen.vue`: uso de useLocalStorage para la clave `fittrack_rutinas_orden` (orden de listado: az, za, recientes).
  - `front/src/funcionalidades/rutinas/data/rutinas_api.ts`: consumo HTTP (API real) y mapeo de payload para el módulo rutinas.
  - `front/src/funcionalidades/entrenamientos/data/entrenamientos_api.ts`: persistencia mock con su clave.
  - `front/src/nucleo/red/cliente_api.ts`: lectura del token para el header Authorization.
- **Evidencia:**
  - `storage.ts` líneas 7-12: `return localStorage.getItem(CLAVE_TOKEN)`, `localStorage.setItem(CLAVE_TOKEN, token)`, `localStorage.removeItem(CLAVE_TOKEN)`.
  - `useLocalStorage.ts` líneas 19, 32, 41: `localStorage.getItem(clave)`, `localStorage.setItem(clave, v)`.
  - `rutinas_screen.vue` líneas 14 y 5-6: comentario "Preferencia de orden persistida en localStorage (criterio DEW)" y `const { valor: ordenRef } = useLocalStorage<OrdenRutinas>('fittrack_rutinas_orden', 'az')`.
- **Observaciones:** Uso explícito para criterio DEW en preferencia de orden y token. APIs: rutinas consumen API real; entrenos siguen con persistencia mock en el lado cliente.

---

## 6. sessionStorage
- **Estado:** CUMPLE
- **Archivos:**
  - `front/src/compartido/composables/useEntrenamientoEnCurso.ts`: obtener(), guardar(datos), limpiar() usando la clave `fittrack_entreno_en_curso`.
  - `front/src/funcionalidades/entrenamientos/view/pantallas/entreno_form_desde_rutina_screen.vue`: importa y usa useEntrenamientoEnCurso; en onMounted restaura items desde sessionStorage si hay datos para la misma rutina; con watch persiste items en sessionStorage; al guardar el entreno llama limpiar().
- **Evidencia:**
  - `useEntrenamientoEnCurso.ts` líneas 19, 31, 39: `sessionStorage.getItem(CLAVE)`, `sessionStorage.setItem(CLAVE, JSON.stringify(datos))`, `sessionStorage.removeItem(CLAVE)`.
  - `entreno_form_desde_rutina_screen.vue` líneas 6 y 14: `import { useEntrenamientoEnCurso } from ...` y `const { obtener: obtenerEnCurso, guardar: guardarEnCurso, limpiar: limpiarEnCurso } = useEntrenamientoEnCurso()`. Líneas 24-26 (restaurar), 37-41 (watch guardar), 67 (limpiar al guardar).
- **Observaciones:** Uso claro: formulario de “registrar entreno” persistido en sesión (recarga mantiene datos; cierre de pestaña los borra).

---

## 7. props / emits
- **Estado:** CUMPLE
- **Archivos:**
  - `front/src/compartido/ui/TarjetaRutina.vue`: defineProps<{ rutina: Rutina }>, defineEmits<{ ver: [id: string] }>; usado en `rutinas_screen.vue` con `:rutina="r"` y `@ver="irARutina"`.
  - `front/src/compartido/ui/BotonPrimario.vue`: defineProps (type, disabled), defineEmits<{ click: [event: MouseEvent] }>; usado en login_screen, rutinas_screen, rutina_detail_screen, rutina_form_screen, entreno_form_desde_rutina_screen con @click y :disabled.
  - `front/src/compartido/ui/BaseModal.vue`: defineProps<{ visible: boolean }>, defineEmits<{ cerrar: [] }>; usado en `rutina_detail_screen.vue` con `:visible="mostrarModalBorrar"` y `@cerrar="cerrarModalBorrar"`.
  - `front/src/compartido/ui/BaseCard.vue`: solo slots (sin props de datos).
- **Evidencia:**
  - `TarjetaRutina.vue`: `const props = defineProps<{ rutina: Rutina }>()`, `const emit = defineEmits<{ ver: [id: string] }>()`, y `emit('ver', props.rutina.id)`.
  - `rutinas_screen.vue`: `<TarjetaRutina :rutina="r" @ver="irARutina" />`.
  - `BaseModal.vue`: props `visible`, emit `cerrar`.
- **Observaciones:** Props y emits usados de forma explícita y tipada en componentes reutilizables.

---

## 8. Pinia
- **Estado:** CUMPLE
- **Archivos:**
  - `front/src/main.ts`: `import { createPinia } from 'pinia'` y `app.use(createPinia())`.
  - `front/src/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel.ts`: defineStore('autenticacion', () => { ... }).
  - `front/src/funcionalidades/rutinas/viewmodel/rutinas_viewmodel.ts`: defineStore('rutinas', () => { ... }).
  - `front/src/funcionalidades/entrenamientos/viewmodel/entrenamientos_viewmodel.ts`: defineStore('entrenamientos', () => { ... }).
  - Uso en pantallas: login_screen (useAutenticacionViewModel), rutinas_screen y rutina_detail_screen y rutina_form_screen (useRutinasViewModel), entrenos_screen y entreno_detail_screen y entreno_form_desde_rutina_screen (useEntrenamientosViewModel y en el formulario también useRutinasViewModel). AppLayout (useAutenticacionViewModel).
- **Evidencia:**
  - `main.ts` líneas 2 y 8: `import { createPinia } from 'pinia'`, `app.use(createPinia())`.
  - `rutinas_viewmodel.ts` líneas 4 y 10: `import { defineStore } from 'pinia'`, `export const useRutinasViewModel = defineStore('rutinas', () => { ... return { cargando, error, rutinasLista, rutinaActual, cargarRutinas, ... } })`.
  - Stores usan Composition API (ref, computed) dentro del setup de Pinia.
- **Observaciones:** Ninguna. Tres stores claros y usados en toda la app.

---

## 9. slots
- **Estado:** CUMPLE
- **Archivos:**
  - `front/src/compartido/ui/BaseCard.vue`: slots nombrados `titulo`, default, `acciones` (con `v-if="$slots.titulo"` etc.).
  - `front/src/compartido/ui/BaseModal.vue`: slots `titulo`, default, `pie`.
  - `front/src/compartido/ui/BotonPrimario.vue`: `<slot />` para el contenido del botón.
  - `front/src/compartido/ui/AppLayout.vue`: `<slot />` para el contenido principal.
  - Uso de slots: `TarjetaRutina.vue` usa BaseCard con `<template #titulo>` y `<template #default>`. `rutina_detail_screen.vue` usa BaseCard con `#titulo` y `#default` (lista de ejercicios) y BaseModal con `#titulo`, contenido por defecto y `#pie` (botones).
- **Evidencia:**
  - `BaseCard.vue` líneas 10-17: `<slot name="titulo" />`, `<slot />`, `<slot name="acciones" />`.
  - `BaseModal.vue` líneas 29, 32, 35: `<slot name="titulo" />`, `<slot />`, `<slot name="pie" />`.
  - `TarjetaRutina.vue`: `<BaseCard>` con `<template #titulo>` y `<template #default>`.
  - `rutina_detail_screen.vue` líneas 82-105 (BaseCard con #titulo y #default) y 107-131 (BaseModal con #titulo, párrafo, #pie).
- **Observaciones:** Slots nombrados y default usados de forma clara en componentes base y en pantallas.

---

## 10. composables
- **Estado:** CUMPLE
- **Archivos:**
  - `front/src/compartido/composables/useLocalStorage.ts`: función useLocalStorage(clave, valorInicial) que devuelve { valor, guardar } con ref y sincronización a localStorage.
  - `front/src/compartido/composables/useEntrenamientoEnCurso.ts`: useEntrenamientoEnCurso() con obtener, guardar, limpiar usando sessionStorage.
  - `front/src/compartido/composables/useFiltrosRutinas.ts`: useFiltrosRutinas(rutinas, textoBusqueda, orden) que devuelve { rutinasFiltradasYOrdenadas } (computed).
  - Uso: useLocalStorage y useFiltrosRutinas en `rutinas_screen.vue`; useEntrenamientoEnCurso en `entreno_form_desde_rutina_screen.vue`.
- **Evidencia:**
  - `rutinas_screen.vue` líneas 5-6 y 14 y 22-26: `import { useLocalStorage } from ...`, `import { useFiltrosRutinas, type OrdenRutinas } from ...`, `const { valor: ordenRef } = useLocalStorage<OrdenRutinas>('fittrack_rutinas_orden', 'az')`, `const { rutinasFiltradasYOrdenadas } = useFiltrosRutinas(...)`.
  - `entreno_form_desde_rutina_screen.vue` líneas 6 y 14: `import { useEntrenamientoEnCurso } from ...`, `const { obtener: obtenerEnCurso, guardar: guardarEnCurso, limpiar: limpiarEnCurso } = useEntrenamientoEnCurso()`.
- **Observaciones:** Tres composables distintos, todos usados en pantallas reales.

---

## 11. documentación
- **Estado:** CUMPLE
- **Archivos:**
  - `front/README.md`: cómo arrancar, credenciales demo, estructura MVVM, carpetas, rutas, tecnologías, cómo conectar API real.
  - `docs/dew-frontend.md`: documento específico para DEW con tabla de criterios, dónde se cumple cada uno, componentes/stores/composables, uso de localStorage/sessionStorage y conclusión.
  - Otros en `docs/`: `arquitectura.md`, `decisiones.md`, `requisitos.md`, `frontend-mvp.md`, `mvp.md`, `index.md`.
- **Evidencia:**
  - README describe Vue 3 + TypeScript + Vite, MVVM, rutas, token en localStorage, estructura de carpetas.
  - `docs/dew-frontend.md` sección 3 detalla archivo a archivo el cumplimiento de cada criterio DEW y sección 8 concluye que el frontend cumple todos los criterios.
- **Observaciones:** Documentación suficiente para entrega y defensa; `dew-frontend.md` es muy útil para el revisor.

---

## 12. defensa técnica del proyecto
- **Estado:** CUMPLE (con recomendaciones menores)
- **Puntos fuertes para defenderlo:**
  - Estructura por funcionalidades (autenticación, rutinas, entrenamientos) con view/viewmodel/data/model.
  - Uso consistente de Composition API, TypeScript y SFC en todos los componentes.
  - Router con guard de autenticación y rutas parametrizadas.
  - Tres stores Pinia con responsabilidades claras y usados en todas las pantallas.
  - Tres composables reutilizables (localStorage, sessionStorage, filtros) con uso real.
  - Componentes base (BaseCard, BaseModal, BotonPrimario, TarjetaRutina, AppLayout) con slots y props/emits bien definidos.
  - Documentación DEW explícita en `docs/dew-frontend.md` que enlaza criterios con archivos y fragmentos.
- **Puntos débiles o dudas:**
  - El slot `acciones` de BaseCard no se usa en ningún componente (solo titulo y default); es opcional y válido, pero en defensa se puede aclarar que está para reutilización futura.
- **Qué conviene preparar para explicarlo mejor:**
  - Tener abierto `docs/dew-frontend.md` y el README del front para guiar al revisor.
  - Saber explicar en una frase: “Orden de rutinas en localStorage, formulario de entreno en curso en sessionStorage”.

---

## Conclusión final

- **¿Está listo para entregar?** Sí. El proyecto cumple todos los requisitos DEW revisados y la documentación permite comprobarlo.
- **¿Qué faltaría corregir si aplica?**
  - No es obligatorio corregir nada para el cumplimiento de criterios. Se recomienda:
    1. (Opcional) Si se quiere mostrar el slot `acciones` de BaseCard en defensa, usarlo en alguna pantalla (por ejemplo en `TarjetaRutina` o en detalle de rutina); si no, dejar como está y explicar que es extensión futura.
- **Lista final de mejoras recomendadas, ordenadas por prioridad:**
  1. Revisar que en la entrega figure como documentación principal del front DEW el archivo `docs/dew-frontend.md` (o un enlace desde el README del front).
  2. (Opcional) Añadir en README del front una línea tipo: “Cumplimiento criterios DEW: ver docs/dew-frontend.md”.

---

## Tabla resumen

| Requisito | Estado | Archivos principales | Comentario corto |
|-----------|--------|----------------------|------------------|
| Vue + TypeScript + SFC + Composition API | CUMPLE | Todos los .vue en src/, package.json, tsconfig | script setup lang="ts" y Composition API en todo el front |
| SPA / página no continua | CUMPLE | index.html, main.ts, App.vue, router/index.ts | Una sola app y RouterView; navegación sin recarga |
| Vue Router | CUMPLE | router/index.ts, main.ts, pantallas, AppLayout | Rutas, guard, useRouter/useRoute, RouterLink |
| Reactividad (ref, reactive, computed) | CUMPLE | login_screen (reactive), stores, pantallas, useFiltrosRutinas | ref y computed en stores y vistas; reactive en formulario login |
| localStorage | CUMPLE | storage.ts, useLocalStorage.ts, rutinas_screen, cliente_api | Token (simulado) y preferencia de orden de rutinas; rutinas consumen API real; entrenos siguen con persistencia mock |
| sessionStorage | CUMPLE | useEntrenamientoEnCurso.ts, entreno_form_desde_rutina_screen.vue | Entreno en curso: guardar/restaurar/limpiar en formulario |
| props / emits | CUMPLE | TarjetaRutina, BotonPrimario, BaseModal; rutinas_screen, rutina_detail_screen, etc. | Props y emits tipados en componentes reutilizables |
| Pinia | CUMPLE | main.ts, autenticacion_viewmodel, rutinas_viewmodel, entrenamientos_viewmodel | Tres stores con setup function; usados en todas las pantallas |
| slots | CUMPLE | BaseCard, BaseModal, BotonPrimario, AppLayout; TarjetaRutina, rutina_detail_screen | Slots nombrados y default; uso en tarjetas y modal |
| composables | CUMPLE | useLocalStorage, useEntrenamientoEnCurso, useFiltrosRutinas; rutinas_screen, entreno_form_desde_rutina_screen | Tres composables usados en pantallas |
| documentación | CUMPLE | front/README.md, docs/dew-frontend.md, docs/arquitectura.md, etc. | README y documento DEW detallado con criterios y archivos |
| defensa técnica | CUMPLE | docs/dew-frontend.md, estructura del proyecto | Doc DEW lista para defensa y alineada con componentes reales |
