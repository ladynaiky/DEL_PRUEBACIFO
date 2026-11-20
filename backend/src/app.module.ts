// app.module.ts — El módulo principal: aquí se "enchufan" todos los demás módulos
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from './productos/productos.module.js';

// Dirección de la base de datos:
//   mongodb://   → protocolo de MongoDB
//   127.0.0.1    → este mismo ordenador
//   27017        → puerto por defecto de MongoDB
//   /productos   → nombre de la base de datos (se crea sola al guardar el primer dato)
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/productos';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI), // ← conexión con MongoDB (una sola vez, aquí)
    ProductosModule,                     // ← nuestro módulo de productos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
