// src/types/productos.ts
export interface CartaProducto {
  id: number; // importante para identificar en el carrito
  image: string;
  name: string;
  descripcion: string;
  costo: number;
  stock: number;
}

export interface CartaProps extends CartaProducto {
  onAddToCart: (producto: CartaProducto) => void;
}

export interface ItemCarrito extends CartaProducto {
  cantidad: number; // 👈 diferencia clave
}