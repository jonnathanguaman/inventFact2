import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from './categoria';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private readonly http:HttpClient) { }
    
      crearCategoria(categoria:Categoria):Observable<Categoria>{
        return this.http.post<Categoria>(environment.urlhost +"/categoria/",categoria)
      }
    
      obtenerCategorias():Observable<Categoria[]>{
        return this.http.get<Categoria[]>(environment.urlhost + "/categoria/")
      }
    
      eliminarCategoria(idCategoria:number):Observable<Categoria>{
        return this.http.delete<Categoria>(`${environment.urlhost }/categoria/${idCategoria}`)
      }
}
