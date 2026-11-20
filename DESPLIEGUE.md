# Guía de despliegue en Render (con MongoDB Atlas y GitHub Actions)

Esta guía explica cómo publicar la app en internet. Al terminar, tendrás:

```
Navegador ──► productos-frontend  (Render · Static Site · gratis)
              │ fetch (HTTPS)
              ▼
              productos-backend   (Render · Web Service · free)
              │ Mongoose
              ▼
              Cluster0            (MongoDB Atlas · M0 · gratis)
```

Cada `git push` a `main` pasa por **GitHub Actions**:

```
git push ──► GitHub Actions: compilar + tests ──(si todo OK)──► Render despliega backend y frontend
                                             └─(si falla)────► no se despliega nada
```

> ⚠️ **Plan free de Render:** el backend se "duerme" tras 15 minutos sin visitas.
> La primera petición después tarda hasta **1 minuto** en responder. Es normal.

---

## Archivos que intervienen

| Archivo | Para qué sirve |
|---|---|
| `render.yaml` | "Blueprint": describe los 2 servicios de Render |
| `.github/workflows/deploy.yml` | La GitHub Action: comprueba y despliega |
| `backend/.node-version` | Versión de Node (24) para Render y GitHub Actions |
| `frontend/config.js` | Dirección del backend. En Render se sobrescribe al desplegar |
| `backend/src/main.ts` | Lee `PORT` (lo pone Render) y `CORS_ORIGIN` |
| `backend/src/app.module.ts` | Lee `MONGODB_URI` (la conexión con Atlas) |

## Variables de entorno (configuración secreta)

| Servicio | Variable | Valor | Ejemplo |
|---|---|---|---|
| productos-backend | `MONGODB_URI` | Cadena de conexión de Atlas | `mongodb+srv://app:CLAVE@cluster0.xxxxx.mongodb.net/productos?retryWrites=true&w=majority` |
| productos-backend | `CORS_ORIGIN` | URL del frontend | `https://productos-frontend.onrender.com` |
| productos-frontend | `API_URL` | URL del backend + `/productos` | `https://productos-backend.onrender.com/productos` |

## Secrets de GitHub

| Secret | Valor |
|---|---|
| `RENDER_DEPLOY_HOOK_BACKEND` | Deploy Hook de productos-backend |
| `RENDER_DEPLOY_HOOK_FRONTEND` | Deploy Hook de productos-frontend |

---

## Paso 1 · Dar al token de GitHub el permiso "Workflows"

GitHub no deja subir archivos de `.github/workflows/` con un token que no tenga ese permiso.

1. Abre https://github.com/settings/personal-access-tokens y entra en tu token.
2. **Edit** → *Repository permissions* → **Workflows** → *Read and write*.
3. Guarda (**Update**). El token no cambia, así que no hace falta volver a guardarlo en Git.

## Paso 2 · Subir los archivos a GitHub

Lo hace Claude con un `git push`. Después de este push, la Action se ejecutará:

- El trabajo **Comprobar** debería salir ✅.
- **Desplegar** mostrará un aviso ⚠️ "Falta el secret...". Es normal: los secrets se ponen en el paso 6.

## Paso 3 · Preparar MongoDB Atlas

Entra en https://cloud.mongodb.com (proyecto **Project 0**, cluster **Cluster0**).

### 3.1 Crear el usuario de la base de datos
Es el usuario con el que **la app** se conecta, no tu cuenta de Atlas.

1. Menú izquierdo → **Database & Network Access** (o *Security → Database Access*) → **Add New Database User**.
2. *Authentication Method*: **Password**.
3. *Username*: por ejemplo `app-productos`.
4. *Password*: pulsa **Autogenerate Secure Password** y **cópiala** a un lugar seguro.
   - Usa solo letras y números. Los símbolos como `@ : / ? #` dan problemas en la cadena de conexión.
5. *Database User Privileges*: **Read and write to any database**.
6. **Add User**.

### 3.2 Permitir conexiones desde Render
El plan free de Render no tiene una IP fija, así que hay que permitir cualquier IP.

1. **Network Access** (o *IP Access List*) → **Add IP Address**.
2. **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**.
   - La protección real está en el usuario y la contraseña del paso 3.1.

### 3.3 Copiar la cadena de conexión
1. **Clusters** → en Cluster0, botón **Connect** → **Drivers**.
2. Copia la cadena, que empieza por `mongodb+srv://`.
3. Haz dos cambios:
   - Sustituye `<db_password>` por la contraseña del paso 3.1.
   - Añade `productos` **justo después de** `.mongodb.net/`, que es el nombre de la base de datos:
   ```
   mongodb+srv://app-productos:CLAVE@cluster0.xxxxx.mongodb.net/productos?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Guárdala: es el valor de `MONGODB_URI`. **No la subas a GitHub ni la pegues en archivos del proyecto.**

## Paso 4 · Crear los servicios en Render con el Blueprint

1. Entra en https://dashboard.render.com.
2. **New +** → **Blueprint**.
3. Conecta GitHub si te lo pide y da acceso **solo** al repositorio `DEL_PRUEBACIFO`.
4. Elige el repositorio `ladynaiky/DEL_PRUEBACIFO`, rama `main`. Render encontrará `render.yaml`.
5. *Blueprint Name*: por ejemplo `productos`.
6. Render pedirá las variables con `sync: false`:
   - `MONGODB_URI`: la cadena del paso 3.3.
   - `CORS_ORIGIN`: `https://productos-frontend.onrender.com`
   - `API_URL`: `https://productos-backend.onrender.com/productos`
7. **Apply** (o *Deploy Blueprint*). Render crea los 2 servicios y hace el **primer despliegue**.

> 🔎 **Comprueba las URLs reales.** Si el nombre ya estaba cogido, Render añade letras
> (por ejemplo `productos-backend-ab12.onrender.com`). Mira la URL de cada servicio en su
> página y, si no coincide, corrige `CORS_ORIGIN` y `API_URL` en
> *Environment* → **Save, rebuild, and deploy**.

## Paso 5 · Comprobar que el backend funciona

1. Abre `https://productos-backend.onrender.com/` → debe salir `Hello World!`.
   - La primera vez puede tardar hasta un minuto.
2. Abre `https://productos-backend.onrender.com/productos` → debe salir `[]` (la lista vacía de Atlas).
3. Si sale un error, mira **Logs** en el servicio (ver "Problemas frecuentes").

## Paso 6 · Conectar GitHub Actions con Render (Deploy Hooks)

Un **Deploy Hook** es una URL secreta. Si alguien la llama, Render despliega.

1. En Render → **productos-backend** → **Settings** → **Deploy Hook** → copia la URL.
2. En GitHub → repositorio → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - *Name*: `RENDER_DEPLOY_HOOK_BACKEND` · *Secret*: la URL copiada → **Add secret**.
3. Repite con **productos-frontend** → secret `RENDER_DEPLOY_HOOK_FRONTEND`.

> Trata los Deploy Hooks como contraseñas: no los pegues en archivos ni en el chat.

## Paso 7 · Probar el ciclo completo

1. GitHub → pestaña **Actions** → **CI y despliegue en Render** → **Run workflow** (rama `main`).
2. Espera a que los dos trabajos salgan ✅.
3. En Render verás un despliegue nuevo en cada servicio ("Deploy triggered via deploy hook").
4. Abre `https://productos-frontend.onrender.com`, crea un producto y recarga la página: debe seguir ahí.
5. En Atlas → **Data Explorer** (o *Browse Collections*) → base `productos` → colección `productos`: verás el documento.

---

## A partir de ahora (día a día)

1. Cambias código en tu Mac y lo pruebas en local (MongoDB + `npm run start:dev`).
2. `git commit` + `git push`.
3. GitHub Actions comprueba. Si todo va bien, Render despliega solo, en unos 2–5 minutos.
4. Si la Action falla (❌), **no se despliega nada**: lo arreglas y vuelves a hacer push.

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| El push falla con *refusing to allow a Personal Access Token to create or update workflow* | Al token le falta el permiso Workflows | Paso 1 |
| La web dice "No se puede conectar con el servidor" | El backend está dormido o arrancando | Espera 1 minuto y recarga |
| En la consola del navegador sale un error de **CORS** | `CORS_ORIGIN` no coincide exactamente con la URL del frontend | Corrígelo en Render, sin `/` al final |
| La web llama a `localhost:3000` | `API_URL` vacía o mal escrita | Revisa `API_URL` en productos-frontend y redespliega |
| Logs del backend: `MongoServerError: bad auth` | Usuario o contraseña de Atlas mal | Revisa `MONGODB_URI` (paso 3.3) |
| Logs del backend: `Could not connect to any servers` / timeout | Atlas no permite la conexión | Paso 3.2 (`0.0.0.0/0`) |
| El build del frontend falla en `test -n "$API_URL"` | Falta la variable `API_URL` | Añádela en *Environment* |
| La Action dice "Falta el secret..." | No se han creado los secrets | Paso 6 |

## Seguridad: qué es secreto y dónde va

| Dato | Dónde se guarda | ¿En GitHub? |
|---|---|---|
| Contraseña del usuario de Atlas (dentro de `MONGODB_URI`) | Render → Environment | ❌ Nunca |
| Deploy Hooks | GitHub → Secrets | Solo como *secret*, nunca en archivos |
| Token de GitHub | `~/.git-credentials` en tu Mac | ❌ Nunca |
| URLs públicas (`*.onrender.com`) | `render.yaml` / variables | ✅ No son secretas |
