import { Categoria } from "../categoria/categoria"
import { Proveedor } from "../proveedor/proveedor"

export interface Producto{
    idProducto:number
    nombreProducto:string
    cantidadDisponoble:number
    disponibilidad:boolean
    fechaIngreso:Date
    visible:boolean
    precio:number
    proveedor:Proveedor
    categoria:Categoria
}