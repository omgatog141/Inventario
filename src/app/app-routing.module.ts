import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'; // Funcionalidades para gestionar rutas y precargar módulos
import { BusquedaProductosComponent } from './busqueda-productos/busqueda-productos.component'; // Componente para la búsqueda de productos

// Definición de rutas de la aplicación
const routes: Routes = [
    { 
      path: '', // Ruta raíz
      loadComponent: () =>
        import('./lista-productos/lista-productos.component').then(
          (m) => m.ListaProductosComponent // Carga diferida del componente ListaProductosComponent
        ),
    },
    {
      path: 'busqueda', // Ruta para la búsqueda de productos
      component: BusquedaProductosComponent // Componente cargado directamente
    },
    {
      path: 'producto/:id', // Ruta con parámetro dinámico para detalles de productos
      loadComponent: () => 
        import('./producto/producto.component').then(
          (m) => m.ProductoComponent // Carga diferida del componente ProductoComponent
        ),
    },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) // Configuración de rutas y estrategia de precarga
  ],
  exports: [RouterModule] // Exporta el módulo de enrutamiento para su uso en otros módulos
})
export class AppRoutingModule { }
