import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuAdminComponent } from './Shared/menu-admin/menu-admin.component';
import { AdminComponent } from './Pages/admin/admin.component';
import { InventarioComponent } from './Pages/admin/inventario/inventario.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { CrearProductoComponent } from './Component/crear-producto/crear-producto.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProveedorComponent } from './Pages/admin/proveedor/proveedor.component';
import { CategoriaComponent } from './Pages/admin/categoria/categoria.component';
import { RegistrarProveedorComponent } from './Component/registrar-proveedor/registrar-proveedor.component';
import { CrearCategoriaComponent } from './Component/crear-categoria/crear-categoria.component';
import { RegistrarFacturasComponent } from './Component/registrar-facturas/registrar-facturas.component';
import { FacturaComponent } from './Pages/admin/factura/factura.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegistroComponent } from './Pages/registro/registro.component';
import { CrearFacturaComponent } from './Component/crear-factura/crear-factura.component';
import { FacturadorComponent } from './Pages/admin/facturador/facturador.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuAdminComponent,
    AdminComponent,
    InventarioComponent,
    FooterComponent,
    CrearProductoComponent,
    ProveedorComponent,
    CategoriaComponent,
    RegistrarProveedorComponent,
    CrearCategoriaComponent,
    RegistrarFacturasComponent,
    FacturaComponent,
    LoginComponent,
    RegistroComponent,
    CrearFacturaComponent,
    FacturadorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
