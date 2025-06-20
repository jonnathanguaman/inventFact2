import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FacturaService } from '../../Services/factura/factura.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../Services/alertas/alertService.service';
import { Factura } from '../../Services/factura/factura';
import { ProveedorMongo, ProveedorService } from '../../Services/proveedor/proveedor.service';
import { Proveedor } from '../../Services/proveedor/proveedor';

@Component({
  selector: 'app-registrar-facturas',
  templateUrl: './registrar-facturas.component.html',
  styleUrl: './registrar-facturas.component.css'
})
export class RegistrarFacturasComponent implements OnInit{

  @Output() facturaCreada = new EventEmitter<boolean>();

  facturas:Factura[] = []
  proveedores:ProveedorMongo[]=[]
  proveedor!:Proveedor


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
    estadoDePago:[true,[Validators.required]],
    productosRegistrados:[true,[Validators.required]],
    visible:[true,[Validators.required]],
    proveedor:[null,[Validators.required]],
  })

  registrarFactura(){
      console.log(this.facturaForm.value)
      this.facturaService.registrarFactura(this.facturaForm.value as unknown as Factura).subscribe({
        next:(factura)=>{
          this.facturaService.guardarFacturaPdf(this.selectedFile!,factura.idFactura).subscribe({
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
        },
        error:()=>{
          this.alertaService.mensajeConfirmacion('Error al registrar','Los sentimos ha ocurrido un error','error')
        }
      })
    }
}
