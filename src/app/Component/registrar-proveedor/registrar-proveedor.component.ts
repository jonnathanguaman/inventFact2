import { Component, EventEmitter, Output } from '@angular/core';
import { ProveedorService, ProveedorMongo } from '../../Services/proveedor/proveedor.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Proveedor } from '../../Services/proveedor/proveedor';
import { AlertService } from '../../Services/alertas/alertService.service';

@Component({
  selector: 'app-registrar-proveedor',
  templateUrl: './registrar-proveedor.component.html',
  styleUrl: './registrar-proveedor.component.css'
})
export class RegistrarProveedorComponent {

  @Output() proveedorCreado = new EventEmitter<boolean>();
  
  constructor(
    private readonly proveedorService:ProveedorService,
    private readonly fb:FormBuilder,
    private readonly alertaService:AlertService
  ){}

  proveedorForm = this.fb.group({
    nombreProveedor:["",[Validators.required]],
    rucProveedor:["",[Validators.required]],
  })
  
  get nombreProveedor(){
    return this.proveedorForm.controls.nombreProveedor;
  }
  
  get rucProveedor(){
    return this.proveedorForm.controls.rucProveedor;
  }
  registarProveedor(){
    // Crear objeto ProveedorMongo para usar MongoDB
    const proveedorMongo: ProveedorMongo = {
      nombreProveedor: this.proveedorForm.value.nombreProveedor || '',
      rucProveedor: this.proveedorForm.value.rucProveedor || '',
      productosIds: [],
      facturasIds: []
    };

    this.proveedorService.crearProveedorMongo(proveedorMongo).subscribe({
      next:()=>{
        this.alertaService.mensajeToast('success','Proveedor registrado con exito','')
      },
      complete:()=>{
        this.proveedorCreado.emit(true)
      },
      error:()=>{
        this.alertaService.mensajeConfirmacion('Error al registrar','Los sentimos ha ocurrido un error','error')
      }
    })
  }
}
