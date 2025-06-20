import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductoMongo, ProductoService } from '../../Services/producto/producto.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Producto } from '../../Services/producto/procuto';
import { AlertService } from '../../Services/alertas/alertService.service';
import { ProveedorMongo, ProveedorService } from '../../Services/proveedor/proveedor.service';
import { Proveedor } from '../../Services/proveedor/proveedor';
import { CategoriaService } from '../../Services/categoria/categoria.service';
import { Categoria } from '../../Services/categoria/categoria';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent implements OnInit{

  @Output() productoCreado = new EventEmitter<boolean>();

  proveedores:ProveedorMongo[]=[]
  proveedor!:Proveedor
  categorias:Categoria[]=[]

  constructor(
    private readonly productoService:ProductoService,
    private readonly proveedorService:ProveedorService,
    private readonly categoriaService:CategoriaService,
    private readonly fb:FormBuilder,
    private readonly alertaService:AlertService
  ){}

  ngOnInit(): void {
    this.obtenerProveedores()
    this.obtenerCategorias()
  }

  obtenerProveedores(){
    this.proveedorService.obtenerProveedoresMongo().subscribe((proveedores)=>{
      this.proveedores = proveedores
    })
  }

  obtenerCategorias(){
    this.categoriaService.obtenerCategorias().subscribe((categorias) =>{
      this.categorias = categorias
    })
  }

  productoForm = this.fb.group({
    nombreProducto:["",[Validators.required]],
    cantidadDisponoble:[0,[Validators.required]],
    disponibilidad:[true,[Validators.required]],
    fechaIngreso:["",[Validators.required]],
    visible:[true,[Validators.required]],
    precio:[0,[Validators.required]],
    proveedor:[null,[Validators.required]],
    categoria:[null,[Validators.required]]
  })

  get nombreProducto(){
    return this.productoForm.controls.nombreProducto;
  }
  get cantidadDisponoble(){
    return this.productoForm.controls.cantidadDisponoble;
  }
  get disponibilidad(){
    return this.productoForm.controls.disponibilidad;
  }
  get fechaIngreso(){
    return this.productoForm.controls.fechaIngreso;
  }
  get visible(){
    return this.productoForm.controls.visible;
  }
  get precio(){
    return this.productoForm.controls.precio;
  }

  crearProducto(){
    console.log(this.productoForm.value)
    this.productoService.crearProductoMongo(this.productoForm.value as unknown as ProductoMongo).subscribe({
      next:()=>{
        this.alertaService.mensajeToast('success','Producto registrado con exito','')
      },
      complete:()=>{
        this.productoCreado.emit(true)
      },
      error:()=>{
        this.alertaService.mensajeConfirmacion('Error al registrar','Los sentimos ha ocurrido un error','error')
      }
    })
  }
}
