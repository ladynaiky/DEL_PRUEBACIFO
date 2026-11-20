// =====================================================================
// productos.module.ts — La "caja" que agrupa todo lo de productos
// =====================================================================
// En NestJS cada funcionalidad va en su módulo. Este junta el controlador
// (las rutas), el servicio (las reglas) y, desde la Fase 3, el modelo de
// Mongoose para la colección "productos". Luego se registra en app.module.ts.

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './productos.controller.js';
import { ProductosService } from './productos.service.js';
import { ProductoDB, ProductoSchema } from './producto.schema.js';

@Module({
  imports: [
    // Registra el modelo "ProductoDB" para poder inyectarlo en el servicio
    MongooseModule.forFeature([{ name: ProductoDB.name, schema: ProductoSchema }]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
