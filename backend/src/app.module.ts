// app.module.ts — El módulo principal: aquí se "enchufan" todos los demás módulos
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from './productos/productos.module.js';

@Module({
  imports: [ProductosModule], // ← nuestro módulo de productos
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
