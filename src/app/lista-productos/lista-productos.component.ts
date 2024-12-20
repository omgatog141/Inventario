import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../productos/api.service';
import { FiltradoServiceService } from '../filtrado/filtrado-service.service';
import { Producto } from '../producto.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [IonicModule, RouterModule, FormsModule, CommonModule],
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss'],
})
export class ListaProductosComponent implements OnInit {
  productos: Producto[] = []; // Todos los productos
  productosFiltrados: Producto[] = []; // Productos mostrados
  categorias: string[] = []; // Lista de categorías
  categoriaSeleccionada: string = ''; // Categoría seleccionada
  searchQuery: string = ''; // Texto de búsqueda

  constructor(
    private apiService: ApiService, // Servicio para productos
    private filtradoService: FiltradoServiceService, // Servicio para filtrado
    private router: Router // Navegación
  ) {}

  ngOnInit() {
    // Cargar productos
    this.apiService.getProductos().then(
      (data) => {
        this.productos = data;
        this.productosFiltrados = data; // Mostrar todos inicialmente
      },
      (error) => console.error('Error al obtener productos:', error)
    );

    // Cargar categorías
    this.filtradoService.obtenerCategorias().then(
      (categorias) => {
        this.categorias = ['Todos', ...categorias]; // Agregar opción 'Todos'
      },
      (error) => console.error('Error al obtener categorías:', error)
    );
  }

  // Filtrar productos por categoría
  filtrar() {
    if (this.categoriaSeleccionada === 'Todos' || !this.categoriaSeleccionada) {
      this.productosFiltrados = this.productos; // Mostrar todos si no hay filtro
    } else {
      this.filtradoService.obtenerProductosPorCategoria(this.categoriaSeleccionada).then(
        (productos) => (this.productosFiltrados = productos),
        (error) => console.error('Error al filtrar productos:', error)
      );
    }
  }

  // Buscar productos por texto
  buscar() {
    this.router.navigate(['/busqueda'], { queryParams: { tag: this.searchQuery } });
  }

  // Redirigir a detalles de producto
  redirectADetalles(productoId: number) {
    this.router.navigate(['/producto', productoId]);
  }

  // Exportar productos filtrados como JSON
  exportarProductos() {
    const productosData = JSON.stringify(this.productosFiltrados, null, 2);
    const blob = new Blob([productosData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'productos.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // Eliminamos el producto que escojamos
  eliminarProducto(event: Event, id: number, index: number): void {
    event.stopPropagation(); // Evitar que se propague el evento de clic
  
    this.apiService.eliminarProducto(id).then(() => {
      // Eliminar producto de la lista local después de la eliminación en la API
      this.productosFiltrados.splice(index, 1);
    }).catch((error) => {
      console.error('Error al eliminar producto:', error);
    });
  }
  
}