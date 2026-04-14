# 4. Backend

## 1. Stack backend

El backend de FitTrack está construido con **Laravel** sobre **PostgreSQL**, siguiendo un enfoque de **API REST** como capa de comunicación con el frontend.

Esta combinación permite:

- estructurar la lógica de negocio de forma mantenible,
- modelar relaciones de datos de forma consistente,
- exponer operaciones claras para el flujo funcional del MVP.

No se trata solo de “tener endpoints”, sino de sostener una arquitectura coherente con el dominio de rutinas que la aplicación necesita en esta fase.

---

## 2. Diseño de la API

La API tiene como responsabilidad principal gestionar el dominio de **rutinas de entrenamiento** y servir al frontend una interfaz estable para listar, consultar y modificar información.

Está organizada alrededor del recurso `rutinas`, con operaciones que cubren su ciclo de vida completo.

El estilo REST se adopta porque:

- favorece contratos simples y predecibles,
- separa claramente operaciones de lectura y escritura,
- encaja de forma natural con la estructura de navegación y formularios del frontend.

En defensa, esta elección se justifica por claridad, trazabilidad y facilidad de evolución.

---

## 3. Endpoints principales

Base funcional: `/api/rutinas`

- **GET `/rutinas`**  
  Devuelve el listado de rutinas para la vista principal. Su objetivo es ofrecer una entrada rápida al flujo de planificación.

- **GET `/rutinas/{id}`**  
  Devuelve el detalle de una rutina concreta, incluyendo su estructura de ejercicios y series objetivo para consulta y edición.

- **POST `/rutinas`**  
  Crea una rutina completa en una sola operación. Permite persistir de forma coherente la estructura definida en el formulario.

- **PUT `/rutinas/{id}`**  
  Actualiza una rutina existente con enfoque de reemplazo completo de su contenido estructural, manteniendo consistencia entre lo que edita el usuario y lo que queda guardado.

- **DELETE `/rutinas/{id}`**  
  Elimina una rutina y su estructura dependiente cuando deja de formar parte de la planificación del usuario.

- **POST `/rutinas/{id}/duplicar`**  
  Genera una copia de la rutina para reutilizar planificación sin reconstruirla desde cero. Es una operación funcional de producto, no un simple CRUD genérico.

Cada endpoint responde a una necesidad real del flujo de usuario definido en el MVP.

---

## 4. Modelo de datos

El modelo distingue entre información de **plantilla** (planificación) e información de **histórico** (registro de ejecución):

### Tablas principales de plantilla

- `rutinas`
- `rutina_ejercicios`
- `rutina_series`

### Tablas de histórico

- `entrenos`
- `entreno_ejercicios`
- `entreno_series`

### Relaciones y reglas de integridad

- `rutinas` se relaciona con sus ejercicios, y estos con sus series.
- En la parte de plantilla se aplican borrados en cascada para mantener consistencia estructural.
- En la parte histórica se contempla conservación del registro mediante relaciones que permiten mantener trazabilidad cuando la plantilla cambia o desaparece.

### Plantilla vs histórico (sentido funcional)

La plantilla representa “cómo se planifica entrenar”; el histórico representa “qué se realizó realmente”.  
Esta separación evita mezclar planificación con ejecución y permite evolucionar el sistema sin perder coherencia del dato.

---

## 5. Decisiones técnicas

Las decisiones principales del backend están orientadas a mantener coherencia funcional con el frontend:

- **Payload anidado**  
  La rutina se envía con su estructura completa (ejercicios y series), lo que reduce fricción entre formulario y persistencia.

- **Uso de transacciones**  
  En operaciones de creación/edición compleja se garantiza atomicidad para evitar estados intermedios inconsistentes.

- **Actualización por reemplazo (`PUT`)**  
  Se prioriza consistencia final del recurso frente a una lógica incremental más compleja y propensa a errores en formularios dinámicos.

- **Coherencia con frontend**  
  El contrato de API refleja el flujo real de uso de la aplicación, facilitando trazabilidad y defensa técnica del sistema completo.

---

## 6. Estado actual

### ✅ Implementado

- API REST del módulo de rutinas operativa.
- Modelo de datos de rutinas integrado y funcional.
- Flujo end-to-end de rutinas validado junto con frontend y base de datos.

### ⚠️ Parcial

- Estructura de entrenamientos presente en modelo de datos, pero sin integración completa del flujo REST consumido por frontend en esta fase.
- Autenticación backend real todavía no integrada en el alcance actual.

### 🚀 Futuro

- Completar endpoints de entrenamientos y su integración total.
- Incorporar autenticación robusta y protección de operaciones de API.
- Ampliar capacidades de análisis sobre el histórico de entrenos.
