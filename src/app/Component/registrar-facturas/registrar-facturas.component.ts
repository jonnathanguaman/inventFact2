import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FacturaService, FacturaProveedorMongo } from '../../Services/factura/factura.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../Services/alertas/alertService.service';
import { Factura } from '../../Services/factura/factura';
import { ProveedorService, ProveedorMongo } from '../../Services/proveedor/proveedor.service';
import { Proveedor } from '../../Services/proveedor/proveedor';

@Component({
  selector: 'app-registrar-facturas',
  templateUrl: './registrar-facturas.component.html',
  styleUrl: './registrar-facturas.component.css'
})
export class RegistrarFacturasComponent implements OnInit{
  @Output() facturaCreada = new EventEmitter<boolean>();

  facturas:FacturaProveedorMongo[] = [] // Cambiado a FacturaProveedorMongo
  proveedores:ProveedorMongo[]=[] // Cambiado a ProveedorMongo
  proveedor!:ProveedorMongo // Cambiado a ProveedorMongo


  selectedFile: File |null = null;
  constructor(
      private readonly facturaService:FacturaService,
      private readonly proveedorService:ProveedorService,
      private readonly fb:FormBuilder,
      private readonly alertaService:AlertService
    ){}

  ngOnInit(): void {
    this.obtenerProveedores()
  }
  obtenerProveedores(){
    // Cambiado a método MongoDB
    this.proveedorService.obtenerProveedoresMongo().subscribe((proveedores)=>{
      this.proveedores = proveedores
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }
  facturaForm = this.fb.group({
    idFactura:[],
    numeroFactura: ["",Validators.required],
    fechaEmision:[],
    fechaRegistro:[],
    total:[0,[Validators.required]],
    estadoDePago:['PENDIENTE',[Validators.required]], // Cambiado a string
    productosRegistrados:[false,[Validators.required]], // Por defecto false
    visible:[true,[Validators.required]],
    proveedor:[null,[Validators.required]],
  })

  registrarFactura(){
      console.log(this.facturaForm.value)
      
      // Construir objeto FacturaProveedorMongo
      const facturaMongo: FacturaProveedorMongo = {
        numeroFactura: this.facturaForm.value.numeroFactura!,
        fechaEmision: new Date(this.facturaForm.value.fechaEmision!),
        total: this.facturaForm.value.total!,
        estadoDePago: this.facturaForm.value.estadoDePago!,
        productosRegistrados: this.facturaForm.value.productosRegistrados!,
        visible: this.facturaForm.value.visible!,
        proveedorId: this.facturaForm.value.proveedor! // Ahora es ID
      };

      // Usar método MongoDB
      this.facturaService.crearFacturaProveedorMongo(facturaMongo).subscribe({
        next:(factura)=>{
          // Si hay archivo PDF, subirlo
          if (this.selectedFile && factura.id) {
            this.facturaService.guardarFacturaPdfMongo(this.selectedFile, factura.id).subscribe({
              next:()=>{
                this.alertaService.mensajeConfirmacion('Factura registrada','La factura se ha registrado correctamente','success')
                this.facturaForm.reset()
                this.selectedFile = null
              },
              error:()=>{
                this.alertaService.mensajeConfirmacion('Error al registrar','Los sentimos ha ocurrido un error el pdf','error')
              },
              complete:()=>{
                this.facturaCreada.emit(true)
              },
            })
          } else {
            this.alertaService.mensajeConfirmacion('Factura registrada','La factura se ha registrado correctamente','success')
            this.facturaForm.reset()
            this.selectedFile = null
            this.facturaCreada.emit(true)
          }
        },
        error:()=>{
          this.alertaService.mensajeConfirmacion('Error al registrar','Los sentimos ha ocurrido un error','error')
        }
      })
    }
}
