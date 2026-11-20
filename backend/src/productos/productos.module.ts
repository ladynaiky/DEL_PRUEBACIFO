// =====================================================================
// productos.module.ts — La "caja" que agrupa todo lo de productos
// =====================================================================
// En NestJS cada funcionalidad va en su módulo. Este junta el controlador
// (las rutas) y el servicio (los datos). Luego se registra en app.module.ts.

import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller.js';
import { ProductosService } from './productos.service.js';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
