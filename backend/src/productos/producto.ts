// =====================================================================
// producto.ts — La "forma" de un producto (qué campos tiene y de qué tipo)
// =====================================================================
// TypeScript usa esto para avisarnos si nos equivocamos de campo o de tipo.
// Son los mismos campos que el formulario del frontend.

export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
}

// Los datos que llegan del formulario: todo menos el id (el id lo pone el servidor).
export type DatosProducto = Omit<Producto, 'id'>;
