import { Component } from '@angular/core';
import { AlertService } from '../../../Services/alertas/alertService.service';
import { ProveedorService } from '../../../Services/proveedor/proveedor.service';
import { Proveedor } from '../../../Services/proveedor/proveedor';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css'
})
export class ProveedorComponent {
  abrirModalCrearProveedorSelector:boolean = false;
  proveedor:Proveedor[]=[]

  abrirModalCrearProveedor(){
    this.abrirModalCrearProveedorSelector = true
  }

  cierraModalProveedorCreado(isCreated: boolean) {
    if (isCreated) {
      console.log("El proveedor registrado fue creado exitosamente");
      this.abrirModalCrearProveedorSelector = false
      this.obtenerProveedor(); 
    }
  }

  constructor(
    private readonly proveedorService:ProveedorService,
    private readonly alertService:AlertService
  ){}

  ngOnInit(): void {
    this.obtenerProveedor()
  }

  obtenerProveedor(){
    this.proveedorService.obtenerProveedors().subscribe({
      next:(productos)=>{
        this.proveedor = productos
        console.log(productos)
      },
      error:()=>{
        console.log("No se han recuperado los datos")
      },
      complete:()=>{
        console.log("Datos recuperados")
      } 
    })
  }
  
  eliminarProducto(idProducto:number){
    this.alertService.mensajeEmergente('Eliminar','¿Estas seguro que deseas eliminar el proveedor?','warning').then((confirmacio)=>{
      if(confirmacio){
        this.proveedorService.eliminarProveedor(idProducto).subscribe({
          next:()=>{
            this.alertService.mensajeToast('success','Proveedor eliminado','')
          },
          complete:()=>{
          this.obtenerProveedor();
          }
        })
      }
      
    })
    
  }
}
