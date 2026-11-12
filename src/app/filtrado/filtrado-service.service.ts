import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltradoServiceService {
  private baseUrl = 'https://dummyjson.com/products';

  constructor() {}

  obtenerCategorias(): Promise<string[]> {
    return fetch(`${this.baseUrl}/category-list`)
      .then((response) => response.json())
      .then((data) => data || [])
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
        return [];
      });
  }

  obtenerProductosPorCategoria(categoria: string): Promise<any[]> {
    return fetch(`${this.baseUrl}/category/${categoria}`)
      .then((response) => response.json())
      .then((data) => data.products || [])
      .catch((error) => {
        console.error('Error al obtener los productos por categoría:', error);
        return [];
      });
  }
}
