import { Component, OnInit } from '@angular/core';
import { ProductoService, ProductoMongo } from '../../Services/producto/producto.service';
import { ProveedorService, ProveedorMongo } from '../../Services/proveedor/proveedor.service';
import { 
  FacturaService, 
  FacturaProveedorMongo, 
  DetalleFacturaProveedorMongo,
  FacturaProveedorConDetalles 
} from '../../Services/factura/factura.service';

@Component({
  selector: 'app-ejemplo-mongo',
  template: `
    <div class="container">
      <h2>Ejemplo de Uso - MongoDB API</h2>
      
      <!-- Sección Productos -->
      <div class="section">
        <h3>Productos</h3>
        <button (click)="cargarProductos()">Cargar Productos</button>
        <button (click)="crearProductoEjemplo()">Crear Producto Ejemplo</button>
        
        <div *ngFor="let producto of productos" class="item">
          <p><strong>{{producto.nombreProducto}}</strong> - ${{producto.precio}}</p>
          <p>Stock: {{producto.cantidadDisponoble}} | Disponible: {{producto.disponibilidad}}</p>
          <button (click)="eliminarProducto(producto.id!)">Eliminar</button>
        </div>
      </div>

      <!-- Sección Proveedores -->
      <div class="section">
        <h3>Proveedores</h3>
        <button (click)="cargarProveedores()">Cargar Proveedores</button>
        <button (click)="crearProveedorEjemplo()">Crear Proveedor Ejemplo</button>
        
        <div *ngFor="let proveedor of proveedores" class="item">
          <p><strong>{{proveedor.nombreProveedor}}</strong></p>
          <p>RUC: {{proveedor.rucProveedor}}</p>
          <button (click)="eliminarProveedor(proveedor.id!)">Eliminar</button>
        </div>
      </div>

      <!-- Sección Facturas -->
      <div class="section">
        <h3>Facturas de Proveedores</h3>
        <button (click)="cargarFacturas()">Cargar Facturas</button>
        <button (click)="crearFacturaEjemplo()">Crear Factura Simple</button>
        <button (click)="crearFacturaConDetallesEjemplo()">Crear Factura con Detalles</button>
        
        <div *ngFor="let factura of facturas" class="item">
          <p><strong>Factura: {{factura.numeroFactura}}</strong></p>
          <p>Total: ${{factura.total}} | Estado: {{factura.estadoDePago}}</p>
          <p>Fecha: {{factura.fechaEmision | date}}</p>
          <button (click)="verDetalles(factura.id!)">Ver Detalles</button>
          <button (click)="cambiarEstado(factura.id!, 'PAGADA')">Marcar como Pagada</button>
          <button (click)="eliminarFactura(factura.id!)">Eliminar</button>
        </div>
      </div>

      <!-- Sección Detalles -->
      <div class="section" *ngIf="detalles.length > 0">
        <h3>Detalles de Factura</h3>
        <div *ngFor="let detalle of detalles" class="item">
          <p>Producto ID: {{detalle.productoId}}</p>
          <p>Cantidad: {{detalle.cantidad}} | Precio: ${{detalle.precio}}</p>
          <p>Subtotal: ${{detalle.cantidad * detalle.precio}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .item { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 3px; }
    button { margin: 5px; padding: 8px 15px; border: none; border-radius: 3px; cursor: pointer; }
    button:hover { background: #007bff; color: white; }
    h2, h3 { color: #333; }
  `]
})
export class EjemploMongoComponent implements OnInit {
  
  productos: ProductoMongo[] = [];
  proveedores: ProveedorMongo[] = [];
  facturas: FacturaProveedorMongo[] = [];
  detalles: DetalleFacturaProveedorMongo[] = [];

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private facturaService: FacturaService
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.cargarProveedores();
    this.cargarProductos();
    this.cargarFacturas();
  }

  // ========== PRODUCTOS ==========
  cargarProductos(): void {
    this.productoService.obtenerProductosMongo().subscribe({
      next: (productos) => {
        this.productos = productos;
        console.log('Productos cargados:', productos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  crearProductoEjemplo(): void {
    if (this.proveedores.length === 0) {
      alert('Primero debe crear un proveedor');
      return;
    }

    const nuevoProducto: ProductoMongo = {
      nombreProducto: 'Producto Ejemplo ' + Date.now(),
      cantidadDisponoble: 100,
      disponibilidad: true,
      fechaIngreso: new Date(),
      visible: true,
      precio: 25.99,
      categoriaId: '507f1f77bcf86cd799439011', // ID de ejemplo
      proveedorId: this.proveedores[0].id!
    };

    this.productoService.crearProductoMongo(nuevoProducto).subscribe({
      next: (producto) => {
        console.log('Producto creado:', producto);
        this.cargarProductos();
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
      }
    });
  }

  eliminarProducto(id: string): void {
    if (confirm('¿Eliminar este producto?')) {
      this.productoService.eliminarProductoMongo(id).subscribe({
        next: () => {
          console.log('Producto eliminado');
          this.cargarProductos();
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
        }
      });
    }
  }

  // ========== PROVEEDORES ==========
  cargarProveedores(): void {
    this.proveedorService.obtenerProveedoresMongo().subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores;
        console.log('Proveedores cargados:', proveedores);
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
      }
    });
  }

  crearProveedorEjemplo(): void {
    const nuevoProveedor: ProveedorMongo = {
      nombreProveedor: 'Proveedor Ejemplo ' + Date.now(),
      rucProveedor: '1234567890' + Math.floor(Math.random() * 1000)
    };

    this.proveedorService.crearProveedorMongo(nuevoProveedor).subscribe({
      next: (proveedor) => {
        console.log('Proveedor creado:', proveedor);
        this.cargarProveedores();
      },
      error: (error) => {
        console.error('Error al crear proveedor:', error);
      }
    });
  }

  eliminarProveedor(id: string): void {
    if (confirm('¿Eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedorMongo(id).subscribe({
        next: () => {
          console.log('Proveedor eliminado');
          this.cargarProveedores();
        },
        error: (error) => {
          console.error('Error al eliminar proveedor:', error);
        }
      });
    }
  }

  // ========== FACTURAS ==========
  cargarFacturas(): void {
    this.facturaService.obtenerFacturasProveedoresMongo().subscribe({
      next: (facturas) => {
        this.facturas = facturas;
        console.log('Facturas cargadas:', facturas);
      },
      error: (error) => {
        console.error('Error al cargar facturas:', error);
      }
    });
  }

  crearFacturaEjemplo(): void {
    if (this.proveedores.length === 0) {
      alert('Primero debe crear un proveedor');
      return;
    }

    const nuevaFactura: FacturaProveedorMongo = {
      numeroFactura: 'FAC-' + Date.now(),
      fechaEmision: new Date(),
      total: 0,
      estadoDePago: 'PENDIENTE',
      productosRegistrados: false,
      visible: true,
      proveedorId: this.proveedores[0].id!
    };

    this.facturaService.crearFacturaProveedorMongo(nuevaFactura).subscribe({
      next: (factura) => {
        console.log('Factura creada:', factura);
        this.cargarFacturas();
      },
      error: (error) => {
        console.error('Error al crear factura:', error);
      }
    });
  }

  crearFacturaConDetallesEjemplo(): void {
    if (this.proveedores.length === 0 || this.productos.length === 0) {
      alert('Primero debe crear un proveedor y al menos un producto');
      return;
    }

    const nuevaFactura: FacturaProveedorMongo = {
      numeroFactura: 'FAC-DET-' + Date.now(),
      fechaEmision: new Date(),
      total: 0,
      estadoDePago: 'PENDIENTE',
      productosRegistrados: true,
      visible: true,
      proveedorId: this.proveedores[0].id!
    };

    const detalles: DetalleFacturaProveedorMongo[] = [
      {
        facturaId: '', // Se asignará automáticamente
        productoId: this.productos[0].id!,
        cantidad: 5,
        precio: this.productos[0].precio
      }
    ];

    const facturaConDetalles: FacturaProveedorConDetalles = {
      factura: nuevaFactura,
      detalles: detalles
    };

    this.facturaService.crearFacturaProveedorConDetalles(facturaConDetalles).subscribe({
      next: (factura) => {
        console.log('Factura con detalles creada:', factura);
        this.cargarFacturas();
      },
      error: (error) => {
        console.error('Error al crear factura con detalles:', error);
      }
    });
  }

  verDetalles(facturaId: string): void {
    this.facturaService.obtenerDetallesFacturaProveedor(facturaId).subscribe({
      next: (detalles) => {
        this.detalles = detalles;
        console.log('Detalles de factura:', detalles);
      },
      error: (error) => {
        console.error('Error al cargar detalles:', error);
        this.detalles = [];
      }
    });
  }

  cambiarEstado(facturaId: string, nuevoEstado: string): void {
    this.facturaService.actualizarEstadoPago(facturaId, nuevoEstado).subscribe({
      next: () => {
        console.log('Estado actualizado a:', nuevoEstado);
        this.cargarFacturas();
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
      }
    });
  }

  eliminarFactura(id: string): void {
    if (confirm('¿Eliminar esta factura?')) {
      this.facturaService.eliminarFacturaProveedorMongo(id).subscribe({
        next: () => {
          console.log('Factura eliminada');
          this.cargarFacturas();
        },
        error: (error) => {
          console.error('Error al eliminar factura:', error);
        }
      });
    }
  }
}
