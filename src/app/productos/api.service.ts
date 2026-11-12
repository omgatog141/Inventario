import { Injectable } from '@angular/core';
import { Producto } from '../producto.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor() {}

  getProductos(): Promise<Producto[]> {
    return fetch(`${this.apiUrl}`)
      .then((response) => {
        if (!response.ok) throw new Error('Error en la respuesta de la API');
        return response.json();
      })
      .then((data) => data.products)
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        return [];
      });
  }

  getProductoById(id: number): Promise<Producto | null> {
    return fetch(`${this.apiUrl}/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Error en la respuesta de la API');
        return response.json();
      })
      .then((data) => {
        data.image = Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null;
        return data;
      })
      .catch((error) => {
        console.error('Error al obtener el producto:', error);
        return null;
      });
  }

  buscarProductosPorTag(tag: string): Promise<Producto[]> {
    return fetch(`${this.apiUrl}/search?q=${tag}`)
      .then((response) => {
        if (!response.ok) throw new Error('Error en la respuesta de la API');
        return response.json();
      })
      .then((data) => data.products || [])
      .catch((error) => {
        console.error('Error al buscar productos:', error);
        return [];
      });
  }

  eliminarProducto(id: number): Promise<boolean> {
    return fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error al eliminar el producto');
        return true;
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);
        return false;
      });
  }
}
