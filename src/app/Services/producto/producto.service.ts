import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from './procuto';
import { environment } from '../../../enviroment/enviroment';

// Interface para MongoDB (coincide exactamente con el backend)
export interface ProductoMongo {
  id: string;
  nombreProducto: string;
  cantidadDisponoble: number; // Mantengo el typo igual que en el backend
  disponibilidad: boolean;
  fechaIngreso: Date;
  visible: boolean;
  precio: number;
  categoriaId: string;
  proveedorId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly baseUrlMongo = environment.urlhost + '/api/mongo/productos';

  constructor(private readonly http: HttpClient) { }

  // ========== MÉTODOS ORIGINALES (MySQL/JPA) ==========
  // ========== MÉTODOS MONGO ==========
  
  // Crear producto en MongoDB
  crearProductoMongo(producto: ProductoMongo): Observable<ProductoMongo> {
    return this.http.post<ProductoMongo>(this.baseUrlMongo, producto);
  }

  // Obtener productos de MongoDB
  obtenerProductosMongo(): Observable<ProductoMongo[]> {
    return this.http.get<ProductoMongo[]>(this.baseUrlMongo);
  }

  // Obtener producto MongoDB por ID
  obtenerProductoMongoPorId(id: string): Observable<ProductoMongo> {
    return this.http.get<ProductoMongo>(`${this.baseUrlMongo}/${id}`);
  }

  // Actualizar producto MongoDB
  actualizarProductoMongo(id: string, producto: ProductoMongo): Observable<ProductoMongo> {
    return this.http.put<ProductoMongo>(`${this.baseUrlMongo}/${id}`, producto);
  }

  // Eliminar producto MongoDB
  eliminarProductoMongo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlMongo}/${id}`);
  }
}
