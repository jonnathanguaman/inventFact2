import { Component, OnInit } from '@angular/core';
import { ProductoMongo, ProductoService } from '../../../Services/producto/producto.service';
import { AlertService } from '../../../Services/alertas/alertService.service'; 

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  
  abrirModalCrearProductoSelector:boolean = false;
  productos:ProductoMongo[]=[]

  abrirModalCrearProducto(){
    this.abrirModalCrearProductoSelector = true
  }

  cierraModalProductoCreado(isCreated: boolean) {
    if (isCreated) {
      console.log("El producto fue creado exitosamente");
      this.abrirModalCrearProductoSelector = false
      this.obtenerProductosMongo();
    }
  }

  constructor(
    private readonly productoService:ProductoService,
    private readonly alertService:AlertService
  ){}

  ngOnInit(): void {
    this.obtenerProductosMongo()
  }

  obtenerProductosMongo(){
    this.productoService.obtenerProductosMongo().subscribe({
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
  
  eliminarProducto(idProducto:string){
    this.alertService.mensajeEmergente('Eliminar','¿Estas seguro que deseas eliminar el producto?','warning').then((confirmacio)=>{
      if(confirmacio){
        this.productoService.eliminarProductoMongo(idProducto).subscribe({
          next:()=>{
            this.alertService.mensajeToast('success','Producto eliminado','')
          },
          complete:()=>{
          this.obtenerProductosMongo();
          }
        })
      }
    })
   }
}