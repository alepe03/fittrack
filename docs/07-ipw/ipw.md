# 7. IPW

## 1. Introducción

FitTrack se plantea como una aplicación orientada a la organización del entrenamiento personal, centrada en la planificación de rutinas y el registro de sesiones.

Este apartado analiza el mercado, el usuario, la competencia y define un planteamiento básico de marketing y sostenibilidad, aplicados al proyecto.

Además, se enfoca en entender cómo un producto técnico puede posicionarse dentro de un entorno real, teniendo en cuenta tanto las necesidades del usuario como las posibles vías de evolución del propio proyecto.

---

## 2. Análisis de mercado

**Contexto**  
El mercado de aplicaciones fitness está ampliamente desarrollado y en crecimiento, impulsado por el aumento del interés en la salud, el entrenamiento personal y el seguimiento del rendimiento.

Actualmente existen numerosas aplicaciones que ofrecen desde registro básico hasta análisis avanzado del rendimiento, lo que genera un entorno competitivo con soluciones muy completas.

**Problema detectado**  
Muchos usuarios no necesitan herramientas complejas, sino una forma clara de:

- organizar rutinas  
- registrar entrenamientos  
- mantener continuidad  

En muchos casos, las aplicaciones existentes presentan una sobrecarga de funcionalidades que dificulta el uso diario para usuarios básicos o intermedios.

**Posición de FitTrack**  
FitTrack se sitúa como una solución sencilla, centrada en la planificación estructurada, evitando la sobrecarga de funcionalidades.

**Por qué está bien planteado**  
El proyecto identifica una necesidad real dentro de un mercado existente y define un alcance coherente con ella, apostando por simplicidad frente a complejidad.

---

## 3. Usuario y clientes

**Usuario objetivo**

- Personas que entrenan de forma regular  
- Usuarios de gimnasio o entrenamiento personal  
- Nivel básico o intermedio  

**Necesidades**

- Tener rutinas organizadas  
- Consultar rápidamente la planificación  
- Registrar entrenamientos sin complejidad  
- Mantener seguimiento sencillo  

**Por qué está bien definido**  
Se enfoca en un perfil concreto y realista, alineado con el alcance del proyecto y con necesidades comunes en el uso diario.

Además, este tipo de usuario es habitual en entornos reales, lo que hace que el producto tenga sentido práctico.

---

## 4. Competencia

**Situación actual**  
Existen aplicaciones consolidadas en el mercado como:

- MyFitnessPal  
- Strong  
- Nike Training Club  

Estas aplicaciones ofrecen funcionalidades avanzadas como análisis detallado, comunidad o seguimiento nutricional.

**Diferenciación de FitTrack**

- Enfoque en rutinas como núcleo principal  
- Interfaz simple y directa  
- Menor complejidad en el uso diario  

**Por qué está bien planteado**  
FitTrack no intenta competir directamente con grandes plataformas, sino ofrecer una alternativa sencilla y centrada en la planificación, cubriendo un nicho de usuarios que buscan simplicidad.

---

## 5. Plan de marketing (4P)

### Producto

FitTrack es una aplicación web que permite:

- Crear y gestionar rutinas  
- Consultar ejercicios y series  
- Registrar entrenamientos  

El producto se centra en la funcionalidad principal sin añadir complejidad innecesaria, priorizando la experiencia de uso.

Además, se plantea como un producto escalable, donde en una versión futura se podrían añadir funcionalidades como estadísticas avanzadas o personalización del entrenamiento.

También podría evolucionar hacia un enfoque orientado a profesionales del entrenamiento, donde entrenadores puedan gestionar múltiples usuarios y supervisar su progreso desde una única interfaz.

---

### Precio

El modelo de FitTrack se basa en un sistema freemium:

- **Plan Free**
  - Permite crear y gestionar hasta 3 rutinas  
  - No incluye funcionalidades avanzadas como RIR o temporizador de descanso en entrenos  

- **Plan Premium**
  - Permite crear rutinas sin límite  
  - Incluye funcionalidades avanzadas de seguimiento del entrenamiento  

Este modelo permite ofrecer una versión funcional gratuita para la mayoría de usuarios, mientras que las funcionalidades más avanzadas se reservan para usuarios que buscan un mayor nivel de control y seguimiento.

Desde el punto de vista del proyecto, este sistema está implementado a nivel backend mediante control de acceso a funcionalidades, lo que refuerza la coherencia entre el planteamiento teórico y la implementación técnica.

En un contexto real, el plan Premium podría asociarse a una suscripción mensual, adaptando el precio según el valor aportado al usuario.

---

### Distribución

- Aplicación web accesible desde navegador  
- Compatible con distintos dispositivos sin instalación  
- Despliegue mediante servidor web (NGINX)  

Esto facilita el acceso multiplataforma y reduce la fricción de uso.

En un escenario real, la aplicación podría desplegarse en proveedores cloud como VPS o plataformas tipo Render o Railway, optimizando costes según el uso y permitiendo escalar progresivamente.

---

### Promoción

- Publicación del proyecto en GitHub  
- Documentación accesible mediante GitHub Pages  
- Uso como parte de portfolio técnico personal  

Además, en un contexto más realista, la aplicación podría promocionarse mediante:

- Redes sociales orientadas a fitness y entrenamiento  
- Colaboración con entrenadores personales o pequeños gimnasios  
- Publicación en comunidades relacionadas con desarrollo y deporte  

A nivel de evolución del producto, FitTrack podría orientarse hacia un modelo donde los entrenadores gestionen las rutinas de sus clientes dentro de la plataforma, permitiendo:

- Asignar rutinas a usuarios  
- Hacer seguimiento del progreso  
- Centralizar la planificación del entrenamiento  

Esto abriría nuevas vías de promoción basadas en el uso profesional de la aplicación, especialmente en entornos de gimnasio o entrenamiento personal.

De esta forma, la promoción no se limitaría al usuario final, sino también a profesionales del sector, ampliando el alcance del producto.

---

## 6. Sostenibilidad

### Impacto ambiental

- Uso de arquitectura ligera  
- Reducción de consumo innecesario de recursos  
- Despliegue controlado mediante Docker  

Esto permite optimizar el uso de recursos en comparación con aplicaciones más complejas.

---

### Impacto social

- Fomenta hábitos saludables  
- Facilita la organización del entrenamiento  
- Accesible para distintos perfiles de usuario  

Contribuye de forma indirecta a mejorar la calidad de vida del usuario.

---

### Impacto económico

- Coste bajo de desarrollo  
- Uso de herramientas open source  
- Escalable sin inversión inicial elevada  

Permite que el proyecto sea viable sin grandes recursos económicos.

---

## 7. Normativa y buenas prácticas

El proyecto tiene en cuenta aspectos básicos:

- Separación de frontend y backend  
- Uso de buenas prácticas en desarrollo web  
- Gestión de datos estructurada  

Además, se consideran aspectos relacionados con:

- Reglamento General de Protección de Datos (RGPD)  
- Protección de datos personales del usuario  
- Seguridad en el almacenamiento de información  

En una versión productiva, sería necesario implementar medidas como:

- almacenamiento seguro de datos  
- control de acceso  
- gestión de consentimiento del usuario  

---

## 8. Conclusión IPW

FitTrack presenta un análisis coherente del mercado, usuario y competencia, junto con un planteamiento de marketing y sostenibilidad alineado con el alcance del proyecto.

Además, se ha tenido en cuenta la evolución futura del producto, considerando su posible orientación hacia profesionales del entrenamiento y su viabilidad en un contexto real.