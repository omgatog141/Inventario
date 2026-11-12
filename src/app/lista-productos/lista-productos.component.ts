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
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = '';
  searchQuery: string = '';

  constructor(
    private apiService: ApiService,
    private filtradoService: FiltradoServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiService.getProductos().then(
      (data) => {
        this.productos = data;
        this.productosFiltrados = data;
      },
      (error) => console.error('Error al obtener productos:', error)
    );

    this.filtradoService.obtenerCategorias().then(
      (categorias) => {
        this.categorias = ['Todos', ...categorias];
      },
      (error) => console.error('Error al obtener categorías:', error)
    );
  }

  filtrar() {
    if (this.categoriaSeleccionada === 'Todos' || !this.categoriaSeleccionada) {
      this.productosFiltrados = this.productos;
    } else {
      this.filtradoService.obtenerProductosPorCategoria(this.categoriaSeleccionada).then(
        (productos) => (this.productosFiltrados = productos),
        (error) => console.error('Error al filtrar productos:', error)
      );
    }
  }

  buscar() {
    const texto = (this.searchQuery || '').trim();
    if (!texto) return;
    this.router.navigate(['/busqueda'], { queryParams: { tag: texto } });
  }

  redirectADetalles(productoId: number) {
    this.router.navigate(['/producto', productoId]);
  }

  exportarProductos() {
    const productosData = JSON.stringify(this.productosFiltrados, null, 2);
    const blob = new Blob([productosData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'productos.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  eliminarProducto(event: Event, id: number): void {
    event.stopPropagation();

    this.apiService.eliminarProducto(id).then((eliminado) => {
      if (!eliminado) {
        console.error('No se pudo eliminar el producto', id);
        return;
      }
      // Quitar de ambas listas para que no reaparezca al cambiar de filtro
      this.productos = this.productos.filter((p) => p.id !== id);
      this.productosFiltrados = this.productosFiltrados.filter((p) => p.id !== id);
    });
  }

}