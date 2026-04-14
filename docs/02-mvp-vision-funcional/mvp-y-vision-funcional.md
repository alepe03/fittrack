# 2. MVP y visión funcional

## 1. Definición del MVP

En FitTrack, el MVP se define como la minima version funcional, coherente y defendible que aporta valor real al usuario y demuestra una base tecnica solida.

El nucleo del MVP se centra en el **modulo de rutinas**, porque es el punto donde se valida la propuesta principal del producto: planificar el entrenamiento de forma estructurada y reutilizable.

Este criterio no excluye otras capacidades del sistema. Significa que, para defensa, el eje de validacion funcional parte de rutinas y desde ahi se conecta con el resto del flujo real de la aplicacion.

---

## 2. Alcance funcional del MVP

El MVP cubre el ciclo completo de gestion de rutinas:

- Visualizar rutinas existentes
- Crear nuevas rutinas
- Editar rutinas existentes
- Duplicar rutinas para reutilizacion
- Eliminar rutinas
- Consultar el detalle de rutina (ejercicios y series objetivo)
- Lanzar el registro de entreno desde la rutina seleccionada

Este alcance permite defender una funcionalidad completa de planificacion, consistente de extremo a extremo, y utilizable como base de evolucion.

---

## 3. Flujo completo de la aplicacion

Ademas del nucleo de rutinas, el sistema implementa un flujo funcional mas amplio que conecta planificacion y ejecucion del entrenamiento.

### 3.1 Acceso y entrada a la aplicacion

1. El usuario accede a la SPA y navega por las secciones principales.
2. Desde el area de rutinas, selecciona una rutina existente o crea una nueva.
3. Con una rutina definida, puede iniciar directamente el registro de entreno.

### 3.2 Gestion de rutinas (planificacion)

En esta fase el usuario mantiene su estructura de trabajo:

- Organiza rutinas por nombre y contenido
- Gestiona ejercicios y series objetivo
- Actualiza o duplica rutinas para reutilizar bloques de entrenamiento
- Elimina rutinas cuando deja de necesitarlas

Esta parte representa el nucleo estable del MVP y el punto de partida del flujo operativo.

### 3.3 Inicio y ejecucion del entrenamiento

Al registrar un entreno desde una rutina, la aplicacion genera una sesion editable donde el usuario registra resultados reales por serie.

Durante la ejecucion, el sistema ofrece funcionalidades ya operativas en interfaz:

- **Registro por serie:** reps, peso y estado de completada
- **Control de intensidad:** seleccion de RPE y calculo de RIR derivado
- **Control de tiempo de sesion:** cronometro general (iniciar, pausar, reanudar, reiniciar)
- **Gestion de descansos:** temporizador configurable con presets y valor personalizado
- **Seguimiento de progreso:** porcentaje de series completadas y barra de avance
- **Comparativa frente al objetivo:** indicador por serie (superado, cumplido o por debajo)
- **Deteccion de PR:** marcado de PR en series guardadas
- **Resumen de sesion:** ejercicios, series, volumen total, PR, duracion y descanso configurado
- **Nota general del entreno:** campo libre para observaciones de la sesion

### 3.4 Consulta y mantenimiento de entrenamientos

Una vez guardado el entreno, el usuario dispone de ciclo de vida funcional sobre los registros:

- Listado de entrenos registrados
- Vista detalle de cada entreno con su resumen final
- Edicion de entrenos existentes
- Borrado de entrenos

De esta forma, la aplicacion no se limita a planificar, sino que tambien cubre el seguimiento operativo de la ejecucion real.

---

## 4. Funcionalidades por estado

### 4.1 Implementadas

Funcionalidades actualmente operativas y utilizables en la aplicacion:

- Gestion completa de rutinas (alta, consulta, edicion, duplicado y borrado)
- Navegacion desde rutina a registro de entreno
- Registro de entreno por ejercicios y series
- Marcado de series completadas
- Registro de reps y peso por serie
- Seleccion de RPE con conversion a RIR
- Cronometro de sesion
- Temporizador de descanso configurable (rapido y personalizado)
- Indicadores de progreso del entreno
- Comparativa por serie respecto al objetivo de rutina
- Resumen cuantitativo del entreno (series, volumen, PR, duracion)
- Listado, detalle, edicion y borrado de entrenos

### 4.2 Parcial o con limite actual

- La integracion backend del flujo de entrenamientos esta en evolucion; existen comportamientos de soporte en cliente para mantener continuidad funcional.
- El estado de autenticacion no se presenta aun como un sistema completo de proteccion de todo el ciclo en backend.

### 4.3 Evolucion prevista (sin alterar el alcance actual)

- Consolidar el flujo de entrenamientos completamente integrado por API REST en todos los escenarios.
- Completar el circuito de autenticacion y autorizacion para endurecer el acceso a endpoints.
- Extender analitica y seguimiento avanzado sobre la base funcional existente.

---

## 5. Justificacion del enfoque

La decision de mantener **rutinas** como nucleo del MVP responde a un criterio metodologico: validar primero la parte mas estructural del dominio para asegurar coherencia funcional y solidez tecnica.

Al mismo tiempo, la aplicacion ya contempla el flujo completo de uso (planificar, ejecutar, registrar y revisar entrenos), lo que permite demostrar que el sistema no es un prototipo aislado sino una solucion funcional con continuidad de producto.

Este enfoque incremental facilita la defensa porque separa con claridad:

- Lo consolidado y demostrable
- Lo operativo con limites actuales
- Lo que se plantea como siguiente iteracion

Asi se evita sobreprometer, se mantiene rigor academico y se justifica la evolucion del proyecto sobre una base real ya implementada.
# 2. MVP y visión funcional

## 1. Definición del MVP

En FitTrack, el MVP se define como la mínima versión funcional, coherente y defendible que aporta valor real al usuario y demuestra una base técnica sólida.

En esta fase, el MVP se centra en el **módulo de rutinas**, ya que constituye el núcleo del producto: la planificación estructurada del entrenamiento.

---

## 2. Alcance funcional del MVP

El MVP cubre el flujo completo de gestión de rutinas:

- Visualizar rutinas existentes  
- Crear nuevas rutinas  
- Editar rutinas existentes  
- Duplicar rutinas para reutilización  
- Eliminar rutinas  
- Consultar el detalle (ejercicios y series objetivo)  

Este conjunto define un ciclo funcional completo de planificación, que representa la propuesta principal de valor de FitTrack en esta fase.

---

## 3. Flujo principal del usuario

El flujo defendible del usuario es el siguiente:

1. El usuario accede a la aplicación y entra en el área principal  
2. Consulta el listado de rutinas disponibles  
3. Crea una nueva rutina o selecciona una existente  
4. Gestiona la rutina:
   - editar  
   - duplicar  
   - eliminar  
5. Mantiene su planificación actualizada para futuros entrenamientos  

Como extensión del flujo, desde el detalle de una rutina el usuario puede iniciar el registro de un entrenamiento, aunque este bloque aún está en fase de integración completa con backend.

---

## 4. Estado actual del sistema

### ✅ Implementado

- Módulo de rutinas operativo end-to-end  
- Flujo completo de planificación funcional y consistente  
- Integración real entre frontend, backend y base de datos en el dominio de rutinas  

### ⚠️ Parcial

- Registro de entrenamientos disponible a nivel de interfaz, sin integración REST completa  
- Autenticación resuelta de forma temporal en frontend  

### 🚀 Futuro

- Integración completa del módulo de entrenamientos vía API REST  
- Sistema de autenticación real con protección de endpoints  
- Evolución funcional orientada a análisis y seguimiento avanzado  

---

## 5. Justificación del alcance

La decisión de centrar el MVP en rutinas responde a un criterio técnico y de producto: consolidar primero un núcleo funcional estable, verificable y defendible.

Este enfoque permite:

- Validar el dominio principal con coherencia funcional  
- Construir una base arquitectónica reutilizable  
- Reducir complejidad inicial sin comprometer la evolución  

El estado parcial de entrenamientos y autenticación no responde a una carencia conceptual, sino a una estrategia de desarrollo incremental: cerrar primero el flujo nuclear y, posteriormente, extender el sistema sobre una base sólida.
