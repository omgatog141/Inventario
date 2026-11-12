import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { ListaProductosComponent } from './lista-productos.component';
import { ApiService } from '../productos/api.service';
import { FiltradoServiceService } from '../filtrado/filtrado-service.service';
import { Producto } from '../producto.model';

const crearProducto = (id: number): Producto => ({
  id,
  title: `Producto ${id}`,
  description: '',
  price: 1,
  category: 'cat',
  stock: 1,
  image: '',
  thumbnail: '',
  tags: [],
});

describe('ListaProductosComponent', () => {
  let component: ListaProductosComponent;
  let fixture: ComponentFixture<ListaProductosComponent>;
  let api: jasmine.SpyObj<ApiService>;
  let router: Router;

  beforeEach(async () => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['getProductos', 'eliminarProducto']);
    api.getProductos.and.resolveTo([crearProducto(1), crearProducto(2), crearProducto(3)]);
    const filtrado = jasmine.createSpyObj<FiltradoServiceService>('FiltradoServiceService', [
      'obtenerCategorias',
      'obtenerProductosPorCategoria',
    ]);
    filtrado.obtenerCategorias.and.resolveTo(['cat']);

    await TestBed.configureTestingModule({
      imports: [ListaProductosComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: api },
        { provide: FiltradoServiceService, useValue: filtrado },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    fixture = TestBed.createComponent(ListaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create y cargar productos', () => {
    expect(component).toBeTruthy();
    expect(component.productos.length).toBe(3);
    expect(component.productosFiltrados.length).toBe(3);
  });

  describe('eliminarProducto', () => {
    it('quita el producto de productos y productosFiltrados si la API responde OK', async () => {
      api.eliminarProducto.and.resolveTo(true);

      component.eliminarProducto(new Event('click'), 2);
      await fixture.whenStable();

      expect(component.productos.map((p) => p.id)).toEqual([1, 3]);
      expect(component.productosFiltrados.map((p) => p.id)).toEqual([1, 3]);
    });

    it('no reaparece al volver a "Todos"', async () => {
      api.eliminarProducto.and.resolveTo(true);

      component.eliminarProducto(new Event('click'), 1);
      await fixture.whenStable();
      component.categoriaSeleccionada = 'Todos';
      component.filtrar();

      expect(component.productosFiltrados.map((p) => p.id)).toEqual([2, 3]);
    });

    it('conserva el producto si la API falla', async () => {
      api.eliminarProducto.and.resolveTo(false);

      component.eliminarProducto(new Event('click'), 2);
      await fixture.whenStable();

      expect(component.productos.length).toBe(3);
      expect(component.productosFiltrados.length).toBe(3);
    });

    it('detiene la propagación del evento', () => {
      api.eliminarProducto.and.resolveTo(true);
      const event = new Event('click');
      spyOn(event, 'stopPropagation');

      component.eliminarProducto(event, 1);

      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('buscar', () => {
    it('no navega con texto vacío o solo espacios', () => {
      component.searchQuery = '   ';
      component.buscar();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('navega a /busqueda con el texto recortado', () => {
      component.searchQuery = '  phone ';
      component.buscar();
      expect(router.navigate).toHaveBeenCalledWith(['/busqueda'], { queryParams: { tag: 'phone' } });
    });
  });
});
