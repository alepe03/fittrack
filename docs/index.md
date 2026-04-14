# 1. Introducción

## Qué es FitTrack

FitTrack es una aplicación web orientada a la planificación de rutinas de entrenamiento y al registro de sesiones realizadas.

El objetivo principal es ofrecer una herramienta sencilla donde el usuario pueda organizar sus entrenamientos y consultar su evolución de forma clara.

Está pensada para personas que entrenan de forma habitual y necesitan tener todo su progreso organizado en un mismo sitio.

---

## Problema que resuelve

Cuando se entrena por cuenta propia, es bastante común no llevar un seguimiento claro.

Muchas veces:

- Las rutinas están dispersas  
- No se registran los entrenamientos  
- No se tiene una referencia real del progreso  

Esto hace que sea más difícil mejorar de forma constante o saber si lo que se está haciendo está funcionando.

---

## Enfoque de la solución

FitTrack plantea una solución simple: unir la planificación y el seguimiento dentro de la misma aplicación.

De esta forma, el usuario puede:

- Definir sus rutinas  
- Registrar lo que entrena  
- Consultar su evolución  

El desarrollo del proyecto se ha hecho de forma progresiva, priorizando primero un núcleo funcional sólido y dejando otras funcionalidades para fases posteriores.

---

## Arquitectura general

La aplicación sigue una arquitectura web dividida en tres partes:

- **Frontend:** desarrollado en Vue 3  
- **Backend:** API REST en Laravel  
- **Base de datos:** PostgreSQL  

El frontend se comunica con el backend mediante peticiones HTTP, y el backend se encarga de gestionar la lógica y el acceso a datos.

---

## Stack tecnológico

Las tecnologías utilizadas en el proyecto son:

- **Frontend:** Vue 3 + TypeScript  
- **Backend:** Laravel (PHP)  
- **Base de datos:** PostgreSQL  
- **Despliegue:** Docker + NGINX  

La elección de este stack se basa en su facilidad de uso, modularidad y adecuación al tipo de proyecto.