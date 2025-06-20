import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment';
import { Observable, of } from 'rxjs';
import { Cliente } from '../cliente/cliente';
import { Producto } from '../producto/procuto';
import { FacturaRequestDTO, FacturaResponseDTO } from './factura.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacturaencabezadoService {


  constructor(private readonly http: HttpClient) {}

  // Clientes - Por ahora devolvemos un array vacío ya que no existe el endpoint
  getClientes(): Observable<Cliente[]> {
    // TODO: Implementar endpoint de clientes en el backend
    return of([]); // Devuelve un array vacío por ahora
    // return this.http.get<Cliente[]>(`${environment.urlhost}/api/clientes`);
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    // TODO: Implementar endpoint de clientes en el backend
    return of(cliente); // Simula la creación por ahora
    // return this.http.post<Cliente>(`${environment.urlhost}/api/clientes`, cliente);
  }

  // Productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.urlhost}/producto/`)
      .pipe(
        catchError(() => of([])) // Si falla, devuelve array vacío
      );
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${environment.urlhost}/producto/`, producto)
      .pipe(
        catchError(() => of(producto)) // Si falla, devuelve el producto tal como se envió
      );
  }
  // Facturas
  getFacturas(): Observable<FacturaResponseDTO[]> {
    return this.http.get<FacturaResponseDTO[]>(`${environment.urlhost}/facturaCliente/`)
      .pipe(
        catchError(() => of([])) // Si falla, devuelve array vacío
      );
  }

  crearFactura(factura: FacturaRequestDTO): Observable<FacturaResponseDTO> {
    return this.http.post<FacturaResponseDTO>(`${environment.urlhost}/facturaCliente/`, factura);
  }
}
