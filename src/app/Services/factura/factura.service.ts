import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Factura } from './factura';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService{

  constructor(private readonly http:HttpClient) { }

  registrarFactura(factura:Factura):Observable<Factura>{
    return this.http.post<Factura>(environment.urlhost +"/facturasProveedores/",factura)
  }

  guardarFacturaPdf(file: File, id:number): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<string>(`${environment.urlhost + '/facturasProveedores/pdf'}/${id}`,formData);
  }

  obtenerFacturas():Observable<Factura[]>{
      return this.http.get<Factura[]>(environment.urlhost + "/facturasProveedores/")
    }

}
