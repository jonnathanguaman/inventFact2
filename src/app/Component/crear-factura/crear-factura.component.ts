import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../Services/cliente/cliente';
import { Producto } from '../../Services/producto/procuto';
import { ProductoMongo } from '../../Services/producto/producto.service';
import { ProveedorMongo } from '../../Services/proveedor/proveedor.service';
import { FacturaencabezadoService } from '../../Services/facturaEncabezado/facturaencabezado.service';
import { FacturaService, FacturaProveedorMongo, DetalleFacturaProveedorMongo } from '../../Services/factura/factura.service';
import { FacturaRequestDTO } from '../../Services/facturaEncabezado/factura.model';
import { ProductoService } from '../../Services/producto/producto.service';
import { ProveedorService } from '../../Services/proveedor/proveedor.service';
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
  proveedores: ProveedorMongo[] = []; // Cambiado de clientes a proveedores
  productos: ProductoMongo[] = []; // Cambiado a ProductoMongo
  total:number = 0;
  private readonly destroy$ = new Subject<void>();
  constructor(private readonly fb: FormBuilder,
    private readonly api: FacturaencabezadoService, 
    private readonly facturaService: FacturaService, // Agregado servicio de facturas MongoDB
    private readonly productoService: ProductoService,
    private readonly proveedorService: ProveedorService, // Agregado servicio de proveedores
    private readonly alertaService:AlertService) {
    this.form = this.fb.group({
      proveedorId: [null, Validators.required], // Cambiado de clienteId a proveedorId
      detalles: this.fb.array([])
    });

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.calcularTotal();
      });
  }  ngOnInit(): void {
    // Cambiado a método MongoDB con manejo de errores
    this.productoService.obtenerProductosMongo().subscribe({      next: (productos) => {
        console.log('Productos recibidos del servicio:', productos);
        
        // Mostrar todos los productos, pero marcar cuáles son válidos
        this.productos = productos;
        
        const productosValidos = productos.filter(p => p.nombreProducto && p.precio !== null && p.precio !== undefined);
        const productosInvalidos = productos.filter(p => !p.nombreProducto || p.precio === null || p.precio === undefined);
        
        console.log('Productos válidos:', productosValidos);
        console.log('Productos inválidos:', productosInvalidos);
        console.log('Total productos:', this.productos.length);
        
        if (productosInvalidos.length > 0) {
          this.alertaService.mensajeToast('warning', 'Advertencia', `Hay ${productosInvalidos.length} producto(s) con datos incompletos`);
        }
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.productos = [];
        this.alertaService.mensajeToast('error', 'Error', 'No se pudieron cargar los productos');
      }    });
    
    // Cargar proveedores en lugar de clientes
    this.proveedorService.obtenerProveedoresMongo().subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores;
        console.log('Proveedores cargados:', proveedores);
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
        this.proveedores = [];
        this.alertaService.mensajeToast('warning', 'Advertencia', 'No se pudieron cargar los proveedores');
      }
    });
    
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
    if (this.form.invalid) {
      this.alertaService.mensajeToast('warning', 'Formulario inválido', 'Por favor complete todos los campos requeridos');
      return;
    }

    const formValue = this.form.value;
    
    // Crear la factura de proveedor MongoDB
    const facturaProveedor: FacturaProveedorMongo = {
      numeroFactura: 'FAC-' + Date.now(), // Generar número único temporal
      fechaEmision: new Date(),
      estadoDePago: 'PENDIENTE',
      productosRegistrados: false,
      visible: true,
      proveedorId: formValue.proveedorId,
      total: this.total
    };

    // Crear los detalles de la factura
    const detalles: DetalleFacturaProveedorMongo[] = formValue.detalles.map((detalle: any) => {
      const producto = this.productos.find(p => p.id === detalle.productoId);
      return {
        facturaId: '', // Se establecerá después de crear la factura
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precio: producto?.precio || 0
      };
    });

    // Crear factura con detalles usando el servicio MongoDB
    this.facturaService.crearFacturaProveedorConDetalles({
      factura: facturaProveedor,
      detalles: detalles
    }).subscribe({
      next: (resp) => {
        this.alertaService.mensajeConfirmacion('Factura registrada','Factura de proveedor registrada con éxito','success');
        this.form.reset();
        this.detalles.clear();
        this.addDetalle();
        this.total = 0;
      },
      complete: () => {
        this.facturaCreada.emit(true);
      },
      error: (error) => {
        console.error('Error al crear la factura:', error);
        this.alertaService.mensajeConfirmacion('Error','Error al crear la factura de proveedor','error');
      }
    });
  }calcularTotal(): void {
    this.total = 0;
    this.detalles.controls.forEach(control => {
      const productoId = control.get('productoId')?.value;
      const cantidad = control.get('cantidad')?.value || 0;

      if (productoId && cantidad > 0) {
        // Cambiado idProducto por id para ProductoMongo
        const producto = this.productos.find(p => p.id == productoId);
        if (producto && producto.precio) {
          // Verificar stock solo si cantidadDisponoble no es null
          if (producto.cantidadDisponoble !== null && producto.cantidadDisponoble !== undefined) {
            if (cantidad > producto.cantidadDisponoble) {
              this.alertaService.mensajeConfirmacion('Error',`Stock insuficiente para el producto "${producto.nombreProducto}". Stock disponible: ${producto.cantidadDisponoble}`,'error');
              control.get('cantidad')?.setValue(null);
              return;
            }
          }
          // Calcular total solo si el precio es válido
          this.total += (producto.precio || 0) * cantidad;
        }
      }
    });
  }


}
