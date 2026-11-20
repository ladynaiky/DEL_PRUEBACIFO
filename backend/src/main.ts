// main.ts — El punto de arranque del servidor
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite que el navegador llame a esta API desde otra "web"
  // (nuestro frontend se abre como archivo, no desde localhost:3000).
  // En desarrollo lo abrimos a cualquier origen; en un proyecto real se limitaría.
  app.enableCors();

  // El servidor escucha en el puerto 3000 → http://localhost:3000
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
