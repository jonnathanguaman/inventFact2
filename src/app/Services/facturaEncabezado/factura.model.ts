import { Cliente } from "../cliente/cliente";
import { DetalleFacturaDetalleDTO } from "../detalleFactura/detallefactura";

export interface FacturaRequestDTO {
  clienteId: number;
  detalles: { productoId: number; cantidad: number; }[];
}

export interface FacturaResponseDTO {
  id: number;
  fecha: string;
  cliente: Cliente;
  detalles: DetalleFacturaDetalleDTO[];
  total: number;
}