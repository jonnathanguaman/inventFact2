import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from './procuto';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private readonly http:HttpClient) { }

  crearProducto(producto:Producto):Observable<Producto>{
    return this.http.post<Producto>(environment.urlhost +"/producto/",producto)
  }

  obtenerProductos():Observable<Producto[]>{
    return this.http.get<Producto[]>(environment.urlhost + "/producto/")
  }

  eliminarProducto(idProducto:number):Observable<Producto>{
    return this.http.delete<Producto>(`${environment.urlhost }/producto/${idProducto}`)
  }

}
