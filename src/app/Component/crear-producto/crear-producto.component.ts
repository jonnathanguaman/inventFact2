import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductoService, ProductoMongo } from '../../Services/producto/producto.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Producto } from '../../Services/producto/procuto';
import { AlertService } from '../../Services/alertas/alertService.service';
import { ProveedorService, ProveedorMongo } from '../../Services/proveedor/proveedor.service';
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

  proveedores:ProveedorMongo[]=[] // Cambiado a ProveedorMongo
  proveedor!:ProveedorMongo // Cambiado a ProveedorMongo
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
    // Cambiado a método MongoDB
    this.proveedorService.obtenerProveedoresMongo().subscribe((proveedores)=>{
      this.proveedores = proveedores
    })
  }  obtenerCategorias(){
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        // Si hay categorías, hacer el campo requerido
        if (categorias.length > 0) {
          this.productoForm.get('categoria')?.setValidators([Validators.required]);
        } else {
          // Si no hay categorías, remover la validación requerida
          this.productoForm.get('categoria')?.clearValidators();
        }
        this.productoForm.get('categoria')?.updateValueAndValidity();
      },
      error: (error) => {
        console.error('ERROR HttpErrorResponse', error);
        // Si no hay categorías disponibles, usamos una lista vacía
        this.categorias = [];
        // Remover la validación requerida para categoría
        this.productoForm.get('categoria')?.clearValidators();
        this.productoForm.get('categoria')?.updateValueAndValidity();
        // Opcional: mostrar mensaje al usuario
        this.alertaService.mensajeToast('warning', 'Categorías no disponibles', 'No se pudieron cargar las categorías');
      }
    });
  }
  productoForm = this.fb.group({
    nombreProducto:["",[Validators.required]],
    cantidadDisponoble:[0,[Validators.required]],
    disponibilidad:[true,[Validators.required]],
    fechaIngreso:["",[Validators.required]],
    visible:[true,[Validators.required]],
    precio:[0,[Validators.required]],
    proveedor:[null,[Validators.required]],
    categoria:[null] // Removida la validación required inicial
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
  }  crearProducto(){
    console.log(this.productoForm.value)
    
    // Construir objeto ProductoMongo
    const productoMongo: ProductoMongo = {
      nombreProducto: this.productoForm.value.nombreProducto!,
      cantidadDisponoble: this.productoForm.value.cantidadDisponoble!,
      disponibilidad: this.productoForm.value.disponibilidad!,
      fechaIngreso: new Date(this.productoForm.value.fechaIngreso!),
      visible: this.productoForm.value.visible!,
      precio: this.productoForm.value.precio!,
      proveedorId: this.productoForm.value.proveedor!, // Ahora es ID
      categoriaId: this.productoForm.value.categoria || 'sin-categoria' // Valor por defecto si no hay categoría
    };

    // Usar método MongoDB
    this.productoService.crearProductoMongo(productoMongo).subscribe({
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
