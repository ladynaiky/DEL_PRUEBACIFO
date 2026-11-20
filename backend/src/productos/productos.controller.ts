// =====================================================================
// productos.controller.ts — Las "puertas" de la API (rutas HTTP)
// =====================================================================
// El controlador recibe las peticiones que llegan por internet,
// le pide el trabajo al servicio y devuelve la respuesta.
//
// Todas las rutas empiezan por /productos (por el @Controller('productos')):
//
//   Método   URL                 Qué hace          Equivale en la Fase 1 a...
//   GET      /productos          Listar todos      leerProductos()
//   GET      /productos/:id      Ver uno           productos.find(...)
//   POST     /productos          Crear             productos.push(...)
//   PUT      /productos/:id      Editar            productos.map(...)
//   DELETE   /productos/:id      Borrar            productos.filter(...)

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import type { DatosProducto } from './producto.js';

@Controller('productos')
export class ProductosController {
  // Nest nos "inyecta" el servicio automáticamente (no hace falta crearlo con new)
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  // @Body() = los datos que envía el frontend, en formato JSON
  @Post()
  create(@Body() datos: DatosProducto) {
    return this.productosService.create(datos);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() datos: DatosProducto) {
    return this.productosService.update(id, datos);
  }

  // 204 = "hecho, y no hay nada que devolver"
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.productosService.remove(id);
  }
}
