import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './Pages/admin/admin.component';
import { InventarioComponent } from './Pages/admin/inventario/inventario.component';
import { ProveedorComponent } from './Pages/admin/proveedor/proveedor.component';
import { CategoriaComponent } from './Pages/admin/categoria/categoria.component';
import { FacturaComponent } from './Pages/admin/factura/factura.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegistroComponent } from './Pages/registro/registro.component';
import { CrearFacturaComponent } from './Component/crear-factura/crear-factura.component';
import { FacturadorComponent } from './Pages/admin/facturador/facturador.component';

const routes: Routes = [
  {
    path:"admin",
    component:AdminComponent,
    children:[
      {
        path:"inventario",
        component:InventarioComponent
      },
      {
        path:"proveedor",
        component:ProveedorComponent
      },
      {
        path:"categoria",
        component:CategoriaComponent
      },
      {
        path:"factura",
        component:FacturaComponent
      },
      { path: 'facturador',
       component: FacturadorComponent 
      }

    ]
  },
  {
    path: "",
    component:LoginComponent
  },
  {
    path: "registro",
    component:RegistroComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
