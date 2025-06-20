import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../Services/cliente/cliente';
import { Producto } from '../../Services/producto/procuto';
import { FacturaencabezadoService } from '../../Services/facturaEncabezado/facturaencabezado.service';
import { FacturaRequestDTO } from '../../Services/facturaEncabezado/factura.model';
import { ProductoMongo, ProductoService } from '../../Services/producto/producto.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';
import { AlertService } from '../../Services/alertas/alertService.service';

@Component({
  selector: 'app-crear-factura',
  templateUrl: './crear-factura.component.html',
  styleUrl: './crear-factura.component.css'
})
export class CrearFacturaComponent {
  
  @Output() facturaCreada = new EventEmitter<boolean>();
  
  form: FormGroup;
  clientes: Cliente[] = [];
  productos: ProductoMongo[] = [];
  total:number = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder,
    private readonly api: FacturaencabezadoService, 
    private readonly productoService: ProductoService,
    private readonly alertaService:AlertService) {
    this.form = this.fb.group({
      clienteId: [null, Validators.required],
      detalles: this.fb.array([])
    });

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.calcularTotal();
      });
  }

  ngOnInit(): void {
    this.productoService.obtenerProductosMongo().subscribe(productos => this.productos = productos);
    this.api.getClientes().subscribe(c => this.clientes = c);
    this.addDetalle();
  }

  get detalles(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  addDetalle(): void {
    this.detalles.push(this.fb.group({
      productoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeDetalle(index: number): void {
    this.detalles.removeAt(index);
  }

  enviarFactura(): void {
    const factura: FacturaRequestDTO = this.form.value;

    this.api.crearFactura(factura).subscribe({
      next: (resp) => {
        this.alertaService.mensajeConfirmacion('Factura registrada','Factura registrada con exito','success')
        this.form.reset();
        this.detalles.clear();
        this.addDetalle();
      },
      complete:()=>{
            this.facturaCreada.emit(true)
          },
      error: () => alert('Error al crear la factura')
    });
  }

  calcularTotal(): void {
    this.total = 0;
    this.detalles.controls.forEach(control => {
      const productoId = control.get('productoId')?.value;
      const cantidad = control.get('cantidad')?.value || 0;

      if (productoId && cantidad > 0) {
        const producto = this.productos.find(p => p.id == productoId);
        if (producto) {
          if (cantidad > producto.cantidadDisponoble) {
            this.alertaService.mensajeConfirmacion('Error',`Stock insuficiente para el producto "${producto.nombreProducto}". Stock disponible: ${producto.cantidadDisponoble}`,'error');
            control.get('cantidad')?.setValue(null); // Opcional: limpiar campo
          } else {
            this.total += producto.precio * cantidad;
          }
        }
      }
    });
  }


}
