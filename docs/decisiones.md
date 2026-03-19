# Decisiones técnicas

## Vue 3 + TypeScript

Se optó por Vue 3 con TypeScript para construir un frontend moderno y mantenible, con tipado fuerte y una arquitectura de componentes clara.

## Composition API

La Composition API permite una mejor separación de la lógica y una mayor escalabilidad de los componentes.

## Laravel

Laravel se eligió para implementar la API REST del backend por su ecosistema maduro, validación integrada, migraciones y herramientas de autenticación.

## Estructura monorepo

Frontend, backend, documentación y configuración de despliegue se mantienen en el mismo repositorio para simplificar el desarrollo y el despliegue.

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
- Formularios con `<label>` asociados a sus campos (login, formularios de rutina y entreno).
- Modal base con `role="dialog"` y `aria-modal="true"`, más un título dentro del slot `titulo`.
- Estados de error marcados con color y `role="alert"` en mensajes importantes.
- Estados de foco visibles (`focus-visible`) en botones, enlaces de navegación y enlaces de listas, usando `ring` de Tailwind.

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
