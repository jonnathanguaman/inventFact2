import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Proveedor } from './proveedor';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

// Interface para MongoDB (coincide exactamente con el backend)
export interface ProveedorMongo {
  id?: string;
  nombreProveedor: string;
  rucProveedor: string;
  productosIds?: string[];
  facturasIds?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private readonly baseUrlMongo = environment.urlhost + '/api/mongo/proveedores';
  private readonly baseUrlMySQL = environment.urlhost + '/proveedor/';

  constructor(private readonly http: HttpClient) { }
  
  // ========== MÉTODOS ORIGINALES (MySQL/JPA) ==========
  crearProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.baseUrlMySQL, proveedor);
  }

  obtenerProveedors(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.baseUrlMySQL);
  }

  eliminarProveedor(idProveedor: number): Observable<Proveedor> {
    return this.http.delete<Proveedor>(`${this.baseUrlMySQL}${idProveedor}`);
  }
  // ========== MÉTODOS MONGO ==========
  
  // Crear proveedor en MongoDB
  crearProveedorMongo(proveedor: ProveedorMongo): Observable<ProveedorMongo> {
    return this.http.post<ProveedorMongo>(this.baseUrlMongo, proveedor);
  }

  // Obtener proveedores de MongoDB
  obtenerProveedoresMongo(): Observable<ProveedorMongo[]> {
    return this.http.get<ProveedorMongo[]>(this.baseUrlMongo);
  }

  // Obtener proveedor MongoDB por ID
  obtenerProveedorMongoPorId(id: string): Observable<ProveedorMongo> {
    return this.http.get<ProveedorMongo>(`${this.baseUrlMongo}/${id}`);
  }

  // Actualizar proveedor MongoDB
  actualizarProveedorMongo(id: string, proveedor: ProveedorMongo): Observable<ProveedorMongo> {
    return this.http.put<ProveedorMongo>(`${this.baseUrlMongo}/${id}`, proveedor);
  }

  // Eliminar proveedor MongoDB
  eliminarProveedorMongo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlMongo}/${id}`);
  }
}
