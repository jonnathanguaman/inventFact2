import { Producto } from "../producto/procuto";

export interface DetalleFacturaDTO {
  productoId: number;
  cantidad: number;
}

export interface DetalleFacturaDetalleDTO {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}