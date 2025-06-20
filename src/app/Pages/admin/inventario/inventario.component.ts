import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../Services/producto/producto.service';
import { Producto } from '../../../Services/producto/procuto';
import { AlertService } from '../../../Services/alertas/alertService.service'; 

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  
  abrirModalCrearProductoSelector:boolean = false;
  productos:Producto[]=[]

  abrirModalCrearProducto(){
    this.abrirModalCrearProductoSelector = true
  }

  cierraModalProductoCreado(isCreated: boolean) {
    if (isCreated) {
      console.log("El producto fue creado exitosamente");
      this.abrirModalCrearProductoSelector = false
      this.obtenerProductos();
    }
  }

  constructor(
    private readonly productoService:ProductoService,
    private readonly alertService:AlertService
  ){}

  ngOnInit(): void {
    this.obtenerProductos()
  }

  obtenerProductos(){
    this.productoService.obtenerProductos().subscribe({
      next:(productos)=>{
        this.productos = productos
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
    this.alertService.mensajeEmergente('Eliminar','¿Estas seguro que deseas eliminar el producto?','warning').then((confirmacio)=>{
      if(confirmacio){
        this.productoService.eliminarProducto(idProducto).subscribe({
          next:()=>{
            this.alertService.mensajeToast('success','Producto eliminado','')
          },
          complete:()=>{
          this.obtenerProductos();
          }
        })
      }
    })
   }
}