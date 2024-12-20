import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Define que este servicio estará disponible en toda la aplicación
})
export class FiltradoServiceService {
  private baseUrl = 'https://dummyjson.com/products'; // URL base de la API

  constructor() {}

  // Obtener la lista de categorías disponibles
  obtenerCategorias(): Promise<string[]> {
    return fetch(`${this.baseUrl}/category-list`) // Realiza la solicitud para obtener categorías
      .then((response) => response.json()) // Convierte la respuesta en JSON
      .then((data) => data || []) // Devuelve las categorías o un array vacío si no hay datos
      .catch((error) => {
        console.error('Error al obtener las categorías:', error); // Manejo de errores
        return [];
      });
  }

  // Obtener productos de una categoría específica
  obtenerProductosPorCategoria(categoria: string): Promise<any[]> {
    return fetch(`${this.baseUrl}/category/${categoria}`) // Realiza la solicitud para obtener productos por categoría
      .then((response) => response.json()) // Convierte la respuesta en JSON
      .then((data) => data.products || []) // Devuelve los productos o un array vacío si no hay datos
      .catch((error) => {
        console.error('Error al obtener los productos por categoría:', error); // Manejo de errores
        return [];
      });
  }
}
