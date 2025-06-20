# Guía de Migración: MySQL a MongoDB - Angular Frontend

## 📋 Introducción

Esta guía describe cómo migrar los servicios Angular del proyecto `inventFact2` para utilizar los nuevos endpoints de MongoDB en lugar de los endpoints de MySQL/JPA.

## 🔗 Endpoints Disponibles

### Productos MongoDB
- **Base URL**: `http://localhost:8081/api/mongo/productos`
- **GET** `/` - Obtener todos los productos
- **POST** `/` - Crear nuevo producto

### Proveedores MongoDB
- **Base URL**: `http://localhost:8081/api/mongo/proveedores`
- **GET** `/` - Obtener todos los proveedores
- **POST** `/` - Crear nuevo proveedor

### Facturas de Proveedores MongoDB
- **Base URL**: `http://localhost:8081/api/mongo/facturas-proveedores`
- **GET** `/` - Obtener todas las facturas
- **GET** `/{id}` - Obtener factura por ID
- **GET** `/proveedor/{proveedorId}` - Obtener facturas por proveedor
- **GET** `/estado/{estado}` - Obtener facturas por estado
- **GET** `/visible/{visible}` - Obtener facturas por visibilidad
- **POST** `/` - Crear nueva factura
- **POST** `/con-detalles` - Crear factura con detalles
- **PUT** `/{id}` - Actualizar factura
- **DELETE** `/{id}` - Eliminar factura
- **PUT** `/{id}/estado-pago` - Actualizar estado de pago
- **PUT** `/{id}/marcar-productos-registrados` - Marcar productos como registrados
- **GET** `/{id}/detalles` - Obtener detalles de una factura

### Detalles de Factura Proveedor MongoDB
- **Base URL**: `http://localhost:8081/api/mongo/detalle-factura-proveedor`
- **GET** `/` - Obtener todos los detalles
- **GET** `/{id}` - Obtener detalle por ID
- **GET** `/factura/{facturaId}` - Obtener detalles por factura
- **GET** `/producto/{productoId}` - Obtener detalles por producto
- **POST** `/` - Crear nuevo detalle
- **POST** `/batch` - Crear múltiples detalles
- **PUT** `/{id}` - Actualizar detalle
- **DELETE** `/{id}` - Eliminar detalle
- **DELETE** `/factura/{facturaId}` - Eliminar detalles por factura
- **GET** `/total/factura/{facturaId}` - Calcular total por factura

## 📦 Interfaces MongoDB

### ProductoMongo
```typescript
export interface ProductoMongo {
  id?: string;
  nombreProducto: string;
  cantidadDisponoble: number; // Mantiene el typo del backend
  disponibilidad: boolean;
  fechaIngreso: Date;
  visible: boolean;
  precio: number;
  categoriaId: string;
  proveedorId: string;
}
```

### ProveedorMongo
```typescript
export interface ProveedorMongo {
  id?: string;
  nombreProveedor: string;
  rucProveedor: string;
  productosIds?: string[];
  facturasIds?: string[];
}
```

### FacturaProveedorMongo
```typescript
export interface FacturaProveedorMongo {
  id?: string;
  urlPdf?: string;
  numeroFactura: string;
  fechaEmision: Date;
  fechaRegistro?: Date;
  total?: number;
  estadoDePago: string; // "PENDIENTE", "PAGADA", "VENCIDA", "CANCELADA", "EN_PROCESO"
  productosRegistrados: boolean;
  visible: boolean;
  proveedorId: string;
  detalleIds?: string[];
}
```

### DetalleFacturaProveedorMongo
```typescript
export interface DetalleFacturaProveedorMongo {
  id?: string;
  facturaId: string;
  productoId: string;
  cantidad: number;
  precio: number;
}
```

## 🔄 Servicios Actualizados

### 1. ProductoService
- **Archivo**: `src/app/Services/producto/producto.service.ts`
- **Nuevos métodos MongoDB**:
  - `crearProductoMongo(producto: ProductoMongo)`
  - `obtenerProductosMongo()`
  - `obtenerProductoMongoPorId(id: string)`
  - `actualizarProductoMongo(id: string, producto: ProductoMongo)`
  - `eliminarProductoMongo(id: string)`

### 2. ProveedorService  
- **Archivo**: `src/app/Services/proveedor/proveedor.service.ts`
- **Nuevos métodos MongoDB**:
  - `crearProveedorMongo(proveedor: ProveedorMongo)`
  - `obtenerProveedoresMongo()`
  - `obtenerProveedorMongoPorId(id: string)`
  - `actualizarProveedorMongo(id: string, proveedor: ProveedorMongo)`
  - `eliminarProveedorMongo(id: string)`

### 3. FacturaService
- **Archivo**: `src/app/Services/factura/factura.service.ts`
- **Nuevos métodos MongoDB**:
  - `crearFacturaProveedorMongo(factura: FacturaProveedorMongo)`
  - `crearFacturaProveedorConDetalles(facturaConDetalles: FacturaProveedorConDetalles)`
  - `obtenerFacturasProveedoresMongo()`
  - `obtenerFacturaProveedorMongoPorId(id: string)`
  - `obtenerFacturasPorProveedor(proveedorId: string)`
  - `obtenerFacturasPorEstado(estado: string)`
  - `obtenerFacturasPorVisibilidad(visible: boolean)`
  - `actualizarFacturaProveedorMongo(id: string, factura: FacturaProveedorMongo)`
  - `actualizarEstadoPago(id: string, estadoDePago: string)`
  - `marcarProductosRegistrados(id: string)`
  - `eliminarFacturaProveedorMongo(id: string)`
  - `obtenerDetallesFacturaProveedor(facturaId: string)`

## 📚 Métodos de Detalles de Factura
  - `crearDetalleFacturaProveedor(detalle: DetalleFacturaProveedorMongo)`
  - `crearMultiplesDetallesProveedor(detalles: DetalleFacturaProveedorMongo[])`
  - `obtenerTodosDetallesProveedor()`
  - `obtenerDetalleProveedorPorId(id: string)`
  - `obtenerDetallesPorFactura(facturaId: string)`
  - `obtenerDetallesPorProducto(productoId: string)`
  - `actualizarDetalleProveedor(id: string, detalle: DetalleFacturaProveedorMongo)`
  - `eliminarDetalleProveedor(id: string)`
  - `eliminarDetallesPorFactura(facturaId: string)`
  - `calcularTotalFactura(facturaId: string)`

## 📱 Ejemplos de Uso en Componentes

### 1. Componente de Productos

```typescript
import { Component, OnInit } from '@angular/core';
import { ProductoService, ProductoMongo } from '../../Services/producto/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {
  
  productos: ProductoMongo[] = [];
  nuevoProducto: ProductoMongo = {
    nombreProducto: '',
    cantidadDisponoble: 0,
    disponibilidad: true,
    fechaIngreso: new Date(),
    visible: true,
    precio: 0,
    categoriaId: '',
    proveedorId: ''
  };

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

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

  crearProducto(): void {
    this.productoService.crearProductoMongo(this.nuevoProducto).subscribe({
      next: (producto) => {
        console.log('Producto creado:', producto);
        this.cargarProductos();
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
      }
    });
  }

  eliminarProducto(id: string): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
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

  buscarProductos(nombre: string): void {
    if (nombre.trim()) {
      this.productoService.buscarProductosPorNombre(nombre).subscribe({
        next: (productos) => {
          this.productos = productos;
        },
        error: (error) => {
          console.error('Error al buscar productos:', error);
        }
      });
    } else {
      this.cargarProductos();
    }
  }

  private limpiarFormulario(): void {
    this.nuevoProducto = {
      nombreProducto: '',
      cantidadDisponoble: 0,
      disponibilidad: true,
      fechaIngreso: new Date(),
      visible: true,
      precio: 0,
      categoriaId: '',
      proveedorId: ''
    };
  }
}
```

### 2. Componente de Proveedores

```typescript
import { Component, OnInit } from '@angular/core';
import { ProveedorService, ProveedorMongo } from '../../Services/proveedor/proveedor.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent implements OnInit {
  
  proveedores: ProveedorMongo[] = [];
  nuevoProveedor: ProveedorMongo = {
    nombreProveedor: '',
    rucProveedor: ''
  };

  constructor(private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.cargarProveedores();
  }

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

  crearProveedor(): void {
    this.proveedorService.crearProveedorMongo(this.nuevoProveedor).subscribe({
      next: (proveedor) => {
        console.log('Proveedor creado:', proveedor);
        this.cargarProveedores();
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al crear proveedor:', error);
      }
    });
  }

  eliminarProveedor(id: string): void {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
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

  buscarPorRuc(ruc: string): void {
    if (ruc.trim()) {
      this.proveedorService.buscarProveedorPorRuc(ruc).subscribe({
        next: (proveedor) => {
          this.proveedores = [proveedor];
        },
        error: (error) => {
          console.error('Error al buscar proveedor:', error);
          this.proveedores = [];
        }
      });
    } else {
      this.cargarProveedores();
    }
  }

  private limpiarFormulario(): void {
    this.nuevoProveedor = {
      nombreProveedor: '',
      rucProveedor: ''
    };
  }
}
```

### 3. Componente de Facturas

```typescript
import { Component, OnInit } from '@angular/core';
import { 
  FacturaService, 
  FacturaProveedorMongo, 
  DetalleFacturaProveedorMongo, 
  FacturaProveedorConDetalles 
} from '../../Services/factura/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {
  
  facturas: FacturaProveedorMongo[] = [];
  detallesFactura: DetalleFacturaProveedorMongo[] = [];
  
  nuevaFactura: FacturaProveedorMongo = {
    numeroFactura: '',
    fechaEmision: new Date(),
    total: 0,
    estadoDePago: 'PENDIENTE',
    productosRegistrados: false,
    visible: true,
    proveedorId: ''
  };

  constructor(private facturaService: FacturaService) { }

  ngOnInit(): void {
    this.cargarFacturas();
  }

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

  crearFacturaSimple(): void {
    this.facturaService.crearFacturaProveedorMongo(this.nuevaFactura).subscribe({
      next: (factura) => {
        console.log('Factura creada:', factura);
        this.cargarFacturas();
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al crear factura:', error);
      }
    });
  }

  crearFacturaConDetalles(): void {
    const detalles: DetalleFacturaProveedorMongo[] = [
      {
        facturaId: '', // Se asignará automáticamente
        productoId: 'producto123', // ID real del producto
        cantidad: 10,
        precio: 15.50
      }
    ];

    const facturaConDetalles: FacturaProveedorConDetalles = {
      factura: this.nuevaFactura,
      detalles: detalles
    };

    this.facturaService.crearFacturaProveedorConDetalles(facturaConDetalles).subscribe({
      next: (factura) => {
        console.log('Factura con detalles creada:', factura);
        this.cargarFacturas();
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al crear factura con detalles:', error);
      }
    });
  }

  verDetallesFactura(facturaId: string): void {
    this.facturaService.obtenerDetallesFacturaProveedor(facturaId).subscribe({
      next: (detalles) => {
        this.detallesFactura = detalles;
        console.log('Detalles de factura:', detalles);
      },
      error: (error) => {
        console.error('Error al cargar detalles:', error);
      }
    });
  }

  cambiarEstadoPago(facturaId: string, nuevoEstado: string): void {
    this.facturaService.actualizarEstadoPago(facturaId, nuevoEstado).subscribe({
      next: () => {
        console.log('Estado actualizado');
        this.cargarFacturas();
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
      }
    });
  }

  filtrarPorProveedor(proveedorId: string): void {
    this.facturaService.obtenerFacturasPorProveedor(proveedorId).subscribe({
      next: (facturas) => {
        this.facturas = facturas;
      },
      error: (error) => {
        console.error('Error al filtrar facturas:', error);
      }
    });
  }

  subirPdf(facturaId: string, file: File): void {
    this.facturaService.guardarFacturaPdfMongo(file, facturaId).subscribe({
      next: (factura) => {
        console.log('PDF guardado:', factura);
        this.cargarFacturas();
      },
      error: (error) => {
        console.error('Error al subir PDF:', error);
      }
    });
  }

  private limpiarFormulario(): void {
    this.nuevaFactura = {
      numeroFactura: '',
      fechaEmision: new Date(),
      total: 0,
      estadoDePago: 'PENDIENTE',
      productosRegistrados: false,
      visible: true,
      proveedorId: ''
    };
  }

  // Obtener estados disponibles
  get estadosPago(): string[] {
    return this.facturaService.obtenerEstadosPago();
  }
}
```

## 💡 Ejemplos de Uso

### 1. Cargar Productos
```typescript
// Método MySQL original
this.productoService.obtenerProductos().subscribe(productos => {
  // productos es de tipo Producto[]
});

// Método MongoDB nuevo
this.productoService.obtenerProductosMongo().subscribe(productos => {
  // productos es de tipo ProductoMongo[]
});
```

### 2. Crear Producto
```typescript
// MongoDB
const nuevoProducto: ProductoMongo = {
  nombreProducto: 'Laptop Dell',
  cantidadDisponoble: 5,
  disponibilidad: true,
  fechaIngreso: new Date(),
  visible: true,
  precio: 1200.00,
  categoriaId: 'cat123',
  proveedorId: 'prov456'
};

this.productoService.crearProductoMongo(nuevoProducto).subscribe({
  next: (producto) => {
    console.log('Producto creado:', producto);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
```

### 3. Cargar Proveedores
```typescript
// MongoDB
this.proveedorService.obtenerProveedoresMongo().subscribe({
  next: (proveedores) => {
    this.proveedores = proveedores;
  },
  error: (error) => {
    console.error('Error al cargar proveedores:', error);
  }
});
```

### 4. Crear Factura Simple
```typescript
const nuevaFactura: FacturaProveedorMongo = {
  numeroFactura: 'FACT-001',
  fechaEmision: new Date(),
  estadoDePago: 'PENDIENTE',
  productosRegistrados: false,
  visible: true,
  proveedorId: 'proveedor123'
};

this.facturaService.crearFacturaProveedorMongo(nuevaFactura).subscribe({
  next: (factura) => {
    console.log('Factura creada:', factura);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
```

### 5. Crear Factura con Detalles
```typescript
const facturaConDetalles: FacturaProveedorConDetalles = {
  factura: {
    numeroFactura: 'FACT-002',
    fechaEmision: new Date(),
    estadoDePago: 'PENDIENTE',
    productosRegistrados: false,
    visible: true,
    proveedorId: 'proveedor123'
  },
  detalles: [
    {
      facturaId: '', // Se asignará automáticamente
      productoId: 'producto123',
      cantidad: 2,
      precio: 25.50
    },
    {
      facturaId: '', // Se asignará automáticamente
      productoId: 'producto456',
      cantidad: 1,
      precio: 150.00
    }
  ]
};

this.facturaService.crearFacturaProveedorConDetalles(facturaConDetalles).subscribe({
  next: (factura) => {
    console.log('Factura con detalles creada:', factura);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
```

### 6. Filtrar Facturas por Estado
```typescript
this.facturaService.obtenerFacturasPorEstado('PENDIENTE').subscribe({
  next: (facturas) => {
    console.log('Facturas pendientes:', facturas);
  }
});
```

### 7. Obtener Detalles de una Factura
```typescript
const facturaId = 'factura123';
this.facturaService.obtenerDetallesPorFactura(facturaId).subscribe({
  next: (detalles) => {
    console.log('Detalles de la factura:', detalles);
  }
});
```

### 8. Calcular Total de Factura
```typescript
const facturaId = 'factura123';
this.facturaService.calcularTotalFactura(facturaId).subscribe({
  next: (total) => {
    console.log('Total de la factura:', total);
  }
});
```

## ⚙️ Estados de Pago Disponibles

- `PENDIENTE`
- `PAGADA`
- `VENCIDA`
- `CANCELADA`
- `EN_PROCESO`

## 🔧 Migración de Componentes

### Pasos para migrar un componente:

1. **Importar las nuevas interfaces**:
```typescript
import { ProductoMongo } from '../../Services/producto/producto.service';
import { ProveedorMongo } from '../../Services/proveedor/proveedor.service';
import { FacturaProveedorMongo } from '../../Services/factura/factura.service';
```

2. **Actualizar las propiedades del componente**:
```typescript
// Antes
productos: Producto[] = [];

// Después
productos: ProductoMongo[] = [];
```

3. **Cambiar las llamadas a los servicios**:
```typescript
// Antes
this.productoService.obtenerProductos()

// Después
this.productoService.obtenerProductosMongo()
```

4. **Adaptar los formularios y validaciones** según las nuevas estructuras de datos.

## ⚠️ Consideraciones Importantes

1. **IDs**: MongoDB usa strings para los IDs, no números como MySQL.

2. **Referencias**: En lugar de objetos anidados, MongoDB usa IDs de referencia (categoriaId, proveedorId).

3. **Estados**: Los estados de pago ahora son strings, no booleanos.

4. **Fechas**: Asegúrate de manejar correctamente las fechas entre frontend y backend.

5. **Migración Gradual**: Puedes mantener ambos métodos (MySQL y MongoDB) durante la transición.

## 🧪 Componente de Ejemplo

Existe un componente de ejemplo en `src/app/Components/ejemplo-mongo/ejemplo-mongo.component.ts` que muestra cómo usar todos los servicios MongoDB.

## 🧪 Pruebas con JSON

Para probar los endpoints, puedes usar los siguientes JSON de ejemplo:

### Producto
```json
{
  "nombreProducto": "Laptop HP",
  "cantidadDisponoble": 10,
  "disponibilidad": true,
  "fechaIngreso": "2024-01-15T10:30:00.000Z",
  "visible": true,
  "precio": 850.00,
  "categoriaId": "cat-electronics",
  "proveedorId": "prov-hp"
}
```

### Proveedor
```json
{
  "nombreProveedor": "HP Inc.",
  "rucProveedor": "1234567890123"
}
```

### Factura
```json
{
  "numeroFactura": "HP-FACT-001",
  "fechaEmision": "2024-01-15T10:30:00.000Z",
  "estadoDePago": "PENDIENTE",
  "productosRegistrados": false,
  "visible": true,
  "proveedorId": "prov-hp"
}
```

### Detalle de Factura
```json
{
  "facturaId": "factura-id",
  "productoId": "producto-id",
  "cantidad": 2,
  "precio": 850.00
}
```

## 🚀 Instrucciones de Implementación

### 1. Verificar Backend
Asegúrate de que el backend esté ejecutándose en `http://localhost:8081` con los endpoints MongoDB disponibles.

### 2. Instalar Dependencias Angular
```bash
cd c:\inventFact2
npm install
```

### 3. Compilar el Proyecto
```bash
ng build
```

### 4. Ejecutar el Proyecto
```bash
ng serve
```

### 5. Probar los Servicios
Navega al componente de ejemplo en la aplicación para probar los nuevos servicios MongoDB.

## ✅ Resumen de Archivos Modificados

### Servicios Actualizados:
- ✅ `src/app/Services/producto/producto.service.ts` - Métodos MongoDB agregados
- ✅ `src/app/Services/proveedor/proveedor.service.ts` - Métodos MongoDB agregados  
- ✅ `src/app/Services/factura/factura.service.ts` - Métodos MongoDB agregados

### Documentación:
- ✅ `GUIA_MIGRACION_MONGO_ANGULAR.md` - Guía completa de migración

### Componentes de Ejemplo:
- ✅ `src/app/Components/ejemplo-mongo/ejemplo-mongo.component.ts` - Componente de demostración

## 🔗 Endpoints Implementados

### Productos (5 métodos)
- GET `/api/mongo/productos` - Listar productos
- POST `/api/mongo/productos` - Crear producto
- GET `/api/mongo/productos/{id}` - Obtener por ID
- PUT `/api/mongo/productos/{id}` - Actualizar producto
- DELETE `/api/mongo/productos/{id}` - Eliminar producto

### Proveedores (5 métodos)
- GET `/api/mongo/proveedores` - Listar proveedores
- POST `/api/mongo/proveedores` - Crear proveedor
- GET `/api/mongo/proveedores/{id}` - Obtener por ID
- PUT `/api/mongo/proveedores/{id}` - Actualizar proveedor
- DELETE `/api/mongo/proveedores/{id}` - Eliminar proveedor

### Facturas (13 métodos)
- GET `/api/mongo/facturas-proveedores` - Listar facturas
- POST `/api/mongo/facturas-proveedores` - Crear factura
- POST `/api/mongo/facturas-proveedores/con-detalles` - Crear con detalles
- GET `/api/mongo/facturas-proveedores/{id}` - Obtener por ID
- GET `/api/mongo/facturas-proveedores/proveedor/{id}` - Por proveedor
- GET `/api/mongo/facturas-proveedores/estado/{estado}` - Por estado
- GET `/api/mongo/facturas-proveedores/visible/{visible}` - Por visibilidad
- PUT `/api/mongo/facturas-proveedores/{id}` - Actualizar factura
- PUT `/api/mongo/facturas-proveedores/{id}/estado-pago` - Cambiar estado
- PUT `/api/mongo/facturas-proveedores/{id}/marcar-productos-registrados` - Marcar productos
- DELETE `/api/mongo/facturas-proveedores/{id}` - Eliminar factura
- GET `/api/mongo/facturas-proveedores/{id}/detalles` - Obtener detalles
- PUT `/api/mongo/facturas-proveedores/{id}/pdf` - Subir PDF

### Detalles de Factura (10 métodos)
- GET `/api/mongo/detalle-factura-proveedor` - Listar todos
- POST `/api/mongo/detalle-factura-proveedor` - Crear detalle
- POST `/api/mongo/detalle-factura-proveedor/batch` - Crear múltiples
- GET `/api/mongo/detalle-factura-proveedor/{id}` - Obtener por ID
- GET `/api/mongo/detalle-factura-proveedor/factura/{id}` - Por factura
- GET `/api/mongo/detalle-factura-proveedor/producto/{id}` - Por producto
- PUT `/api/mongo/detalle-factura-proveedor/{id}` - Actualizar detalle
- DELETE `/api/mongo/detalle-factura-proveedor/{id}` - Eliminar detalle
- DELETE `/api/mongo/detalle-factura-proveedor/factura/{id}` - Eliminar por factura
- GET `/api/mongo/detalle-factura-proveedor/total/factura/{id}` - Calcular total

**Total: 33 endpoints MongoDB implementados en Angular**

## 🔧 Próximos Pasos

1. **Migrar Componentes Principales**: Actualizar los componentes reales de productos, proveedores y facturas para usar los métodos MongoDB.

2. **Implementar Validaciones**: Agregar validaciones específicas para los datos MongoDB.

3. **Mejorar Manejo de Errores**: Implementar interceptors o servicios de manejo de errores específicos.

4. **Testing**: Crear pruebas unitarias para los nuevos servicios MongoDB.

5. **Performance**: Implementar caching o estrategias de optimización si es necesario.

6. **Migración Gradual**: Planificar la migración progresiva de MySQL a MongoDB en producción.
