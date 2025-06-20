import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../../Services/factura/factura.service';
import { Factura } from '../../../Services/factura/factura';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../enviroment/enviroment';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export class FacturaComponent implements OnInit {
  
  abrirModalRegistrarFacturasSelector:boolean = false;
  facturas:Factura[]=[]
  urlhost = environment.urlhost
  mostrarPdf = false;

  cerrarModalPdf(): void {
    this.mostrarPdf = false; // Oculta el modal del PDF
    this.pdfSrc = ''; 
  }
  pdfSrc = '';

  verPdf(rutaRelativaPdf: string): void {
    this.pdfSrc = this.urlhost + rutaRelativaPdf;
    this.mostrarPdf = true;
  }

  abrirModalRegistrarFctura(){
    this.abrirModalRegistrarFacturasSelector = true
  }

  cierraModalRegistrarFctura(isCreated: boolean) {
    if (isCreated) {
      this.obtenerFacturas(); 
      this.abrirModalRegistrarFacturasSelector = false
    }
  }

  constructor(
      private readonly facturaService:FacturaService,
      private readonly sanitizer: DomSanitizer
    ){}

  sanitizarUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    this.obtenerFacturas(); 
  }

  obtenerFacturas(){
    this.facturaService.obtenerFacturas().subscribe({
      next:(facturas)=>{
        this.facturas = facturas
        console.log(facturas)
      },
      error:()=>{
        console.log("No se han recuperado los datos")
      },
      complete:()=>{
        console.log("Datos recuperados")
      } 
    })
  }
}
