# 2. Funcionalidades de la aplicación

Esta sección describe el funcionamiento real actual de FitTrack desde una perspectiva funcional. El objetivo es mostrar qué puede hacer hoy el usuario, cómo se conectan los módulos y qué evolución se ha añadido sobre el núcleo inicial del MVP.

## Flujo principal de uso

El flujo recomendado de la aplicación es:

1. Registro o inicio de sesión.
2. Creación de una rutina con ejercicios y series objetivo.
3. Inicio de un entrenamiento desde el detalle de una rutina.
4. Registro de resultados por serie (reps, peso, estado y métricas de intensidad según plan).
5. Guardado y consulta del resumen/detalle del entrenamiento.
6. Revisión de métricas en la pantalla **Mi progreso**.
7. Gestión del plan en **Suscripción** (upgrade o cancelación simulada).

Este flujo cubre planificación, ejecución, seguimiento y mejora continua.

---

## Autenticación y sesión

FitTrack implementa autenticación con token y rutas privadas:

- **Registro** de cuenta con nombre, email y contraseña.
- **Login** con email y contraseña.
- **Logout** desde el menú de cuenta.
- **Sesión persistente** mediante token guardado en cliente.
- **Carga de sesión** al navegar por rutas privadas (`/auth/me`).
- **Rutas protegidas**: todo salvo `/login` y `/registro` requiere sesión válida.

No hay flujo de recuperación de contraseña por email en la interfaz actual.

---

## Gestión de rutinas

El módulo de rutinas es el punto de entrada funcional para entrenar:

- Crear rutina con:
  - nombre,
  - lista de ejercicios,
  - series objetivo por ejercicio (reps y peso sugerido).
- Editar rutina existente.
- Eliminar rutina.
- Duplicar rutina (crea copia reutilizable).
- Ver detalle completo de la rutina.

Desde el detalle se puede lanzar directamente el registro de entreno.

---

## Registro de entrenamientos

El entrenamiento se crea a partir de una rutina y permite registrar ejecución real:

- Precarga automática de ejercicios/series objetivo.
- Registro por serie:
  - reps,
  - peso,
  - estado `completada`,
  - RPE/RIR (según plan).
- Cronómetro general de sesión.
- Nota general del entreno.
- Resumen previo al guardado (series, volumen, PR, duración, descanso configurado).
- Guardado en backend y navegación al detalle del entreno.

Además, el formulario mantiene **autoguardado en curso** en `sessionStorage` para evitar pérdida de datos en recargas.

---

## Descanso entre series

El descanso está integrado en la pantalla de entreno con un enfoque operativo:

- Configuración superior del tiempo de descanso (presets y personalizado).
- Inicio del descanso desde cada serie.
- Visualización en una **tarjeta flotante** con:
  - serie activa,
  - tiempo restante,
  - estado.
- Controles directos:
  - pausar,
  - reanudar,
  - reiniciar,
  - cerrar.
- Tarjeta arrastrable con reset de posición por doble clic.
- Solo puede haber **un descanso activo a la vez**.

---

## Marcas personales (PRs)

Las PRs se gestionan de forma automática:

- Se calculan en backend al guardar/actualizar entrenos.
- Se comparan con histórico previo del usuario.
- Se basan en combinación de peso y repeticiones (solo series completadas).
- Se persisten por serie y se devuelven en el detalle del entreno.

En frontend se muestran:

- en el detalle del entrenamiento (badge PR por serie y total),
- y en la pantalla de progreso (totales y mejor logro reciente).

---

## Sistema Free y Premium

La aplicación distingue capacidades por plan:

- **Free**
  - hasta 3 rutinas,
  - sin funciones avanzadas de descanso y RIR.
- **Premium**
  - rutinas ilimitadas,
  - funciones avanzadas de descanso e intensidad.

Gestión del plan:

- pantalla de suscripción con comparativa de planes,
- upgrade simulado con modal de pago,
- cancelación de Premium a Free.

Las restricciones se validan tanto en frontend (UX) como en backend (seguridad funcional).

---

## Perfil de usuario

La pantalla de perfil permite:

- editar datos personales (nombre y email),
- cambiar contraseña actual por una nueva.

Incluye validaciones, mensajes de error por campo y confirmación de éxito.

---

## Pantalla “Mi progreso”

La pantalla de progreso resume evolución y constancia con datos reales de entrenos/rutinas:

- total de entrenamientos,
- total de rutinas,
- total de series completadas,
- total de PRs conseguidos,
- último entrenamiento realizado,
- ejercicio destacado (por PRs o progreso),
- mejor logro reciente (con detalle de PR),
- constancia (días entrenados y racha simple),
- logros desbloqueables/pendientes.

Incluye estado vacío cuando todavía no hay entrenamientos y limita el cálculo avanzado a una muestra reciente para mantener rendimiento.

---

## Navegación general

La navegación principal conecta todos los módulos clave:

- **Rutinas**: planificación y acceso a registrar entrenos.
- **Entrenos**: histórico y detalle de sesiones.
- **Suscripción**: gestión de plan.
- **Mi progreso**: métricas y logros.
- **Mi perfil**: cuenta y seguridad.

Relación funcional entre pantallas:

- Rutina -> Registrar entreno -> Detalle entreno -> Progreso.
- Suscripción y Perfil complementan gestión de cuenta.

---

## MVP principal y evolución del proyecto

### Núcleo MVP (base funcional)

- autenticación y sesión,
- CRUD de rutinas,
- registro y consulta de entrenamientos.

### Mejoras añadidas sobre el MVP

- duplicado de rutinas,
- sistema Free/Premium con validación backend,
- descanso por serie con tarjeta flotante,
- cronómetro de sesión y autoguardado de entreno en curso,
- PRs automáticas con comparativa histórica,
- pantalla de progreso con métricas avanzadas,
- logros desbloqueables,
- gestión de perfil y cambio de contraseña.

Con esta evolución, FitTrack pasa de un MVP de planificación a una aplicación funcional completa para seguimiento de entrenamiento y progreso personal.
