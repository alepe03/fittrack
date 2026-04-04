# Decisiones técnicas

## Vue 3 + TypeScript

Se optó por Vue 3 con TypeScript para construir un frontend moderno y mantenible, con tipado fuerte y una arquitectura de componentes clara.

## Composition API

La Composition API permite una mejor separación de la lógica y una mayor escalabilidad de los componentes.

## Laravel
Laravel se eligió para implementar la API REST del backend por su ecosistema maduro (migraciones, Eloquent/relaciones, validación y transacciones), usando PostgreSQL como motor de base de datos.

## API REST
Se decidió exponer una API REST con endpoints claros para CRUD y operaciones específicas del dominio de rutinas:
- listado y detalle
- crear rutina completa
- actualizar por reemplazo total
- borrar por cascada en base de datos
- duplicar rutina

## Payload anidado en `rutinas`
Para mantener la implementación simple y coherente con el formulario del frontend, la API de `rutinas` recibe un payload anidado:
- `rutina`
- lista de `ejercicios` (plantilla)
- lista de `series` dentro de cada ejercicio

Esto evita lógica de “diferencias/diff” y hace que la creación/edición sea robusta para formularios dinámicos.

## Update por reemplazo completo
La actualización (`PUT /api/rutinas/{id}`) está implementada como reemplazo total:
- se actualiza el registro base de la rutina
- se borran los ejercicios/series actuales asociados a esa rutina
- se recrean los nuevos ejercicios/series recibidos

La decisión favorece claridad, robustez y rapidez de implementación frente a una sincronización incremental compleja.

## `user_id` fijo temporal (sin auth real)
Como el backend todavía no tiene autenticación real integrada, el frontend usa temporalmente `user_id = 1` al crear/actualizar rutinas. Esta decisión se documenta como parte del alcance y se revisará cuando exista auth real.

## Decisiones de frontend (arquitectura simple)
Se mantiene una organización clara por capas dentro del módulo:
- `data/`: repositorio y acceso a API (mock en entrenos; API real en rutinas)
- `model/`: interfaces tipadas
- `viewmodel/`: stores Pinia (estado + operaciones)
- `view/pantallas`: SFCs que renderizan y llaman a las operaciones

Además, se usan composables para persistencias (localStorage/sessionStorage) y utilidades (filtros/orden).

## Estructura monorepo

Frontend, backend, documentación y configuración de despliegue se mantienen en el mismo repositorio para simplificar el desarrollo y el despliegue.

## Docker (Compose + Nginx + PHP-FPM)

Se eligió un stack de **cuatro servicios** (PostgreSQL, PHP-FPM, Nginx del API, Nginx del frontend) definido en `deploy/docker-compose.yml` para poder levantar la aplicación sin instalar el stack completo en el sistema anfitrión. El frontend proxifica `/api/` hacia el Nginx del backend para unificar origen en el navegador y acercar el entorno a un despliegue por capas (web → aplicación → datos).

## CI con GitHub Actions

Se añadió un workflow de **integración continua** (`.github/workflows/ci.yml`) que valida en cada cambio relevante en `main`/`develop` que el frontend compila, que los tests del backend pasan y que la documentación MkDocs construye en modo estricto. La motivación es detectar regresiones de forma automática y ofrecer una prueba objetiva de calidad en la entrega, sin confundir CI con despliegue de la app.

## Documentación en GitHub Pages

La documentación del proyecto se genera con **MkDocs (Material)** y se publica con **GitHub Actions** hacia **GitHub Pages** (workflow dedicado, distinto del CI de la app). Solo el sitio estático de docs se despliega automáticamente en `main` según el criterio de rutas del workflow; la aplicación Vue/Laravel en Docker **no** se publica así automáticamente a un hosting remoto.

## Diseño de interfaces (DOR)

### Framework CSS y línea visual

Para el diseño de la interfaz se ha optado por **Tailwind CSS** integrado en Vite.  
La línea visual es sobria y centrada en la legibilidad:

- Fondo gris claro para la app (`bg-gray-100`) y tarjetas/modales en blanco.
- Color principal azul (`bg-blue-600`, `hover:bg-blue-700`) para acciones importantes.
- Grises (`text-gray-600/800`) para textos y estados secundarios.
- Rojo (`text-red-600`, `bg-red-600`) para errores y acciones destructivas.

### Responsive

El layout se ha diseñado mobile-first y luego se han ajustado los contenedores con Tailwind:

- Contenedores centrados con `max-w-md` en formularios y `max-w-3xl` / `lg:max-w-4xl` / `xl:max-w-5xl` en el contenido principal.
- Uso de `flex` y `flex-wrap` en la cabecera para que los enlaces de navegación y el botón de salir se adapten bien en móvil y escritorio.
- Listados (rutinas, entrenos) en una sola columna, lo que funciona correctamente en móvil y sigue siendo legible en pantallas grandes.

### Accesibilidad

Se han aplicado mejoras básicas alineadas con WCAG:

- Colores con contraste suficiente (texto oscuro sobre fondo claro, botones azules sobre blanco).
- Formularios con `<label>` asociados a sus campos (visibles o `sr-only`) en login, filtros de rutinas y formularios de rutina/entreno.
- Modal base con `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.
- Modal con cierre por tecla `Escape`, foco inicial al abrir, devolución de foco al cerrar y focus trap básico.
- Estados de error marcados con color y `role="alert"` en mensajes importantes.
- Estados de foco visibles (`focus-visible`) en botones, enlaces de navegación y enlaces de listas, usando `ring` de Tailwind.

Evidencias principales en código:
- `front/src/compartido/ui/BaseModal.vue`
- `front/src/funcionalidades/rutinas/view/pantallas/rutinas_screen.vue`
- `front/src/funcionalidades/rutinas/view/pantallas/rutina_form_screen.vue`
- `front/src/funcionalidades/entrenamientos/view/pantallas/entreno_form_desde_rutina_screen.vue`
- `front/index.html`

### Usabilidad

Algunos criterios aplicados:

- Acciones principales (por ejemplo “Entrar”, “Nueva rutina”, “Registrar entreno”, “Guardar”) usan siempre el componente `BotonPrimario`, lo que da coherencia visual.
- Acciones secundarias (por ejemplo “Cancelar”, “Editar”, “Duplicar”) usan botones con borde gris y fondo neutro.
- Cada pantalla tiene un `h1` claro (“Iniciar sesión”, “Rutinas”, “Entrenos”, “Registrar entreno”), lo que ayuda a la jerarquía visual.
- Estados vacíos con mensajes orientativos en listados de rutinas y entrenos.

Esta parte de DOR se puede defender enseñando:

- El layout (`AppLayout.vue`) para ver el uso de Tailwind y el comportamiento responsive.
- El botón primario (`BotonPrimario.vue`) y los estados de foco.
- El modal (`BaseModal.vue`) con sus atributos de accesibilidad.
- Las pantallas principales en modo responsive (login, rutinas, entrenos y registro de entreno).

## Implementado vs futuro (DOR)

Implementado actualmente:
- Base responsive mobile-first con Tailwind.
- Accesibilidad básica operativa en formularios y modal.
- Consistencia visual de acciones primarias/secundarias.

Futuro recomendado:
- Auditoría WCAG más profunda (teclado y lector de pantalla con checklist formal).
- Tokens de diseño (colores/espaciado) más explícitos.
