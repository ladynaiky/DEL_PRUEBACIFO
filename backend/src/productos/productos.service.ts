// =====================================================================
// productos.service.ts — Las reglas de los productos y el acceso a los datos
// =====================================================================
// El servicio sabe crear, leer, editar y borrar. No sabe nada de HTTP
// (URLs, peticiones...): eso es cosa del controlador.
//
// FASE 3: los datos ya NO están en una lista en memoria, sino en MongoDB.
// Usamos un "modelo" de Mongoose: un objeto con métodos para hablar con la
// colección "productos" (find, findById, create, findByIdAndUpdate...).
//
// Hablar con la base de datos tarda un poco, por eso todo es "async" y usa "await".

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, type HydratedDocument } from 'mongoose';
import type { DatosProducto, Producto } from './producto.js';
import { ProductoDB } from './producto.schema.js';

@Injectable()
export class ProductosService {
  // Nest nos "inyecta" el modelo de Mongoose para la colección de productos
  constructor(@InjectModel(ProductoDB.name) private readonly modelo: Model<ProductoDB>) {}

  // LEER todos
  async findAll(): Promise<Producto[]> {
    const documentos = await this.modelo.find();
    return documentos.map((doc) => this.aProducto(doc));
  }

  // LEER uno por su id (si no existe → error 404 "no encontrado")
  async findOne(id: string): Promise<Producto> {
    return this.aProducto(await this.buscarDocumento(id));
  }

  // CREAR: MongoDB genera el id (_id) automáticamente
  async create(datos: DatosProducto): Promise<Producto> {
    const documento = await this.modelo.create(this.validar(datos));
    return this.aProducto(documento);
  }

  // EDITAR: sustituye los datos del producto con ese id (el id no cambia)
  async update(id: string, datos: DatosProducto): Promise<Producto> {
    const datosValidos = this.validar(datos);
    await this.buscarDocumento(id); // si no existe, lanza el 404
    const actualizado = await this.modelo.findByIdAndUpdate(id, datosValidos, {
      returnDocument: 'after', // devuélveme el documento YA cambiado
      runValidators: true,     // aplica también las reglas del schema
    });
    if (!actualizado) throw this.noExiste(id);
    return this.aProducto(actualizado);
  }

  // BORRAR
  async remove(id: string): Promise<void> {
    const borrado = this.esIdValido(id) ? await this.modelo.findByIdAndDelete(id) : null;
    if (!borrado) throw this.noExiste(id);
  }

  // ---------------------------------------------------------------------
  // Funciones de ayuda (privadas: solo se usan dentro de este servicio)
  // ---------------------------------------------------------------------

  // Busca un documento por id; si el id no tiene el formato de MongoDB o no existe → 404
  private async buscarDocumento(id: string): Promise<HydratedDocument<ProductoDB>> {
    const documento = this.esIdValido(id) ? await this.modelo.findById(id) : null;
    if (!documento) throw this.noExiste(id);
    return documento;
  }

  // Los ids de MongoDB tienen un formato concreto (24 caracteres hexadecimales).
  // Si nos llega otra cosa, ni lo buscamos: simplemente "no existe".
  private esIdValido(id: string): boolean {
    return isValidObjectId(id);
  }

  private noExiste(id: string): NotFoundException {
    return new NotFoundException(`No existe ningún producto con id ${id}`);
  }

  // Convierte un documento de MongoDB en el objeto que enviamos al frontend.
  // MongoDB llama al id "_id"; el frontend espera "id" (texto), como en la Fase 2.
  private aProducto(doc: HydratedDocument<ProductoDB>): Producto {
    return {
      id: doc._id.toString(),
      nombre: doc.nombre,
      marca: doc.marca,
      categoria: doc.categoria,
      precio: doc.precio,
      stock: doc.stock,
      descripcion: doc.descripcion,
    };
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
