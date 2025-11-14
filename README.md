# Red Social - Segundo Parcial (Clientes Web Mobile)

## Consigna Normal

- Desarrollar un **sitio de red social** de tema libre (excepto política o religión).

---

## Tecnologías

- Ser una **SPA (Single-Page Application)**.
- Utilizar **Vite** para el "bundling" de los archivos.
- Usar **Supabase** para el almacenado de información y la autenticación, a través de sus APIs de **Postgres,  Realtime y Auth**.
- Usar **Tailwind** para la estilización.
- Usar **Vue SFC** (Single-File Components) para la interfaz.Pueden
usarse tanto la API de opciones como la API de composición.
---

## Requerimientos de la red social

- Tener formularios para registro y autenticación de usuarios.
- Tener una página donde se muestre un listado de las publicaciones
de todos los usuarios.
- Los usuarios deben poder crear nuevas publicaciones, y poder editar y eliminar sus propias publicaciones.
- Cada publicación debe poder agregar un archivo, por ejemplo, una
imagen. Las publicaciones deben actualizarse en tiempo real.
- Cada publicación debe poder recibir comentarios de usuarios, que se
actualicen en tiempo real
- Poder entrar a ver el perfil de cualquier usuario, donde figuren sus
datos y sus publicaciones.
- El perfil del usuario autenticado debe, además, permitir administrar
sus datos, como el nombre o password, y debe poder configurar una
imagen de perfil.
- Debe implementarse RLS en las tablas.

---

## Frontend

- HTML con **estructura semántica correcta**. 

---

## Backend

**No se requiere backend propio.**  Supabase cubrirá las funciones de base de datos, autenticación y actualizaciones en tiempo real.

**Importante:** Asegurarse de que el proyecto se Supabase no quede pausado
por una semana de inactividad, para evitar posibles inconvenientes en la
corrección.

---

## Criterios de evaluación

- Complejidad de la tarea realizada.
- **Correcto uso de etiquetas semánticas en HTML.**  
- Coherencia en nombres de variables, métodos y clases.  
- Documentación **_apropiada_** usando JSDoc.  
- Estilización del sitio con **Tailwind**.  
- Prolijidad del código.  
- Prolijidad en la organización de los archivos del proyecto.
- Usabilidad del sitio.
- Accesibilidad del sitio.
- Correcto uso de todas las herramientas implementadas.  

**Importante:** asegurarse de que el proyecto de Supabase no quede **pausado por inactividad** durante la semana de corrección.

---

## Modalidad de entrega

La entrega se realizará de manera digital, subiendo al campus / classroom
en la tarea de este TP un zip/rar con el proyecto entero. Este archivo deberá
llamarse:

- En caso de ser un integrante: **"apellido-nombre.[zip|rar]"** (ejemplo:
“gallino-santiago.rar).
- De ser un grupo: **"apellido-nombre_apellido-nombre.[zip|rar]"** (ej:
“gallino-santiago_noto-federico.rar”).

---

## Archivo datos.txt

Finalmente, debe contener un archivo **datos.txt** con la siguiente
información:
- Carrera
- Materia
- Cuatrimestre
- Año
- Turno
- Comisión
- Apellido y Nombre
- Docente
- Carácter de entrega (2do parcial).

El incumplimiento de cualquiera de las condiciones de entrega estipuladas
puede incurrir en una reducción de la nota de al menos **1 (un) punto**.
Quedará a discreción del profesor si es necesario realizar preguntas a los
estudiantes, ya sean con respecto a cómo se encaró la entrega, como
teóricas pertinentes a la materia o las tecnologías asociadas a la misma
(HTML, CSS, JS, etc).
