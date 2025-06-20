import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment';
import { Observable } from 'rxjs';
import { Cliente } from '../cliente/cliente';
import { Producto } from '../producto/procuto';
import { FacturaRequestDTO, FacturaResponseDTO } from './factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaencabezadoService {


  constructor(private readonly http: HttpClient) {}

  // Clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${environment.urlhost}/api/clientes`);
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${environment.urlhost}/api/clientes`, cliente);
  }

  // Productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.urlhost}/productos`);
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${environment.urlhost}/productos`, producto);
  }

  // Facturas
  getFacturas(): Observable<FacturaResponseDTO[]> {
    return this.http.get<FacturaResponseDTO[]>(`${environment.urlhost}/api/facturas`);
  }

  crearFactura(factura: FacturaRequestDTO): Observable<FacturaResponseDTO> {
    return this.http.post<FacturaResponseDTO>(`${environment.urlhost}/api/facturas`, factura);
  }
}
