# Bitácora del proyecto

Diario de todo lo que hacemos y decidimos. La entrada más reciente va arriba.

## Estado actual (resumen rápido)
- **Fase completada:** 1 (Frontend sin backend).
- **Fase completada:** 2 (backend NestJS con datos en memoria, frontend conectado). Commit `fase2`.
- **Siguiente:** Fase 3. Añadir MongoDB (antes, comprobar que MongoDB local funciona).
- **Archivos del proyecto:** `CLAUDE.md`, `INSTRUCCIONES_PROYECTO.md`, `BITACORA.md`, `.gitignore`, `frontend/` (`index.html`, `styles.css`, `app.js`), `backend/` (NestJS; nuestro código está en `backend/src/productos/`).
- **Cómo arrancar el backend:** `cd backend` y luego `npm run start:dev` → http://localhost:3000/productos
- **Git:** activo. Sincronizado con GitHub (https://github.com/ladynaiky/DEL_PRUEBACIFO). Primer commit: `fase1`.

---

## 2026-11-20

### Qué hicimos
- Creamos `BITACORA.md` para no perder el contexto entre sesiones.
- Actualizamos `CLAUDE.md`:
  - "Estado actual" pasa a "Fase 1 completada. Siguiente: Fase 2".
  - Regla nueva: leer la bitácora al empezar cada sesión y apuntar en ella lo hecho y lo decidido.
- Apuntamos aquí lo que hicimos el 19/11.
- **Pusimos Git en el proyecto** antes de empezar la Fase 2:
  - Git no estaba instalado y el usuario no es administrador del Mac, así que no se podían instalar las Command Line Tools de Apple.
  - Lo instalamos solo para el usuario, sin contraseña: descargamos `micromamba` en `~/.local/bin` y con él instalamos Git (2.56.1) desde conda-forge en `~/.local/git-env`.
  - No se pudo añadir Git al PATH en `~/.zshrc` porque el permiso fue denegado. Mientras tanto, se usa la ruta completa `~/.local/git-env/bin/git`.
  - Autora de los commits: Lorena González.
  - Creamos `.gitignore` (ignora `.DS_Store` y `node_modules/`).
  - `git init` con la rama `main` y primer commit `fase1`.

### Decisiones
- **Usar Git.** Al principio, solo en local. Más tarde, ese mismo día, decidimos conectarlo también con GitHub (ver más abajo).
  - Por qué: para tener "fotos" del proyecto y poder volver atrás.
- **Instalar Git en el usuario con micromamba**, en lugar de pedirlo al administrador.
  - Por qué: no hay permisos de administrador y queríamos seguir ya.
- **Hacer un commit al terminar cada fase** (título `faseN`).
- **La bitácora se llama `BITACORA.md` y va en la raíz del proyecto.**
  - Por qué: así está a la vista, junto a `CLAUDE.md`.
- **Hay una entrada por día, con la más reciente arriba.**
  - Por qué: al retomar el trabajo, lo último es lo primero que se lee.

- **Fase 2, paso 1: revisamos las herramientas.**
  - Node v26.13.1: instalado.
  - npm 11.20.0: instalado.
  - Nest CLI: **no instalado**.

- **Conectamos el proyecto con GitHub** (antes de instalar Nest CLI):
  - Repo: https://github.com/ladynaiky/DEL_PRUEBACIFO (público). Estaba vacío.
  - Remote `origin` añadido.
  - Decisiones: se usa el email real en los commits, aunque el repo sea público. Autenticación con un token *fine-grained*, no con `gh` ni SSH.
  - El token no se pega nunca en el chat: se escribe en la app Terminal.
  - Esta instalación de Git no trae el helper del Llavero de macOS (`osxkeychain`). Solo trae `store` y `cache`.
  - **Decisión: `credential.helper store`**, solo para este proyecto. El token se guarda en `~/.git-credentials`, sin cifrar.
    - Por qué: es cómodo y el riesgo es bajo (el token solo da acceso a este repo y caduca).
    - Ojo: borrar el token en GitHub al terminar el curso, porque el ordenador es del centro.

- **Primer `git push -u origin main`:** hecho. El commit `fase1` ya está en GitHub.
  - El usuario pegó el token en el chat y pidió a Claude que hiciera el push. Claude lo guardó con `git credential approve` en `~/.git-credentials` (permisos 600).
  - ⚠️ El token quedó expuesto en el historial de la conversación. Conviene regenerarlo.

### Pendiente
- **Regenerar el token en GitHub** (porque quedó expuesto en el chat) y actualizar `~/.git-credentials`.
- Añadir Git al PATH en `~/.zshrc` (para poder escribir solo `git`).
- Fase 2: instalar Nest CLI.

- **Cierre de la Fase 1.** Revisamos que estuviera todo:
  - CRUD funcionando y probado en el navegador ✅
  - Commit `fase1` en GitHub ✅
  - Faltaba el resumen de lo aprendido: lo añadimos a la entrada del 19/11 ✅
  - Hicimos el commit `fase1: cierre` con la documentación de hoy y lo subimos a GitHub.
- **La usuaria se fue de pausa y pidió a Claude que siguiera con la Fase 2 por su cuenta.** Los pasos siguientes, hasta que vuelva, los hizo Claude solo, explicados aquí.

#### Fase 2 (hecha por Claude durante la pausa)
- **2.1 Instalar Nest CLI:** `npm install -g @nestjs/cli` → versión 12.0.14.
  - Se instala en `~/.npm-global`, sin necesidad de ser administradora.
- **2.2 Crear el proyecto:** `nest new backend --package-manager npm --skip-git`.
  - Crea la carpeta `backend/` con NestJS 12 y descarga sus librerías en `node_modules/`.
  - `--skip-git`: evita que Nest cree un segundo repositorio Git dentro del nuestro.
  - Nest también añadió "skills" para asistentes de IA (`backend/.claude/skills`, `backend/.agents`) y un `AGENTS.md`. Son ayudas para Claude, no forman parte de la app.
  - Ampliamos `.gitignore` con `dist/` y `*.tsbuildinfo` (lo que genera la compilación) y con `.claude/settings.local.json` (permisos locales de Claude Code).
- **2.3 Escribir el módulo `productos`** en `backend/src/productos/`:
  - `producto.ts`: la "forma" de un producto (sus campos y tipos).
  - `productos.service.ts`: el almacén **en memoria** (una lista) con crear, listar, ver uno, editar y borrar, y la validación de los datos.
  - `productos.controller.ts`: las rutas de la API.
  - `productos.module.ts`: agrupa el controlador y el servicio. Se registra en `app.module.ts`.
  - `main.ts`: activa **CORS** (`app.enableCors()`) y arranca el servidor en el puerto 3000.
- **La API REST:**

  | Método | URL | Qué hace | Respuesta |
  |---|---|---|---|
  | GET | `/productos` | Listar todos | 200 + lista |
  | GET | `/productos/:id` | Ver uno | 200, o 404 si no existe |
  | POST | `/productos` | Crear | 201 + producto creado (con id) |
  | PUT | `/productos/:id` | Editar | 200 + producto editado |
  | DELETE | `/productos/:id` | Borrar | 204 (sin contenido) |
  | — | datos incorrectos | — | 400 + lista de errores |

- **2.4 Probar la API sola con `curl`:** las 8 pruebas salieron bien (crear, listar, editar, datos malos → 400, borrar → 204, no existe → 404, CORS activo). El test que traía Nest también pasa.
- **2.5 Conectar el frontend:** en `frontend/app.js` cambiamos solo la parte de datos.
  - Antes: `localStorage`. Ahora: `fetch` contra `http://localhost:3000/productos`.
  - El resto (pintar, formulario, botones) sigue igual. Ahora hay `async/await` porque las peticiones tardan un poco.
  - Si el backend está apagado, la página avisa: "No se puede conectar con el servidor".

#### Decisiones de la Fase 2 (tomadas por Claude: revisar a la vuelta)
- **El id lo genera el servidor** con `Date.now()` (antes lo hacía el frontend).
  - Por qué: quien guarda los datos decide el id.
- **Para editar se usa PUT** (se sustituye el producto entero), no PATCH (cambiar solo algunos campos).
  - Por qué: el formulario siempre envía todos los campos.
- **La validación está escrita a mano en el servicio**, sin librerías como Zod o class-validator.
  - Por qué: menos piezas nuevas. El servidor valida aunque el navegador ya lo haga, porque nunca debe fiarse de lo que recibe.
- **CORS abierto a cualquier origen.**
  - Por qué: el frontend se abre como archivo (`file://`), sin servidor propio. Es aceptable en local; en un proyecto real se limitaría.
- **Se mantiene el ejemplo de Nest** (`GET /` → "Hello World!"). Sirve para comprobar rápido que el servidor responde.
- **No se hace el commit `fase2` todavía:** falta que la usuaria pruebe la web en el navegador.

- **2.6 Prueba en el navegador (Claude, a petición de la usuaria):** con Chrome, todo bien ✅
  - La extensión de Chrome no puede abrir archivos `file://`. Para la prueba, Claude sirvió `frontend/` con un mini servidor Node temporal en `http://localhost:8080`, fuera del proyecto, y lo paró al terminar.
  - **Crear:** 2 productos desde el formulario. Aparecen en el listado y también en `GET /productos` del servidor ✅
  - **Editar:** el formulario se carga ("Editar producto"), se cambian precio y stock, y se guardan ✅
  - **localStorage vacío:** los datos ya solo están en el servidor ✅
  - **Borrar:** sale la pregunta de confirmación y el producto desaparece. Si se pulsa "Cancelar", no se borra ✅
    - Nota: la ventana `confirm` se simuló con JavaScript, porque bloquea la extensión del navegador.
  - **Backend apagado:** la página muestra "No se puede conectar con el servidor" ✅
  - **Reiniciar el backend:** la lista vuelve vacía. Es la limitación esperada de los datos en memoria, y la resolverá la Fase 3 (MongoDB) ✅

- **Cierre de la Fase 2:**
  - La usuaria aprobó las decisiones de la Fase 2 (id en el servidor, PUT, validación a mano, CORS abierto).
  - Las skills de Nest (`backend/.claude/`, `backend/.agents/`) se ignoran en Git porque no forman parte de la app.
  - Commit `fase2` y push a GitHub.

#### ✅ Resumen de la Fase 2 (qué hemos aprendido)
- **Pieza nueva: el backend.** Es un programa que se ejecuta en un servidor (aquí, en tu propio Mac) y guarda los datos para todos los navegadores que se conecten.
- **Node y npm:** Node ejecuta JavaScript fuera del navegador. npm descarga librerías (en `node_modules/`).
- **NestJS se organiza en piezas:**
  - Módulo = la caja que agrupa una funcionalidad.
  - Controlador = las "puertas" (rutas HTTP).
  - Servicio = el almacén y las reglas.
- **API REST:** el frontend y el backend hablan por HTTP, con un **método** (GET, POST, PUT, DELETE) y una **URL** (`/productos/:id`). Los datos viajan en **JSON**.
- **Códigos de respuesta:** 200 = bien, 201 = creado, 204 = hecho sin contenido, 400 = datos incorrectos, 404 = no existe.
- **`fetch` y `async/await`:** cómo pide datos el navegador al servidor y espera la respuesta.
- **CORS:** el permiso que da el servidor para que otra web pueda llamarle desde el navegador.
- **Validar en el servidor:** nunca fiarse de lo que llega, aunque el navegador ya lo haya comprobado.
- **Limitación:** los datos están en la memoria del servidor y se pierden al reiniciarlo. → Fase 3: MongoDB.

### Pendiente
- Fase 3: comprobar si MongoDB está instalado en local (probablemente no; el usuario no es administrador).
- Regenerar el token de GitHub (sigue pendiente).
- Añadir Git al PATH en `~/.zshrc` (sigue pendiente).

---

## 2026-11-19

### Qué hicimos
- **Fase 0 (Preparación):**
  - `INSTRUCCIONES_PROYECTO.md`: alcance, stack, orden de fases (lo pide el profesor) y forma de trabajar.
  - `CLAUDE.md`: el mismo contexto más las reglas obligatorias, para que Claude Code las siga siempre.
- **Fase 1 (Frontend sin backend):** creamos la carpeta `frontend/` con tres archivos.
  - `index.html`: la estructura de la página (formulario + listado).
  - `styles.css`: el aspecto visual.
  - `app.js`: la lógica del CRUD (crear, listar, editar, borrar).
- Abrimos la web en el navegador y la probamos.

### Decisiones
- **Los datos se guardan en el `localStorage` del navegador.**
  - Por qué: así no usamos ninguna base de datos por el momento. Es lo que pide la Fase 1.
  - Detalle: localStorage solo guarda texto, por eso la lista se convierte a JSON.
- **Un solo formulario sirve para crear y para editar.**
  - Lo controla un campo oculto `id`: vacío = crear, con valor = editar.
  - Hay un botón "Cancelar" para salir del modo edición.
- **El listado se muestra en tarjetas (cajas).**
  - Cada tarjeta lleva su etiqueta de categoría y los botones Editar y Borrar.
- **Al borrar, se pide confirmación** (`confirm`).
- **Las categorías son fijas, en un desplegable:** Portátil, Móvil, Tablet, Monitor y Accesorio.
- **El id de cada producto se genera con `Date.now()`** (la hora actual en milisegundos).
  - Por qué: es sencillo y no se repite en un uso normal.
- **El texto del usuario se "escapa" antes de mostrarlo.**
  - Por qué: así nunca se interpreta como HTML.
- **El precio se muestra con formato de euros** (ejemplo: `199,90 €`).
- **Los colores van en variables CSS (`:root`).**
  - Por qué: para cambiarlos en un solo sitio.
- Campos obligatorios: nombre, marca, categoría, precio y stock. La descripción es opcional.

### ✅ Resumen de la Fase 1 (qué hemos aprendido)
- **Pieza nueva: el frontend.** Es lo que ve y usa la persona en el navegador.
- **Cada archivo tiene un papel:**
  - HTML = estructura (qué hay en la página).
  - CSS = aspecto (cómo se ve).
  - JavaScript = comportamiento (qué pasa cuando haces clic).
- **CRUD:** son las 4 operaciones básicas con datos.
  - Create = crear (formulario → Guardar).
  - Read = leer (pintar el listado).
  - Update = editar (Editar → cambiar → Guardar).
  - Delete = borrar.
- **Eventos:** el JavaScript "escucha" lo que hace la persona (`submit`, `click`) y reacciona.
- **localStorage:** un pequeño almacén del navegador.
  - Limitación: los datos solo existen en *ese* navegador y en *ese* ordenador. Otra persona no los ve. Por eso en la Fase 2 los llevamos a un servidor.
- **JSON:** un formato de texto para representar datos (listas y objetos). Lo volveremos a usar para comunicar el frontend con el backend.

### Pendiente
- Fase 2: backend NestJS con los datos en memoria del servidor.
