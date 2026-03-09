# Seguimiento de Entrenamiento (Gym Tracker) — Frontend

Frontend en **Vue 3 + TypeScript + Vite** con arquitectura **MVVM** por funcionalidades. Sin backend: datos mock con persistencia opcional en `localStorage`. Preparado para conectar una API real más adelante.

## Cómo arrancar

```bash
cd front
npm install
npm run dev
```

Abre la URL que muestre Vite (por ejemplo `http://localhost:5173`).

## Credenciales demo

- **Email:** `admin@demo.com`
- **Contraseña:** `1234`

Si no hay token en `localStorage`, la app redirige a `/login`. Tras iniciar sesión con las credenciales anteriores se guarda el token y se redirige a Rutinas.

## Estructura MVVM

- **view:** pantallas `.vue` que solo pintan UI y llaman a acciones del ViewModel.
- **viewmodel:** stores de Pinia (estado + acciones); las pantallas usan estos stores.
- **data:** capa de datos: `*_api.ts` (mock o futura API) y `*_repositorio.ts` que la consumen.
- **model:** tipos/interfaces en `entidades.ts` por módulo.

Cada funcionalidad vive en `src/funcionalidades/<nombre>/` con subcarpetas `view/`, `viewmodel/`, `data/` y `model/`.

## Estructura de carpetas (resumen)

```
src/
  main.ts
  App.vue
  router/index.ts
  nucleo/
    red/cliente_api.ts       # Axios config (para API real)
    almacenamiento/storage.ts # Token en localStorage
  compartido/ui/
    AppLayout.vue            # Layout con nav (Rutinas, Entrenos, Salir)
    BotonPrimario.vue
  funcionalidades/
    autenticacion/   # view, viewmodel, data, model
    rutinas/         # view (pantallas), viewmodel, data, model
    entrenamientos/  # view (pantallas), viewmodel, data, model
```

## Rutas

| Ruta | Pantalla |
|------|----------|
| `/login` | Login (si no hay token, el guard manda aquí) |
| `/rutinas` | Lista de rutinas |
| `/rutinas/nueva` | Crear rutina (nombre + ejercicios + series objetivo) |
| `/rutinas/:id` | Detalle rutina + botón "Registrar entreno" |
| `/entrenos` | Histórico de entrenos |
| `/entrenos/nuevo/:rutinaId` | Registrar entreno desde una rutina (editar reps/peso por serie) |
| `/entrenos/:id` | Detalle de un entreno |

## Tecnologías

- Vue 3 (Composition API), TypeScript, Vite
- Vue Router (guard: sin token → `/login`)
- Pinia (estado global por módulo)
- TailwindCSS (estilos)
- Axios (cliente en `nucleo/red`; de momento no se usa, solo mock)

## Conectar API real más adelante

1. Sustituir las implementaciones en `*_api.ts` por llamadas al cliente en `nucleo/red/cliente_api.ts`.
2. El `cliente_api` ya lee el token de `localStorage` y lo envía en `Authorization` si se configura un interceptor.
3. Los repositorios y viewmodels no cambian de interfaz; solo cambia de dónde obtienen los datos.
