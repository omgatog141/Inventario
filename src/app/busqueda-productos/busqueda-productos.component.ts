import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../productos/api.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../producto.model';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  selector: 'app-busqueda-productos',
  templateUrl: './busqueda-productos.component.html',
  styleUrls: ['./busqueda-productos.component.scss'],
})
export class BusquedaProductosComponent implements OnInit {
  productos: Producto[] = [];
  tag: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.tag = params['tag'] || '';
      if (this.tag.trim()) {
        this.ejecutarBusqueda(this.tag.trim());
      } else {
        this.productos = [];
      }
    });
  }

  buscar() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tag: this.tag?.trim() || null },
      replaceUrl: true,
    });
  }

  private ejecutarBusqueda(tag: string) {
    this.apiService.buscarProductosPorTag(tag).then(
      (productos) => {
        if (tag === this.tag.trim()) this.productos = productos; // Ignorar respuestas obsoletas
      },
      (error) => console.error('Error al buscar productos: ', error)
    );
  }

  redirectADetalles(productoId: number) {
    this.router.navigate(['/producto', productoId]);
  }

  regresarLista() {
    this.router.navigate(['/']);
  }
}
