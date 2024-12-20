import { Injectable } from '@angular/core';
import { Producto } from '../producto.model'; // Importamos el modelo del producto

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://dummyjson.com/products'; // URL base de la API

  constructor() {}

  // Obtener todos los productos
  getProductos(): Promise<Producto[]> {
    return fetch(`${this.apiUrl}`) // Uso correcto de las comillas para interpolación
      .then((response) => {
        if (!response.ok) throw new Error('Error en la respuesta de la API');
        return response.json();
      })
      .then((data) => data.products) // Devuelve la lista de productos
      .catch((error) => {
        console.error('Error al obtener los productos:', error); // Manejo de errores
        return [];
      });
  }

  // Obtener un producto por ID
  getProductoById(id: number): Promise<Producto | null> {
    return fetch(`${this.apiUrl}/${id}`) // Uso correcto de las comillas para interpolación
      .then((response) => {
        if (!response.ok) throw new Error('Error en la respuesta de la API');
        return response.json();
      })
      .then((data) => {
        // Manejo de imágenes
        data.image = Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null;
        return data;
      })
      .catch((error) => {
        console.error('Error al obtener el producto:', error); // Manejo de errores
        return null;
      });
  }

  // Buscar productos por tag
  buscarProductosPorTag(tag: string): Promise<Producto[]> {
    return fetch(`${this.apiUrl}/search?q=${tag}`) // Uso correcto de las comillas para interpolación
      .then((response) => {
        if (!response.ok) throw new Error('Error en la respuesta de la API');
        return response.json();
      })
      .then((data) => data.products || []) // Devuelve los productos encontrados o un array vacío
      .catch((error) => {
        console.error('Error al buscar productos:', error); // Manejo de errores
        return [];
      });
  }

  // Eliminar un producto
  eliminarProducto(id: number): Promise<boolean> {
    return fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE', // Método DELETE para eliminar
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error al eliminar el producto');
        return true;
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error); // Manejo de errores
        return false;
      });
  }
}
