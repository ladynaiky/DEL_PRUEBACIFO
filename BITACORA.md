# Bitácora del proyecto

Diario de todo lo que hacemos y decidimos. La entrada más reciente va arriba.

## Estado actual (resumen rápido)
- **Fase completada:** 1 (Frontend sin backend).
- **Siguiente:** Fase 2. Añadir el backend NestJS (antes, revisar Node, npm y Nest CLI).
- **Archivos del proyecto:** `CLAUDE.md`, `INSTRUCCIONES_PROYECTO.md`, `BITACORA.md`, `.gitignore`, `frontend/` (`index.html`, `styles.css`, `app.js`).
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
