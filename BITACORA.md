# Bitácora del proyecto

Diario de todo lo que hacemos y decidimos. La entrada más reciente va arriba.

## Estado actual (resumen rápido)
- **Fase completada:** 1 (Frontend sin backend).
- **Fase completada:** 2 (backend NestJS con datos en memoria, frontend conectado). Commit `fase2`.
- **Fases completadas:** 0–4. **En curso:** Fase 5, despliegue en Render. Archivos y guía (`DESPLIEGUE.md`) preparados; faltan los pasos manuales.
- **Para usar la app hay que arrancar 2 cosas** (cada una en su terminal): primero MongoDB y después el backend. Luego se abre `frontend/index.html`.
- **Cómo arrancar MongoDB:** `~/.local/mongodb/bin/mongod --dbpath ~/.local/mongodb-data --bind_ip 127.0.0.1 --port 27017` (dejar esa terminal abierta).
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

- **Fase 3, paso 1: comprobamos MongoDB.** No está instalado: no hay `mongod` ni `mongosh`, Homebrew tampoco está y el puerto 27017 está libre.

- **Decisión: instalar MongoDB desde la descarga oficial** (opción 1), sin administrador.
  - Descartado: pedirlo al administrador (hay que esperar) y MongoDB Atlas (rompe la regla "en local").
- **Fase 3, paso 2: instalación.**
  - Servidor **MongoDB Community 9.0.8** (Mac Apple Silicon), descargado de `fastdl.mongodb.org`.
    - Comprobamos la huella SHA-256 contra la que publica MongoDB: OK.
    - Descomprimido en `~/.local/mongodb` (el programa es `~/.local/mongodb/bin/mongod`).
  - Consola **mongosh 2.14.3**, con `npm install -g mongosh`, en `~/.npm-global`.
    - npm no ejecutó los scripts opcionales de kerberos, cifrado y ssh. No hacen falta para este proyecto.
  - Carpeta de datos: `~/.local/mongodb-data`.
- **Fase 3, paso 3: arrancar y comprobar.**
  - Comando: `~/.local/mongodb/bin/mongod --dbpath ~/.local/mongodb-data --bind_ip 127.0.0.1 --port 27017`
  - `--bind_ip 127.0.0.1`: solo acepta conexiones desde este Mac, no desde la red del centro.
  - Prueba con mongosh: insertamos `{ mensaje: "Hola MongoDB" }`, lo leímos y borramos la base de prueba ✅

- **Fase 3, paso 4: conectar NestJS con MongoDB (Mongoose).**
  - `npm install @nestjs/mongoose mongoose` en `backend/` → `@nestjs/mongoose` 12.0.1 y `mongoose` 9.12.2.
  - **Nuevo `producto.schema.ts`:** la forma de un producto *en la base de datos* (colección `productos`), con los campos obligatorios, `min: 0` en precio y stock, y sin el campo interno `__v`.
  - **`app.module.ts`:** `MongooseModule.forRoot('mongodb://127.0.0.1:27017/productos')`, la conexión con la base de datos `productos`.
  - **`productos.module.ts`:** `MongooseModule.forFeature(...)` registra el modelo para poder usarlo en el servicio.
  - **`productos.service.ts`:** la lista en memoria se sustituye por el modelo de Mongoose (`find`, `findById`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`). Ahora todo es `async/await`.
  - **`productos.controller.ts`:** solo cambia `remove`, que ahora espera (`await`) al borrado.
  - **El frontend no se toca:** la API responde igual (mismas rutas y mismos campos).
- **Decisiones de la Fase 3 (tomadas por Claude):**
  - **El id lo genera MongoDB** (`_id`, 24 caracteres, por ejemplo `6b002f01ce922209a094ffa9`). El servicio lo convierte a `id` (texto) para que el frontend no cambie.
  - **Un id con formato incorrecto (por ejemplo `/productos/123`) responde 404 "no existe"**, no un error del servidor.
  - **Se mantiene la validación a mano del servicio**, y además el schema pone sus propias reglas (doble protección).
  - **La dirección de MongoDB se puede cambiar** con la variable de entorno `MONGODB_URI`. Si no existe, se usa la local.
- **Fase 3, paso 5: pruebas.**
  - API con `curl`: crear, listar, editar, datos malos → 400, id con formato malo → 404, id inexistente → 404, borrar → 204, borrar otra vez → 404 ✅
  - Con `mongosh` se ve el documento guardado dentro de MongoDB (con su `_id`) ✅
  - **Persistencia:** paramos y volvimos a arrancar el backend *y* MongoDB, y el producto seguía ahí ✅ (en la Fase 2 se perdía).
  - Problema durante las pruebas: en zsh, `GID` es una variable reservada (el número de grupo del usuario). Un script de prueba falló por usarla; se cambió el nombre. No afecta al proyecto.

- **Fase 3, paso 6: prueba en el navegador (Claude, con Chrome)** ✅
  - Igual que en la Fase 2, la web se sirvió temporalmente en `http://localhost:8080` y la ventana `confirm` se simuló con JavaScript.
  - La página carga lo que ya había en MongoDB (el MacBook creado con `curl`).
  - **Crear** iPad Pro → **editar** su stock de 4 a 10 → **borrar** el MacBook: todo bien.
  - Al recargar la página, los datos siguen ahí. Con `mongosh` se ve exactamente lo mismo que en la web.
  - `localStorage` sigue vacío.
- **Cierre de la Fase 3:** la usuaria aprobó cerrar. Commit `fase3` y push a GitHub.

#### ✅ Resumen de la Fase 3 (qué hemos aprendido)
- **Pieza nueva: la base de datos (MongoDB).** Guarda los datos en el disco, así que sobreviven aunque se apague el servidor o el ordenador.
- **Vocabulario de MongoDB:**
  - Base de datos (`productos`) → colecciones (`productos`) → documentos (cada producto, parecido a un objeto JSON).
  - Cada documento tiene un `_id` único que genera MongoDB.
- **Dos programas distintos:** `mongod` es el servidor que guarda los datos. `mongosh` es la consola para mirarlos y cambiarlos a mano.
- **Mongoose** es el "traductor" entre NestJS y MongoDB:
  - **Schema:** describe cómo es un documento (campos, tipos, reglas).
  - **Modelo:** el objeto con el que se habla con la colección (`find`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`).
- **Cadena de conexión:** `mongodb://127.0.0.1:27017/productos` = protocolo + ordenador + puerto + base de datos.
- **Separar capas tiene premio:** solo cambiamos el servicio (y añadimos el schema). El controlador casi no cambió y el frontend nada.
- **Ahora hay 3 programas funcionando a la vez:** MongoDB (27017), el backend (3000) y el navegador con el frontend.

#### Fase 4: repaso final (el viaje de un dato)
Ejemplo: se crea "iPad Pro" desde el formulario.

**Ida (del formulario a MongoDB)**
1. **Navegador, evento:** al pulsar Guardar salta el `submit` (`frontend/app.js:140`).
2. **Navegador, recoger datos:** se leen los campos y se monta el objeto `datos` (`app.js:146`).
3. **Navegador, petición HTTP:** `crearProducto` (`app.js:47`) convierte `datos` a texto JSON y llama a `fetch` (`app.js:25`).
   - Envía `POST http://localhost:3000/productos` (`app.js:8`) con la cabecera `Content-Type: application/json`.
4. **Por la red local:** la petición sale del navegador hacia el puerto 3000. Como la web viene de otro origen, el navegador comprueba **CORS**, y el backend lo permite (`backend/src/main.ts:11`).
5. **NestJS, controlador:** `@Controller('productos')` + `@Post()` deciden quién atiende (`productos.controller.ts:20, 36`). `@Body()` convierte el JSON en objeto.
6. **NestJS, servicio:** `create` (`productos.service.ts:36`) primero **valida** (`:97`). Si hay errores, responde 400 (`:116`) y el viaje termina aquí.
7. **Mongoose:** `this.modelo.create(...)` (`:37`) comprueba el schema (`producto.schema.ts`) y envía el documento a MongoDB por la conexión de `app.module.ts:13,17` (`mongodb://127.0.0.1:27017/productos`).
8. **MongoDB:** guarda el documento en la colección `productos` (en el disco, `~/.local/mongodb-data`) y le pone un `_id`.

**Vuelta (de MongoDB a la pantalla)**
9. **Mongoose → servicio:** MongoDB devuelve el documento guardado. `aProducto` (`:82`) lo traduce: `_id` → `id` en texto (`:84`).
10. **Controlador → HTTP:** Nest lo convierte a JSON y responde **201 Created**.
11. **Navegador:** `fetch` recibe la respuesta. `respuesta.json()` (`app.js:38`) la convierte en objeto.
12. **Navegador, refrescar:** `pintarProductos` (`app.js:162` → `:84`) pide la lista completa con un segundo viaje, `GET /productos` → `findAll` → `modelo.find()` (`service:26`).
13. **Navegador, pintar:** se genera una tarjeta por producto (`app.js:99`), escapando los textos (`:102`).

**Las 4 operaciones del CRUD hacen el mismo viaje**, solo cambian el método HTTP y la función de Mongoose:

| Acción | Frontend | HTTP | Servicio | Mongoose |
|---|---|---|---|---|
| Crear | `crearProducto` | POST /productos | `create` | `create` |
| Listar | `leerProductos` | GET /productos | `findAll` | `find` |
| Editar | `editarProducto` | PUT /productos/:id | `update` | `findByIdAndUpdate` |
| Borrar | `borrarProducto` | DELETE /productos/:id | `remove` | `findByIdAndDelete` |

**Qué añadió cada fase**
- Fase 1: el frontend (los datos en el navegador, con localStorage).
- Fase 2: el backend y la API REST (los datos en la memoria del servidor; aparecen HTTP, JSON y CORS).
- Fase 3: la base de datos (los datos en disco y persistentes; aparecen Mongoose, schema y modelo).

- **Cierre de la Fase 4 y del proyecto:** la usuaria pidió cerrar la fase, hacer el commit, subirlo y "desplegarlo para verlo". Commit `fase4` y push a GitHub.

#### ✅ Resumen de la Fase 4 (qué hemos aprendido)
- **Un proyecto fullstack son 3 piezas que hablan entre sí:**
  - Frontend (navegador) ⇄ HTTP + JSON ⇄ Backend (NestJS) ⇄ Mongoose ⇄ Base de datos (MongoDB).
- **Cada pieza tiene un trabajo:**
  - El frontend enseña y recoge datos.
  - El backend aplica las reglas (validar) y decide.
  - La base de datos guarda.
- **Todas las operaciones siguen el mismo camino.** Solo cambian el método HTTP y la función de Mongoose.
- **Al separar en piezas, se puede cambiar una sin tocar las demás** (de memoria a MongoDB, sin cambiar el frontend).

- **"Desplegar para verlo":** la usuaria eligió verla **en su Mac**, no publicarla en internet ni en GitHub Pages.
  - Por qué: así se respeta la regla "todo en local" y no hace falta crear cuentas.
  - Claude abrió la app en una pestaña de Chrome (`http://localhost:8080`, servida temporalmente), con el backend y MongoDB encendidos.

- **Token de GitHub regenerado.** La usuaria pegó el nuevo en el chat ("estamos en un entorno de clase") y Claude sustituyó el guardado en `~/.git-credentials`.
  - Decisión de la usuaria: acepta que el token quede en el historial porque es un entorno de clase.
  - Recomendación: borrarlo en GitHub al terminar el curso.

- **Ver la base de datos:**
  - **mongosh:** Claude abrió una ventana de Terminal con `mongosh mongodb://127.0.0.1:27017/productos`. Había 3 productos (iPad Pro, MacBook Air y Pixel 99; los dos últimos creados por la usuaria desde la web).
  - **MongoDB Compass 1.53.3** (la aplicación visual de MongoDB), con aprobación de la usuaria:
    - Descargado de `downloads.mongodb.com` (versión `.zip`, 183 MB) y descomprimido en `~/Applications`, sin necesidad de administrador.
    - Firma comprobada: "Developer ID Application: MongoDB, Inc." ✅
    - Para conectar: `mongodb://127.0.0.1:27017` → base de datos `productos` → colección `productos`.

#### Fase 5: despliegue en Render (nueva, a petición de la usuaria)
- **Petición:** subir el fullstack a Render (cuenta free) usando GitHub Actions, con una guía y los archivos necesarios.
- **Decisiones:**
  - **MongoDB Atlas (M0, gratis) como base de datos en producción.**
    - Por qué: Render no ofrece MongoDB. La usuaria ya tenía cuenta de Atlas, con el proyecto "Project 0" y el cluster "Cluster0" (FREE).
    - En el Mac se sigue usando el MongoDB local.
  - **2 servicios en Render** (elegido por la usuaria): Static Site para el frontend y Web Service (free) para el backend. Es la misma estructura que en local.
  - **GitHub Actions comprueba y despliega:** build + tests y, solo si pasan, llama a los **Deploy Hooks** de Render. En Render, `autoDeployTrigger: off`.
    - Por qué: así nunca se despliega código roto, y en la pestaña Actions se ve cada despliegue.
  - **Node 24 (LTS)** en Render y en Actions (`backend/.node-version`). NestJS 12 y Mongoose 9 piden Node 20.19 o superior.
  - **La URL del backend sale de `frontend/config.js`.** En local es `localhost`; Render lo sobrescribe al construir con la variable `API_URL`. Si falta `API_URL`, el build falla a propósito.
  - **CORS configurable con `CORS_ORIGIN`.** En local sigue abierto; en Render solo se permite la URL del frontend.
  - Región de Render: Frankfurt, la más cercana.
- **Sesión en Atlas:** Claude abrió la página de login en Chrome. La usuaria ya tenía la sesión iniciada, así que no hizo falta escribir nada.
- **Archivos nuevos o cambiados:**
  - Nuevos: `render.yaml`, `.github/workflows/deploy.yml`, `DESPLIEGUE.md`, `frontend/config.js`, `backend/.node-version`.
  - Cambiados: `frontend/index.html` (carga `config.js`), `frontend/app.js` (lee `window.API_URL`), `backend/src/main.ts` (`CORS_ORIGIN`), `CLAUDE.md` (fase 5 y cambio de la regla "todo en local").
- **Comprobado en local:** build OK, tests OK, el comando de build del frontend escribe bien `config.js` (y falla sin `API_URL`), y CORS con `CORS_ORIGIN` deja pasar solo el origen permitido.

### Pendiente
- **Fase 5:** seguir `DESPLIEGUE.md`.
  - Paso 1 (usuaria): añadir al token el permiso **Workflows**.
  - Paso 2 (Claude): commit + push.
  - Pasos 3–7: Atlas, Blueprint de Render, Deploy Hooks, secrets de GitHub y prueba.
- Añadir Git al PATH en `~/.zshrc`.
- Al terminar el curso: borrar el token en GitHub.
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
