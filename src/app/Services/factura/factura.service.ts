import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Factura } from './factura';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

// Interfaces para MongoDB (coinciden exactamente con el backend)
export interface FacturaProveedorMongo {
  id?: string;
  urlPdf?: string;
  numeroFactura: string;
  fechaEmision: Date;
  fechaRegistro?: Date;
  total?: number;
  estadoDePago: string;
  productosRegistrados: boolean;
  visible: boolean;
  proveedorId: string;
  detalleIds?: string[];
}

export interface DetalleFacturaProveedorMongo {
  id?: string;
  facturaId: string;
  productoId: string;
  cantidad: number;
  precio: number;
}

export interface FacturaProveedorConDetalles {
  factura: FacturaProveedorMongo;
  detalles: DetalleFacturaProveedorMongo[];
}

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private readonly baseUrlProveedoresMongo = environment.urlhost + '/api/mongo/facturas-proveedores';
  private readonly baseUrlDetallesMongo = environment.urlhost + '/api/mongo/detalle-factura-proveedor';
  private readonly baseUrlMySQL = environment.urlhost + '/facturasProveedores/';

  constructor(private readonly http: HttpClient) { }

  // ========== MÉTODOS ORIGINALES (MySQL/JPA) ==========
  registrarFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.baseUrlMySQL, factura);
  }

  guardarFacturaPdf(file: File, id: number): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<string>(`${this.baseUrlMySQL}pdf/${id}`, formData);
  }

  obtenerFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.baseUrlMySQL);
  }

  // ========== MÉTODOS MONGO ==========
  
  // Crear factura de proveedor simple
  crearFacturaProveedorMongo(factura: FacturaProveedorMongo): Observable<FacturaProveedorMongo> {
    return this.http.post<FacturaProveedorMongo>(this.baseUrlProveedoresMongo, factura);
  }

  // Crear factura de proveedor con detalles
  crearFacturaProveedorConDetalles(facturaConDetalles: FacturaProveedorConDetalles): Observable<FacturaProveedorMongo> {
    return this.http.post<FacturaProveedorMongo>(`${this.baseUrlProveedoresMongo}/con-detalles`, facturaConDetalles);
  }

  // Obtener todas las facturas de proveedores MongoDB
  obtenerFacturasProveedoresMongo(): Observable<FacturaProveedorMongo[]> {
    return this.http.get<FacturaProveedorMongo[]>(this.baseUrlProveedoresMongo);
  }

  // Obtener factura de proveedor por ID
  obtenerFacturaProveedorMongoPorId(id: string): Observable<FacturaProveedorMongo> {
    return this.http.get<FacturaProveedorMongo>(`${this.baseUrlProveedoresMongo}/${id}`);
  }

  // Obtener facturas por proveedor
  obtenerFacturasPorProveedor(proveedorId: string): Observable<FacturaProveedorMongo[]> {
    return this.http.get<FacturaProveedorMongo[]>(`${this.baseUrlProveedoresMongo}/proveedor/${proveedorId}`);
  }

  // Obtener facturas por estado
  obtenerFacturasPorEstado(estado: string): Observable<FacturaProveedorMongo[]> {
    return this.http.get<FacturaProveedorMongo[]>(`${this.baseUrlProveedoresMongo}/estado/${estado}`);
  }

  // Obtener facturas visibles/ocultas
  obtenerFacturasPorVisibilidad(visible: boolean): Observable<FacturaProveedorMongo[]> {
    return this.http.get<FacturaProveedorMongo[]>(`${this.baseUrlProveedoresMongo}/visible/${visible}`);
  }

  // Actualizar factura de proveedor
  actualizarFacturaProveedorMongo(id: string, factura: FacturaProveedorMongo): Observable<FacturaProveedorMongo> {
    return this.http.put<FacturaProveedorMongo>(`${this.baseUrlProveedoresMongo}/${id}`, factura);
  }

  // Actualizar estado de pago
  actualizarEstadoPago(id: string, estadoDePago: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrlProveedoresMongo}/${id}/estado-pago`, { estadoDePago });
  }

  // Marcar productos como registrados
  marcarProductosRegistrados(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrlProveedoresMongo}/${id}/marcar-productos-registrados`, {});
  }

  // Eliminar factura de proveedor
  eliminarFacturaProveedorMongo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlProveedoresMongo}/${id}`);
  }

  // Obtener detalles de una factura de proveedor
  obtenerDetallesFacturaProveedor(facturaId: string): Observable<DetalleFacturaProveedorMongo[]> {
    return this.http.get<DetalleFacturaProveedorMongo[]>(`${this.baseUrlProveedoresMongo}/${facturaId}/detalles`);
  }

  // Guardar PDF en factura MongoDB
  guardarFacturaPdfMongo(file: File, id: string): Observable<FacturaProveedorMongo> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<FacturaProveedorMongo>(`${this.baseUrlProveedoresMongo}/${id}/pdf`, formData);
  }
  // ========== DETALLES DE FACTURA ==========

  // Crear detalle individual
  crearDetalleFacturaProveedor(detalle: DetalleFacturaProveedorMongo): Observable<DetalleFacturaProveedorMongo> {
    return this.http.post<DetalleFacturaProveedorMongo>(this.baseUrlDetallesMongo, detalle);
  }

  // Crear múltiples detalles
  crearMultiplesDetallesProveedor(detalles: DetalleFacturaProveedorMongo[]): Observable<DetalleFacturaProveedorMongo[]> {
    return this.http.post<DetalleFacturaProveedorMongo[]>(`${this.baseUrlDetallesMongo}/batch`, detalles);
  }

  // Obtener todos los detalles
  obtenerTodosDetallesProveedor(): Observable<DetalleFacturaProveedorMongo[]> {
    return this.http.get<DetalleFacturaProveedorMongo[]>(this.baseUrlDetallesMongo);
  }

  // Obtener detalle por ID
  obtenerDetalleProveedorPorId(id: string): Observable<DetalleFacturaProveedorMongo> {
    return this.http.get<DetalleFacturaProveedorMongo>(`${this.baseUrlDetallesMongo}/${id}`);
  }

  // Obtener detalles por factura
  obtenerDetallesPorFactura(facturaId: string): Observable<DetalleFacturaProveedorMongo[]> {
    return this.http.get<DetalleFacturaProveedorMongo[]>(`${this.baseUrlDetallesMongo}/factura/${facturaId}`);
  }

  // Obtener detalles por producto
  obtenerDetallesPorProducto(productoId: string): Observable<DetalleFacturaProveedorMongo[]> {
    return this.http.get<DetalleFacturaProveedorMongo[]>(`${this.baseUrlDetallesMongo}/producto/${productoId}`);
  }

  // Actualizar detalle
  actualizarDetalleProveedor(id: string, detalle: DetalleFacturaProveedorMongo): Observable<DetalleFacturaProveedorMongo> {
    return this.http.put<DetalleFacturaProveedorMongo>(`${this.baseUrlDetallesMongo}/${id}`, detalle);
  }

  // Eliminar detalle
  eliminarDetalleProveedor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlDetallesMongo}/${id}`);
  }

  // Eliminar detalles por factura
  eliminarDetallesPorFactura(facturaId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlDetallesMongo}/factura/${facturaId}`);
  }

  // Calcular total de factura
  calcularTotalFactura(facturaId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrlDetallesMongo}/total/factura/${facturaId}`);
  }

  // ========== MÉTODOS DE UTILIDAD ==========

  // Obtener estados de pago disponibles
  obtenerEstadosPago(): string[] {
    return ['PENDIENTE', 'PAGADA', 'VENCIDA', 'CANCELADA', 'EN_PROCESO'];
  }

  // Calcular subtotal de detalle
  calcularSubtotalDetalle(cantidad: number, precio: number): number {
    return cantidad * precio;
  }

  // Validar número de factura
  validarNumeroFactura(numeroFactura: string): boolean {
    return !!(numeroFactura && numeroFactura.trim().length > 0);
  }
}
