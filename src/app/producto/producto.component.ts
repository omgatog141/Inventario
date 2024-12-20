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
  producto: Producto = {
    id: 0,
    title: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image: '',
    thumbnail: '',
    tags: [''],
  }; // Detalle del producto

  constructor(
    private route: ActivatedRoute, // Manejo de parámetros de ruta
    private apiService: ApiService // Servicio para obtener datos
  ) {}

  ngOnInit() {
    // Obtener el ID del producto de la URL
    const productoId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID del producto: ', productoId);

    // Llamar al servicio para obtener los datos del producto
    this.apiService.getProductoById(productoId).then(
      (data) => {
        console.log('Producto obtenido: ', data);
        if (data) {
          this.producto = { ...data }; // Asignar los datos al producto
        } else {
          console.error('Producto no encontrado.');
        }
      },
      (error) => console.error('Error al obtener el producto:', error)
    );
  }
}
