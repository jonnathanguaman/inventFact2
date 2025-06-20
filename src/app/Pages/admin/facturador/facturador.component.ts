import { Component } from '@angular/core';
import { FacturaencabezadoService } from '../../../Services/facturaEncabezado/facturaencabezado.service';
import { FacturaResponseDTO } from '../../../Services/facturaEncabezado/factura.model';

@Component({
  selector: 'app-facturador',
  templateUrl: './facturador.component.html',
  styleUrl: './facturador.component.css'
})
export class FacturadorComponent {

  abrirModalRegistrarFacturasSelector:boolean = false;
  facturas: FacturaResponseDTO[] = [];
  constructor(private readonly facturasServices:FacturaencabezadoService) { }

  ngOnInit(): void {
   this.getFacturas();
  }

  getFacturas(): void {
    this.facturasServices.getFacturas().subscribe({
      next: (response: FacturaResponseDTO[]) => {
        this.facturas = response;
      },
      error: (error) => {
        console.error('Error al obtener las facturas:', error);
      }
    });
  }

  abrirModalRegistrarFctura(){
    this.abrirModalRegistrarFacturasSelector = true
  }

  cierraModalRegistrarFctura(isCreated: boolean) {
    if (isCreated) {
      this.getFacturas(); 
      this.abrirModalRegistrarFacturasSelector = false
    }
  }
}
