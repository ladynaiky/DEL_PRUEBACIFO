# Cómo retomar el proyecto (lunes)

## 1. Antes de abrir Claude Code
- Ten a mano **la nota con la cadena de conexión de Atlas** (`mongodb+srv://app-productos:...`), si llegaste a copiarla.
  - Si no la tienes o perdiste la contraseña, no pasa nada: se regenera en Atlas (lo explica la bitácora).
- Abre la app **Terminal** y entra en el proyecto:
  ```
  cd ~/Documents/proyectos/actividad01
  claude
  ```

## 2. Prompt para pegar en Claude Code

```
Retomamos el proyecto. Lee CLAUDE.md, BITACORA.md (sobre todo "Estado actual" y el
último "Pendiente (para el lunes)") y DESPLIEGUE.md.

Estamos en la Fase 5 (despliegue en Render con MongoDB Atlas y GitHub Actions).
Ya están hechos los pasos 1, 2, 3.1 y 3.2 de DESPLIEGUE.md. Me quedé en el paso 3.3:
copiar la cadena de conexión de Atlas (Clusters → Connect → Drivers) a una nota.

Hazme un resumen corto de dónde estamos y qué pasos quedan, con una tabla de
quién hace cada uno (tú o yo). Después guíame paso a paso, de uno en uno, empezando
por el 3.3. Recuerda: la contraseña de Atlas y la MONGODB_URI no te las pego en el
chat; las pego yo directamente en Render.
```

## 3. Resumen del estado (por si acaso)

| Paso de `DESPLIEGUE.md` | Quién | Estado |
|---|---|---|
| 1. Permiso Workflows en el token de GitHub | Claude | ✅ |
| 2. Subir archivos a GitHub (la Action #1 salió ✅) | Claude | ✅ |
| 3.1 Usuario `app-productos` en Atlas | Usuaria | ✅ |
| 3.2 Permitir `0.0.0.0/0` en Atlas | Claude | ✅ |
| **3.3 Copiar la cadena de conexión** | **Usuaria** | ⏳ **siguiente** |
| 4. Blueprint en Render (2 servicios + 3 variables) | Usuaria + Claude | ⬜ |
| 5. Comprobar el backend en Render | Claude | ⬜ |
| 6. Deploy Hooks → GitHub Secrets | Usuaria + Claude | ⬜ |
| 7. Probar la web pública | Claude | ⬜ |

## 4. Enlaces útiles
- Repositorio: https://github.com/ladynaiky/DEL_PRUEBACIFO
- GitHub Actions: https://github.com/ladynaiky/DEL_PRUEBACIFO/actions
- MongoDB Atlas: https://cloud.mongodb.com
- Render: https://dashboard.render.com

## 5. Para usar la app en local (si quieres verla en tu Mac)
1. MongoDB: `~/.local/mongodb/bin/mongod --dbpath ~/.local/mongodb-data --bind_ip 127.0.0.1 --port 27017` (deja esa terminal abierta).
2. Backend, en otra terminal: `cd ~/Documents/proyectos/actividad01/backend && npm run start:dev`
3. Abre `frontend/index.html` con doble clic.
