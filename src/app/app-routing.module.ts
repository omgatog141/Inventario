import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BusquedaProductosComponent } from './busqueda-productos/busqueda-productos.component';

const routes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./lista-productos/lista-productos.component').then(
          (m) => m.ListaProductosComponent
        ),
    },
    {
      path: 'busqueda',
      component: BusquedaProductosComponent
    },
    {
      path: 'producto/:id',
      loadComponent: () =>
        import('./producto/producto.component').then(
          (m) => m.ProductoComponent
        ),
    },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
