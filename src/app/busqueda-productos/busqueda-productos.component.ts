import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../productos/api.service'; // Servicio para interactuar con la API de productos
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../producto.model'; // Modelo para los productos

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule], // Importación de módulos necesarios
  selector: 'app-busqueda-productos',
  templateUrl: './busqueda-productos.component.html',
  styleUrls: ['./busqueda-productos.component.scss'],
})
export class BusquedaProductosComponent implements OnInit {
  productos: Producto[] = []; // Almacena la lista de productos obtenidos
  tag: string = ''; // Tag para filtrar los productos

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private route: ActivatedRoute, // Manejo de parámetros de la URL
    private router: Router // Navegación entre componentes
  ) {}

  ngOnInit(): void {
    // Captura el tag de búsqueda desde la URL
    this.route.queryParams.subscribe((params) => {
      this.tag = params['tag'] || ''; // Obtiene el tag si está disponible
      console.log('Tag recibido desde la URL:', this.tag);
      if (this.tag) {
        this.buscar(); // Busca productos si el tag está definido
      }
    });
  }

  // Busca productos en la API utilizando el tag
  buscar() {
    this.apiService.buscarProductosPorTag(this.tag).then(
      (productos) => {
        console.log('Productos obtenidos:', productos);
        this.productos = productos; // Actualiza la lista de productos
      },
      (error) => console.error('Error al buscar productos: ', error)
    );
  }

  // Redirige a los detalles de un producto específico
  redirectADetalles(productoId: number) {
    this.router.navigate(['/producto', productoId]);
  }

  // Regresa a la vista principal o lista de productos
  regresarLista() {
    this.router.navigate(['/']);
  }
}
