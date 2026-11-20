// =====================================================================
// producto.schema.ts — Cómo se guarda un producto EN LA BASE DE DATOS
// =====================================================================
// MongoDB guarda "documentos" (parecidos a objetos JSON) dentro de "colecciones"
// (parecidas a listas). Este schema le dice a Mongoose qué campos tiene cada
// documento de la colección "productos", de qué tipo son y cuáles son obligatorios.
//
// No hace falta declarar el id: MongoDB añade a cada documento un "_id" único.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'productos', // nombre de la colección en MongoDB
  versionKey: false,       // no añadir el campo interno "__v"
})
export class ProductoDB {
  @Prop({ type: String, required: true, trim: true })
  nombre: string;

  @Prop({ type: String, required: true, trim: true })
  marca: string;

  @Prop({ type: String, required: true, trim: true })
  categoria: string;

  @Prop({ type: Number, required: true, min: 0 })
  precio: number;

  @Prop({ type: Number, required: true, min: 0 })
  stock: number;

  @Prop({ type: String, default: '', trim: true })
  descripcion: string;
}

// Convierte la clase anterior en un schema que Mongoose entiende
export const ProductoSchema = SchemaFactory.createForClass(ProductoDB);
