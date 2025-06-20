import { Component } from '@angular/core';
import { AlertService } from '../../../Services/alertas/alertService.service';
import { CategoriaService } from '../../../Services/categoria/categoria.service';
import { Categoria } from '../../../Services/categoria/categoria';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  abrirModalCrearProveedorSelector:boolean = false;
  categoria:Categoria[]=[]

  abrirModalCrearProveedor(){
    this.abrirModalCrearProveedorSelector = true
  }

  cierraModalProveedorCreado(isCreated: boolean) {
    if (isCreated) {
      console.log("El proveedor registrado fue creado exitosamente");
      this.abrirModalCrearProveedorSelector = false
      this.obtenerCategorias(); 
    }
  }

  constructor(
    private readonly categoriasService:CategoriaService,
    private readonly alertService:AlertService
  ){}

  ngOnInit(): void {
    this.obtenerCategorias()
  }

  obtenerCategorias(){
    this.categoriasService.obtenerCategorias().subscribe({
      next:(categoria)=>{
        this.categoria = categoria
      },
      error:()=>{
        console.log("No se han recuperado los datos")
      },
      complete:()=>{
        console.log("Datos recuperados")
      } 
    })
  }
  
  eliminarProducto(idCategoria:number){
    this.alertService.mensajeEmergente('Eliminar','¿Estas seguro que deseas eliminar la categoria?','warning').then((confirmacio)=>{
      if(confirmacio){
        this.categoriasService.eliminarCategoria(idCategoria).subscribe({
          next:()=>{
            this.alertService.mensajeToast('success','Proveedor eliminado','')
          },
          complete:()=>{
          this.obtenerCategorias();
          },
          error:()=>{
            this.alertService.mensajeConfirmacion('Categoria no eliminada','Es posible que esta en uso esta categoria','error')
          }
        })
      }
      
    })
    
  }
}
