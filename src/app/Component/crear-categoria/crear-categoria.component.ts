import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../Services/alertas/alertService.service';
import { CategoriaService } from '../../Services/categoria/categoria.service';
import { Categoria } from '../../Services/categoria/categoria';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrl: './crear-categoria.component.css'
})
export class CrearCategoriaComponent {
  
  @Output() categoriaCreado = new EventEmitter<boolean>();
    
    constructor(
      private readonly categoriaService:CategoriaService,
      private readonly fb:FormBuilder,
      private readonly alertaService:AlertService
    ){}
  
    categoriaForm = this.fb.group({
      nombreCategoria:["",[Validators.required]],
    })
    
    get nombreProveedor(){
      return this.categoriaForm.controls.nombreCategoria;
    }
    
  
    registarCategoria(){
        this.categoriaService.crearCategoria(this.categoriaForm.value as unknown as Categoria).subscribe({
          next:()=>{
            this.alertaService.mensajeToast('success','Categoria registrada con exito','')
          },
          complete:()=>{
            this.categoriaCreado.emit(true)
          },
          error:()=>{
            this.alertaService.mensajeConfirmacion('Error al registrar','Los sentimos ha ocurrido un error','error')
          }
        })
      }
}
