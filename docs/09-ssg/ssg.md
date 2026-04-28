# 9. SSG

## 1. Introducción

FitTrack incorpora una funcionalidad empresarial de suscripción orientada a diferenciar capacidades entre usuarios Free y Premium.

La implementación se ha diseñado como un flujo seguro y demostrable en entorno académico: alta de plan Premium simulada, generación de comprobante y cancelación de suscripción.

Este apartado demuestra el cumplimiento de los criterios de SSG aplicados al proyecto.

---

## 2. Funcionalidad empresarial implementada

**Explicación aplicada al proyecto**  
Se implementa un sistema de suscripción con dos estados de cuenta (`free` y `premium`) gestionado desde backend Laravel y consumido por frontend Vue.

**Qué permite**

- Gestionar el cambio de plan del usuario autenticado  
- Aplicar reglas de negocio según el plan activo  
- Cubrir el ciclo mínimo de suscripción: alta, comprobante y cancelación  

**Por qué está bien implementado**  
La funcionalidad está integrada de extremo a extremo (API + interfaz + estado de sesión), con reglas claras y comportamiento verificable para defensa.

**Evidencia**

![Imagen 1: módulo de suscripción](../assets/ssg/ssg_2-1.png)

*Pantalla del módulo de suscripción integrada en la aplicación.*

---

## 3. Sistema de planes Free / Premium

**Explicación aplicada al proyecto**  
El sistema distingue entre plan Free y plan Premium, reflejando el estado actual del usuario en la sesión y en la interfaz.

**Qué permite**

- Mostrar plan actual en la pantalla de suscripción  
- Ofrecer acciones según estado (`Hazte Premium` o `Cancelar Premium`)  
- Mantener coherencia entre backend y frontend mediante `auth/me`  

**Por qué está bien implementado**  
El estado del plan no depende solo de la UI: se valida en backend y se sincroniza en frontend tras cada operación de suscripción.

**Evidencia**

![Imagen 1: planes free y premium](../assets/ssg/ssg_3-1.png)

*Comparativa visual de planes y estado actual del usuario.*

---

## 4. Flujo de alta a Premium

**Explicación aplicada al proyecto**  
El usuario Free puede iniciar un upgrade simulado desde un modal de pago. El frontend envía los datos a `POST /api/subscription/upgrade-simulated` y actualiza la sesión al finalizar.

**Qué permite**

- Ejecutar alta Free -> Premium con validaciones de formato  
- Evitar recompra si el usuario ya es Premium (error `409`)  
- Mostrar comprobante de operación en la interfaz tras alta correcta  

**Por qué está bien implementado**  
El flujo implementa validación, control de estado y feedback al usuario sin introducir pagos reales, manteniendo trazabilidad del cambio de plan.

**Evidencia**

![Imagen 1: modal upgrade premium](../assets/ssg/ssg_4-1.png)

*Formulario de upgrade Premium con validaciones de pago simulado.*

![Imagen 2: usuario premium activo](../assets/ssg/ssg_4-2.png)

*Estado del usuario tras alta correcta a Premium.*

---

## 5. Flujo de cancelación

**Explicación aplicada al proyecto**  
El usuario Premium puede cancelar su suscripción desde la misma pantalla mediante confirmación previa. La acción llama a `POST /api/subscription/cancel`, refresca sesión y devuelve el usuario a plan Free.

**Qué permite**

- Ejecutar transición Premium -> Free de forma explícita  
- Evitar cancelaciones inconsistentes si ya está en Free (error `409`)  
- Mantener la UI sincronizada con el plan real tras `auth/me`  

**Por qué está bien implementado**  
Se cubre el cierre del ciclo de vida de la suscripción sin ambigüedad funcional y con control de errores en backend.

**Evidencia**

![Imagen 1: botón cancelar premium](../assets/ssg/ssg_5-1.png)

*Acción de cancelación disponible para usuarios Premium.*

![Imagen 2: estado tras cancelación](../assets/ssg/ssg_5-2.png)

*Usuario devuelto a plan Free tras cancelación correcta.*

---

## 6. Seguridad aplicada

**Explicación aplicada al proyecto**  
Las operaciones de suscripción están protegidas para usuarios autenticados y se limita la persistencia de datos a información estrictamente necesaria.

**Qué permite**

- Proteger endpoints con `auth:sanctum`  
- Evitar almacenamiento de tarjeta completa y CVV  
- Aplicar errores de negocio (`409`) en estados no válidos  

**Por qué está bien implementado**  
La seguridad se aplica en capa de API y en reglas de negocio, reduciendo riesgo y reforzando consistencia de la operación.

**Evidencia**

![Imagen 1: endpoint protegido con sanctum](../assets/ssg/ssg_6-1.png)

*Rutas de suscripción protegidas con autenticación Sanctum.*

---

## 7. Comprobante de operación

**Explicación aplicada al proyecto**  
Tras un upgrade correcto, la API devuelve un comprobante mínimo en la respuesta (`receipt`) y el frontend lo presenta en pantalla.

**Qué permite**

- Mostrar identificador de operación (`receipt_id`)  
- Mostrar fecha, estado, plan, importe, moneda y correo  
- Mostrar `card_last4` sin exponer datos sensibles completos  

**Por qué está bien implementado**  
Se aporta evidencia de operación útil para defensa y trazabilidad funcional, sin incorporar almacenamiento sensible ni complejidad innecesaria.

**Evidencia**

![Imagen 1: comprobante en pantalla](../assets/ssg/ssg_7-1.png)

*Comprobante simulado mostrado al usuario tras alta a Premium.*

---

## 8. Limitaciones y mejoras futuras

**Explicación aplicada al proyecto**  
La solución actual prioriza el cumplimiento funcional SSG en entorno académico, con un flujo simulado y seguro.

**Qué permite**

- Validar la lógica empresarial sin pasarela de cobro real  
- Demostrar ciclo de suscripción completo de forma defendible  
- Mantener bajo riesgo técnico en esta fase del proyecto  

**Por qué está bien implementado**  
El alcance está acotado y documentado de forma honesta: se cubre el objetivo funcional sin atribuir capacidades no implementadas.

**Evidencia**

![Imagen 1: límites del alcance SSG](../assets/ssg/ssg_8-1.png)

*Resumen de alcance actual y mejoras previstas.*

---

## 9. Evidencias visuales

**Explicación aplicada al proyecto**  
Las capturas se organizan para demostrar el recorrido funcional completo del módulo SSG en secuencia de uso real.

**Qué permite**

- Verificar la experiencia del usuario en cada estado clave  
- Relacionar cada criterio SSG con una evidencia visual concreta  

**Por qué está bien implementado**  
La secuencia de evidencias facilita la defensa oral y la revisión técnica del tribunal.

**Evidencia**

![Imagen 1: suscripción free](../assets/ssg/ssg_9-1.png)

*Pantalla de suscripción con usuario en plan Free.*

![Imagen 2: modal upgrade](../assets/ssg/ssg_9-2.png)

*Modal de alta a Premium (pago simulado).*

![Imagen 3: comprobante](../assets/ssg/ssg_9-3.png)

*Comprobante simulado tras operación de alta.*

![Imagen 4: premium activo](../assets/ssg/ssg_9-4.png)

*Usuario con plan Premium activo.*

![Imagen 5: cancelar premium](../assets/ssg/ssg_9-5.png)

*Acción de cancelación disponible en estado Premium.*

![Imagen 6: tras cancelación](../assets/ssg/ssg_9-6.png)

*Estado de usuario tras volver a Free.*

![Imagen 7: error 409](../assets/ssg/ssg_9-7.png)

*Respuesta de negocio `409` en operación no válida (ya Free o ya Premium).*

---

## 10. Conclusión

El módulo SSG de FitTrack cumple el objetivo empresarial definido: gestión de planes Free/Premium con flujo de alta simulada, comprobante de operación y cancelación de suscripción, todo ello protegido con autenticación y reglas de negocio coherentes.

La implementación mantiene un enfoque realista y defendible: no incluye pasarela de pago real ni Stripe en esta fase, pero sí un ciclo funcional completo, verificable y alineado con el alcance académico del proyecto.
