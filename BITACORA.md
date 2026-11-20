# Bitácora del proyecto

Diario de todo lo que hacemos y decidimos. La entrada más reciente va arriba.

## Estado actual (resumen rápido)
- **Fase completada:** 1 (Frontend sin backend).
- **Siguiente:** Fase 2. Añadir el backend NestJS (antes, revisar Node, npm y Nest CLI).
- **Archivos del proyecto:** `CLAUDE.md`, `INSTRUCCIONES_PROYECTO.md`, `BITACORA.md`, `.gitignore`, `frontend/` (`index.html`, `styles.css`, `app.js`).
- **Git:** activo en local. Primer commit: `fase1`.

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
- **Usar Git en local, sin GitHub.**
  - Por qué: para tener "fotos" del proyecto y poder volver atrás.
- **Instalar Git en el usuario con micromamba**, en lugar de pedirlo al administrador.
  - Por qué: no hay permisos de administrador y queríamos seguir ya.
- **Hacer un commit al terminar cada fase** (título `faseN`).
- **La bitácora se llama `BITACORA.md` y va en la raíz del proyecto.**
  - Por qué: así está a la vista, junto a `CLAUDE.md`.
- **Hay una entrada por día, con la más reciente arriba.**
  - Por qué: al retomar el trabajo, lo último es lo primero que se lee.

### Pendiente
- Añadir Git al PATH en `~/.zshrc` (para poder escribir solo `git`).
- Empezar la Fase 2. Antes, revisar si hay Node y npm: existe `~/.npm-global` en el PATH, así que puede que ya estén instalados.

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

### Pendiente
- Fase 2: backend NestJS con los datos en memoria del servidor.
