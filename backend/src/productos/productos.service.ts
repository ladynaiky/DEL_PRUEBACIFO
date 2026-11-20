// =====================================================================
// productos.service.ts — El "almacén" y las reglas de los productos
// =====================================================================
// El servicio guarda los datos y sabe crear, leer, editar y borrar.
// No sabe nada de HTTP (URLs, peticiones...): eso es cosa del controlador.
//
// FASE 2: los datos viven EN MEMORIA (una lista de JavaScript).
// Si se para el servidor, la lista se pierde. En la Fase 3 la cambiaremos por MongoDB.

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { DatosProducto, Producto } from './producto.js';

@Injectable()
export class ProductosService {
  // La "base de datos" de momento: una simple lista en memoria
  private productos: Producto[] = [];

  // LEER todos
  findAll(): Producto[] {
    return this.productos;
  }

  // LEER uno por su id (si no existe → error 404 "no encontrado")
  findOne(id: string): Producto {
    const producto = this.productos.find((p) => p.id === id);
    if (!producto) {
      throw new NotFoundException(`No existe ningún producto con id ${id}`);
    }
    return producto;
  }

  // CREAR: el servidor pone el id (igual que hacía el frontend en la Fase 1)
  create(datos: DatosProducto): Producto {
    const producto: Producto = { id: Date.now().toString(), ...this.validar(datos) };
    this.productos.push(producto);
    return producto;
  }

  // EDITAR: sustituye los datos del producto con ese id (el id no cambia)
  update(id: string, datos: DatosProducto): Producto {
    this.findOne(id); // si no existe, lanza el 404
    const actualizado: Producto = { id, ...this.validar(datos) };
    this.productos = this.productos.map((p) => (p.id === id ? actualizado : p));
    return actualizado;
  }

  // BORRAR
  remove(id: string): void {
    this.findOne(id); // si no existe, lanza el 404
    this.productos = this.productos.filter((p) => p.id !== id);
  }

  // Comprueba que los datos son correctos (si no → error 400 "petición incorrecta").
  // El navegador ya valida el formulario, pero el servidor NUNCA debe fiarse:
  // cualquiera podría enviarle datos sin pasar por nuestra web.
  private validar(datos: DatosProducto): DatosProducto {
    const d = datos ?? ({} as DatosProducto);
    const errores: string[] = [];

    const texto = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
    const nombre = texto(d.nombre);
    const marca = texto(d.marca);
    const categoria = texto(d.categoria);
    const descripcion = texto(d.descripcion);
    const precio = Number(d.precio);
    const stock = Number(d.stock);

    if (!nombre) errores.push('El nombre es obligatorio');
    if (!marca) errores.push('La marca es obligatoria');
    if (!categoria) errores.push('La categoría es obligatoria');
    if (!Number.isFinite(precio) || precio < 0) errores.push('El precio debe ser un número mayor o igual que 0');
    if (!Number.isInteger(stock) || stock < 0) errores.push('El stock debe ser un número entero mayor o igual que 0');

    if (errores.length > 0) {
      throw new BadRequestException(errores);
    }

    return { nombre, marca, categoria, precio, stock, descripcion };
  }
}
