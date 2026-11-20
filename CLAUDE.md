# Proyecto fullstack mínimo (aprendizaje)

## Estado actual
- Fase actual: 3 (MongoDB) — completada. Siguiente: Fase 4 (repaso final).
- MongoDB 9.0.8 instalado en el usuario (sin admin): `~/.local/mongodb/bin/mongod`, datos en `~/.local/mongodb-data`, consola `mongosh` (npm global).
  Arrancar: `~/.local/mongodb/bin/mongod --dbpath ~/.local/mongodb-data --bind_ip 127.0.0.1 --port 27017`
- Historial detallado de lo hecho y lo decidido: ver `BITACORA.md`.

## Objetivo
- Entender las piezas de un proyecto fullstack y cómo se conectan, no aprender a programar a fondo.
- Nivel del usuario con terminal, Node y npm: bajo.

## Proyecto
- Web básica con un formulario y un listado de productos tecnológicos.
- CRUD completo: crear, listar, editar y borrar.
- Campos del producto: nombre, marca, categoría, precio, stock, descripción.
- Sin autenticación. Todo en local.
- Git instalado en el usuario con micromamba: `~/.local/git-env/bin/git` (el usuario no es administrador del Mac).
- GitHub (público): https://github.com/ladynaiky/DEL_PRUEBACIFO (remote `origin`, rama `main`). Autenticación con token guardado mediante `credential.helper store`. Nunca escribir el token en archivos del proyecto.
- Hacer un commit al terminar cada fase (título: `faseN`).

## Stack
- Frontend: HTML, JavaScript vanilla y CSS3 (sin frameworks).
- Backend: NestJS (API REST).
- Base de datos: MongoDB instalado en local (sin Docker), con Mongoose.

## Estructura
```
/frontend  → index.html, styles.css, app.js
/backend   → proyecto NestJS (se crea en la fase 2)
CLAUDE.md  → reglas de trabajo
BITACORA.md → diario de lo hecho y lo decidido
```

## Fases (una cada vez, en este orden)
0. Preparación: crear CLAUDE.md con el contexto y las reglas.
1. Frontend simple, sin backend
   - Formulario y listado con CRUD.
   - Los datos viven en el navegador (preguntar al usuario cómo antes de decidir).
   - El usuario lo abre en el navegador y lo prueba.
2. Añadir backend NestJS
   - Revisar antes Node, npm y Nest CLI.
   - API REST del CRUD, con datos en memoria del servidor.
   - Probar la API sola, luego conectar el frontend (incluido CORS).
3. Añadir MongoDB
   - Comprobar que MongoDB local funciona.
   - Conectar NestJS con Mongoose y sustituir los datos en memoria.
4. Repaso final: cómo viaja un dato desde el formulario hasta la base de datos y de vuelta.

## Reglas obligatorias
- Antes de cada paso, explicar qué se va a hacer y por qué. Esperar a que el usuario diga "aprobado".
- No escribir código ni ejecutar comandos sin aprobación.
- Preguntar siempre que haya dudas. No asumir nada. Tomarse el tiempo necesario.
- Pasos pequeños. Explicar cada comando y cada archivo en lenguaje sencillo.
- Al terminar cada fase, resumir qué se ha aprendido y qué pieza nueva se ha añadido.
- Actualizar la sección "Estado actual" al terminar cada fase.
- Al empezar cada sesión, leer `BITACORA.md` para recuperar el contexto.
- Al terminar cada paso, apuntar en `BITACORA.md` (entrada del día) qué se hizo, qué se decidió y por qué, y qué queda pendiente. Mantener al día su "Estado actual".
- Responder en español, directo y con viñetas.
