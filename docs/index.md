# 1. Introducción

## Qué es FitTrack

FitTrack es una aplicación web orientada a la planificación de rutinas de entrenamiento y al registro de sesiones realizadas.

El objetivo principal es ofrecer una herramienta accesible y fácil de utilizar donde el usuario pueda organizar sus entrenamientos y consultar su evolución de forma clara.

Está pensada para personas que entrenan de forma habitual y necesitan tener todo su progreso organizado en un mismo sitio.

---

## Problema que aborda la aplicación

Actualmente existen muchas personas que entrenan de forma habitual pero no llevan un seguimiento claro de su progreso.

En muchos casos:

- Las rutinas se guardan de forma desorganizada
- Los entrenamientos no se registran correctamente
- No existe una referencia clara sobre la evolución física o el rendimiento
- Resulta difícil comprobar si realmente se está progresando

Además, muchas aplicaciones existentes incluyen funcionalidades demasiado complejas o poco adaptadas a usuarios que simplemente quieren organizar sus entrenamientos de forma rápida y visual.

FitTrack nace con el objetivo de ofrecer una solución más sencilla y centrada en el seguimiento real del entrenamiento.

---

## Enfoque de la solución

FitTrack plantea una solución simple: unir la planificación y el seguimiento dentro de la misma aplicación.

De esta forma, el usuario puede:

- Definir sus rutinas  
- Registrar lo que entrena  
- Consultar su evolución  

El desarrollo del proyecto se ha hecho de forma progresiva, priorizando primero un núcleo funcional sólido y dejando otras funcionalidades para fases posteriores.

---

## Valor que aporta

FitTrack unifica en una sola aplicación varias funcionalidades relacionadas con el entrenamiento:

- Creación y planificación de rutinas
- Registro de entrenamientos realizados
- Seguimiento de marcas personales (PRs)
- Visualización del progreso del usuario
- Estadísticas y logros desbloqueables
- Control de descansos entre series mediante temporizadores interactivos

La aplicación busca ofrecer una experiencia clara y cómoda, priorizando la facilidad de uso y la organización del progreso deportivo.

Además, durante el desarrollo se ha intentado mantener una arquitectura modular y escalable que permita añadir nuevas funcionalidades en futuras versiones.

---
# 2. Arquitectura general

## Visión global del sistema

La aplicación sigue una arquitectura web separada en varias capas:

- **Frontend:** aplicación SPA desarrollada con Vue 3 y TypeScript
- **Backend:** API REST desarrollada con Laravel
- **Base de datos:** PostgreSQL
- **Despliegue:** Docker y NGINX

El frontend se comunica con el backend mediante peticiones HTTP para gestionar autenticación, rutinas, entrenamientos y progreso del usuario.

El backend centraliza la lógica de negocio, validaciones y acceso a base de datos.

---

## Relación entre los distintos componentes

### Frontend

El frontend está desarrollado con Vue 3 utilizando Composition API y TypeScript.

La aplicación sigue una arquitectura basada en módulos y el patrón MVVM, separando:

- vistas
- lógica de presentación
- acceso a datos
- modelos

Entre las funcionalidades principales del frontend se encuentran:

- Gestión de rutinas
- Registro de entrenamientos
- Panel de progreso del usuario
- Visualización de PRs y logros
- Temporizador flotante de descansos entre series
- Navegación protegida mediante autenticación

---

### Backend

El backend está desarrollado con Laravel y expone una API REST encargada de:

- autenticación de usuarios
- gestión de rutinas
- almacenamiento de entrenamientos
- cálculo de PRs
- validaciones y control de acceso

La comunicación con el frontend se realiza mediante respuestas JSON.

---

### Base de datos

PostgreSQL se utiliza para almacenar toda la información de la aplicación:

- usuarios
- rutinas
- entrenamientos
- ejercicios
- series realizadas
- marcas personales

La persistencia de datos permite consultar el historial y calcular estadísticas de progreso.

---

### Despliegue

La aplicación se ejecuta mediante contenedores Docker.

NGINX se utiliza como servidor web y proxy entre frontend y backend.

La separación de servicios facilita el despliegue, mantenimiento y escalabilidad de la aplicación.

La orquestación de servicios se realiza mediante Docker Compose.