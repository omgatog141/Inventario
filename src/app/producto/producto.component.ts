import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../productos/api.service';
import { Producto } from '../producto.model';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductoComponent implements OnInit {
  producto: Producto | null = null;
  noEncontrado = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const productoId = Number(this.route.snapshot.paramMap.get('id'));

    this.apiService.getProductoById(productoId).then(
      (data) => {
        if (data) {
          this.producto = { ...data };
        } else {
          this.noEncontrado = true;
        }
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
        this.noEncontrado = true;
      }
    );
  }
}
