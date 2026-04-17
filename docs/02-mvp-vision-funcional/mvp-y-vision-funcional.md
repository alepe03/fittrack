# 2. MVP y visión funcional

## 1. Definición del MVP

En FitTrack, el MVP se define como la mínima versión funcional, coherente y defendible que aporta valor real al usuario y demuestra una base técnica sólida.

El núcleo del MVP se centra en el módulo de rutinas, ya que es el punto donde se valida la propuesta principal del producto: planificar el entrenamiento de forma estructurada y reutilizable.

Esto no excluye otras funcionalidades del sistema. Simplemente significa que, de cara a la defensa, el eje principal parte de las rutinas y a partir de ahí se conecta con el resto del flujo de la aplicación.

---

## 2. Alcance funcional del MVP

El MVP cubre el ciclo completo de gestión de rutinas:

- Visualizar rutinas existentes  
- Crear nuevas rutinas  
- Editar rutinas existentes  
- Duplicar rutinas para reutilización  
- Eliminar rutinas  
- Consultar el detalle de la rutina (ejercicios y series objetivo)  
- Iniciar el registro de un entrenamiento desde una rutina  

Este alcance permite defender una funcionalidad completa de planificación, consistente de extremo a extremo y utilizable como base para la evolución del sistema.

---

## 3. Flujo completo de la aplicación

Además del núcleo de rutinas, la aplicación implementa un flujo funcional completo que conecta la planificación con la ejecución del entrenamiento.

---

### 3.1 Acceso y entrada a la aplicación

El usuario accede a la aplicación (SPA) y navega por las diferentes secciones.

Desde el área de rutinas puede:

- Seleccionar una rutina existente  
- Crear una nueva rutina  

Una vez tiene una rutina definida, puede iniciar directamente el registro de un entrenamiento.

---

### 3.2 Gestión de rutinas (planificación)

En esta fase el usuario organiza su estructura de entrenamiento:

- Define rutinas por nombre y contenido  
- Gestiona ejercicios y series objetivo  
- Duplica rutinas para reutilizar bloques de entrenamiento  
- Elimina rutinas cuando deja de necesitarlas  

Este bloque representa el núcleo estable del MVP y el punto de partida del flujo principal de uso.

---

### 3.3 Inicio y ejecución del entrenamiento

Al iniciar un entrenamiento desde una rutina, la aplicación genera una sesión editable donde el usuario registra los resultados reales por serie.

Durante la ejecución, el sistema ofrece funcionalidades ya operativas en la interfaz:

- Registro por serie: repeticiones, peso y estado de completada  
- Control de intensidad: selección de RPE y cálculo automático de RIR  
- Control de tiempo de sesión: cronómetro (iniciar, pausar, reanudar y reiniciar)  
- Gestión de descansos: temporizador configurable con presets y valor personalizado  
- Seguimiento del progreso: porcentaje de series completadas y barra de avance  
- Comparativa frente al objetivo: indicador por serie (superado, cumplido o por debajo)  
- Detección de PR: marcado de mejores marcas en las series registradas  
- Resumen de sesión: ejercicios, series, volumen total, PR, duración y descanso configurado  
- Nota general del entrenamiento: campo libre para observaciones  

---

### 3.4 Consulta y mantenimiento de entrenamientos

Una vez guardado el entrenamiento, el usuario dispone de un ciclo completo de gestión sobre sus registros:

- Listado de entrenamientos realizados  
- Vista detalle de cada sesión con su resumen  
- Edición de entrenamientos existentes  
- Eliminación de entrenamientos  

De esta forma, la aplicación no solo permite planificar, sino también registrar y consultar la ejecución real del entrenamiento.