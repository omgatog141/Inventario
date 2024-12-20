// Define la estructura del modelo de datos para un producto
export interface Producto {
    id: number;           // Identificador único del producto
    title: string;        // Título o nombre del producto
    description: string;  // Descripción detallada del producto
    price: number;        // Precio del producto
    category: string;     // Categoría a la que pertenece el producto
    stock: number;        // Cantidad disponible en inventario
    image: string;        // URL de la imagen principal del producto
    thumbnail: string;    // URL de la miniatura del producto
    tags: string[];       // Lista de etiquetas asociadas al producto
}
