# 5. Despliegue

## 1. Arquitectura de despliegue

El despliegue de FitTrack se basa en una arquitectura por servicios claramente separada, alineada con la estructura de la aplicación:

- **Frontend:** servido mediante NGINX  
- **Backend:** API Laravel ejecutada sobre PHP-FPM  
- **Base de datos:** PostgreSQL para persistencia relacional  

Esta separación permite aislar responsabilidades, facilitar el mantenimiento y garantizar un comportamiento predecible del sistema.

### Flujo general de peticiones

El flujo de ejecución es el siguiente:

1. El usuario accede a la interfaz frontend  
2. Las solicitudes a la API se enrutan hacia el backend  
3. El backend procesa la lógica de negocio  
4. Se consulta o actualiza la base de datos PostgreSQL  
5. La respuesta se devuelve al frontend  

Este flujo refleja una arquitectura web estándar, clara y fácilmente defendible.

---

## 2. Uso de Docker Compose

Docker Compose se utiliza para definir y levantar el entorno completo de la aplicación de forma reproducible.

A partir de una única configuración, FitTrack despliega:

- frontend (NGINX)  
- backend (Laravel + PHP-FPM)  
- base de datos PostgreSQL  

Esta elección responde a criterios prácticos:

- simplicidad operativa  
- trazabilidad del entorno  
- capacidad de replicar la ejecución en cualquier máquina  

Se prioriza una solución suficiente para el alcance del proyecto frente a orquestadores más complejos.

---

## 3. Entornos (staging / production)

El proyecto contempla dos configuraciones de entorno:

- **staging**  
- **production**  

Ambos comparten la misma arquitectura base, pero difieren en:

- puertos expuestos  
- variables de entorno  
- configuración operativa  

Esta separación permite validar cambios en un entorno intermedio antes de su uso en producción, manteniendo un flujo de despliegue más controlado y defendible.

---

## 4. NGINX

NGINX cumple un papel clave en la arquitectura:

- En **frontend**, sirve los recursos de la SPA  
- En **backend**, actúa como servidor web delante de Laravel (PHP-FPM)  

Además, centraliza el encaminamiento de peticiones hacia la API, permitiendo que el frontend consuma un flujo unificado sin exponer la estructura interna de servicios.

No se detalla la configuración de bajo nivel, ya que el objetivo es explicar la arquitectura y no las directivas específicas.

---

## 5. CI/CD

La automatización del proyecto se apoya en GitHub Actions.

### Integración continua (CI)

Se ejecutan validaciones en cada cambio relevante:

- build del frontend  
- tests del backend  
- validación de la documentación  

### Publicación de documentación

La documentación se despliega automáticamente en GitHub Pages, garantizando una versión accesible y actualizada.

### Imágenes Docker

El proyecto contempla la generación de imágenes Docker, facilitando su uso en despliegues controlados.

Es importante diferenciar:

- **CI (implementado):** validación automática del proyecto  
- **CD completo (no implementado):** despliegue automático de la aplicación  

---

## 6. Limitaciones reales (honestidad del alcance)

El estado del despliegue se presenta de forma explícita:

- Existe integración continua y publicación automática de documentación  
- No existe despliegue automático completo de la aplicación  
- El despliegue final se realiza manualmente mediante Docker Compose  

Esta decisión es coherente con el alcance académico del proyecto y permite mantener control total sobre el proceso sin introducir complejidad innecesaria.

Lejos de ser una limitación crítica, refuerza la defensa de una arquitectura correcta y comprendida.
