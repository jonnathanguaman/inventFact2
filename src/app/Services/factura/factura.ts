import { Proveedor } from "../proveedor/proveedor";

export interface Factura {
    idFactura: number;
    urlPdf: string;
    numeroFactura: string;
    fechaEmision:Date;
    total:number;
    estadoDePago:boolean;
    productosRegistrados:boolean;
    visible:boolean;
    proveedor:Proveedor;
}