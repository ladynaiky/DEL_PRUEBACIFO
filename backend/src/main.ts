// main.ts — El punto de arranque del servidor
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite que el navegador llame a esta API desde otra "web".
  // - En tu Mac (sin CORS_ORIGIN): abierto a cualquier origen, para poder abrir
  //   el frontend como archivo o desde localhost.
  // - En Render: CORS_ORIGIN = la URL del frontend (p. ej. https://productos-frontend.onrender.com),
  //   así solo NUESTRA web puede usar la API desde un navegador.
  //   Se pueden poner varias separadas por comas.
  const origenes = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors(origenes.length > 0 ? { origin: origenes } : undefined);

  // El servidor escucha en el puerto que diga la variable PORT (Render la pone sola)
  // o en el 3000 → http://localhost:3000
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
