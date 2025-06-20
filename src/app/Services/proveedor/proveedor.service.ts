import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Proveedor } from './proveedor';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private readonly http:HttpClient) { }
  
    crearProveedor(proveedor:Proveedor):Observable<Proveedor>{
      return this.http.post<Proveedor>(environment.urlhost +"/proveedor/",proveedor)
    }
  
    obtenerProveedors():Observable<Proveedor[]>{
      return this.http.get<Proveedor[]>(environment.urlhost + "/proveedor/")
    }
  
    eliminarProveedor(idProveedor:number):Observable<Proveedor>{
      return this.http.delete<Proveedor>(`${environment.urlhost }/proveedor/${idProveedor}`)
    }
}
