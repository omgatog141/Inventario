import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { ProductoComponent } from './producto.component';
import { ApiService } from '../productos/api.service';
import { Producto } from '../producto.model';

const producto: Producto = {
  id: 5,
  title: 'Laptop',
  description: 'Una laptop',
  price: 100,
  category: 'laptops',
  stock: 3,
  image: '',
  thumbnail: '',
  tags: [],
};

describe('ProductoComponent', () => {
  let component: ProductoComponent;
  let fixture: ComponentFixture<ProductoComponent>;
  let api: jasmine.SpyObj<ApiService>;

  const crear = async (respuesta: Promise<Producto | null>) => {
    api.getProductoById.and.returnValue(respuesta);
    fixture = TestBed.createComponent(ProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['getProductoById']);

    await TestBed.configureTestingModule({
      imports: [ProductoComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: api },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '5' }) } } },
      ],
    }).compileComponents();
  });

  it('muestra "Cargando..." mientras llega la respuesta', async () => {
    await crear(new Promise(() => {})); // nunca resuelve

    expect(component.producto).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Cargando...');
  });

  it('pide el producto por el id de la ruta y lo muestra', async () => {
    await crear(Promise.resolve(producto));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(api.getProductoById).toHaveBeenCalledWith(5);
    expect(component.producto?.title).toBe('Laptop');
    expect(fixture.nativeElement.textContent).toContain('Laptop');
    expect(fixture.nativeElement.textContent).not.toContain('Cargando...');
  });

  it('muestra "Producto no encontrado." si la API devuelve null', async () => {
    await crear(Promise.resolve(null));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.noEncontrado).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Producto no encontrado.');
  });

  it('muestra "Producto no encontrado." si la petición lanza error', async () => {
    await crear(Promise.reject(new Error('fallo')));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.noEncontrado).toBeTrue();
  });
});
