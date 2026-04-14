# 6. DOR

## 1. Enfoque de diseño

El diseño de FitTrack se plantea con una filosofía **simple, funcional y orientada al uso real**.

La prioridad no es añadir complejidad visual, sino facilitar que el usuario complete tareas clave (consultar, crear y gestionar rutinas) de forma rápida y clara.

Este enfoque se traduce en:

- Pantallas limpias  
- Estructura predecible  
- Acciones visibles en el contexto adecuado  

---

## 2. Framework CSS

La interfaz se construye utilizando **Tailwind CSS**.

Se elige porque permite:

- Mantener consistencia visual entre pantallas  
- Acelerar iteraciones sin romper estructura  
- Aplicar patrones reutilizables directamente en componentes  

En FitTrack, proporciona una base estable para formularios, tarjetas, modales, botones y layouts, evitando estilos aislados difíciles de mantener.

---

## 3. Responsive

El frontend sigue un enfoque **mobile-first**, adaptando la interfaz progresivamente a tamaños mayores.

En la práctica:

- Contenedores y anchos máximos evitan interfaces desproporcionadas  
- El layout mantiene navegación y contenido legibles en móvil y escritorio  
- Formularios y listados conservan jerarquía en diferentes resoluciones  

El objetivo es garantizar que el flujo principal sea usable en cualquier dispositivo.

---

## 4. Accesibilidad

La aplicación incorpora medidas básicas de accesibilidad aplicadas a casos reales:

- Uso de labels en campos de formulario  
- Estados de foco visibles en elementos interactivos  
- Modal accesible preparado para interacción por teclado  
- Mensajes de error claros y contextualizados  

No se incluye una auditoría WCAG completa, pero sí una base funcional coherente con el alcance académico del proyecto.

---

## 5. Usabilidad

La usabilidad se trabaja directamente desde el flujo de tareas:

- Acciones principales claramente identificables (crear, guardar, confirmar)  
- Secuencia lógica en pantallas de listado, detalle y formulario  
- Feedback visible en estados de carga, error y validación  

Esto reduce ambigüedad y facilita la interacción del usuario.

---

## 6. Coherencia visual

FitTrack mantiene coherencia visual en tres niveles:

- **Colores:** paleta consistente para acciones, estados y mensajes  
- **Jerarquía:** títulos, bloques y acciones con orden claro  
- **Componentes:** reutilización de elementos base (botones, tarjetas, modales, layout)  

Esta coherencia facilita el aprendizaje de la interfaz y refuerza la percepción de un producto integrado.
