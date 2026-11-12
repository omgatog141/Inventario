import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { BusquedaProductosComponent } from './busqueda-productos.component';
import { ApiService } from '../productos/api.service';
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

describe('BusquedaProductosComponent', () => {
  let component: BusquedaProductosComponent;
  let fixture: ComponentFixture<BusquedaProductosComponent>;
  let api: jasmine.SpyObj<ApiService>;
  let router: Router;
  let queryParams: BehaviorSubject<Params>;

  beforeEach(async () => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['buscarProductosPorTag']);
    api.buscarProductosPorTag.and.resolveTo([crearProducto(1)]);
    queryParams = new BehaviorSubject<Params>({});

    await TestBed.configureTestingModule({
      imports: [BusquedaProductosComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: api },
        { provide: ActivatedRoute, useValue: { queryParams } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    fixture = TestBed.createComponent(BusquedaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create sin buscar si no hay tag', () => {
    expect(component).toBeTruthy();
    expect(api.buscarProductosPorTag).not.toHaveBeenCalled();
    expect(component.productos).toEqual([]);
  });

  it('busca cuando la URL trae un tag', async () => {
    queryParams.next({ tag: 'phone' });
    await fixture.whenStable();

    expect(api.buscarProductosPorTag).toHaveBeenCalledWith('phone');
    expect(component.productos.map((p) => p.id)).toEqual([1]);
  });

  it('limpia los resultados cuando el tag queda vacío', async () => {
    queryParams.next({ tag: 'phone' });
    await fixture.whenStable();

    queryParams.next({});

    expect(component.productos).toEqual([]);
  });

  it('ignora respuestas obsoletas', async () => {
    let resolverViejo!: (p: Producto[]) => void;
    api.buscarProductosPorTag.and.callFake((tag: string) =>
      tag === 'a'
        ? new Promise<Producto[]>((res) => (resolverViejo = res))
        : Promise.resolve([crearProducto(2)])
    );

    queryParams.next({ tag: 'a' });
    queryParams.next({ tag: 'ab' });
    await fixture.whenStable();
    resolverViejo([crearProducto(99)]);
    await fixture.whenStable();

    expect(component.productos.map((p) => p.id)).toEqual([2]);
  });

  it('buscar() actualiza la URL con el tag recortado', () => {
    component.tag = ' laptop ';
    component.buscar();

    expect(router.navigate).toHaveBeenCalledWith([], jasmine.objectContaining({
      queryParams: { tag: 'laptop' },
      replaceUrl: true,
    }));
  });

  it('buscar() quita el parámetro tag si está vacío', () => {
    component.tag = '';
    component.buscar();

    expect(router.navigate).toHaveBeenCalledWith([], jasmine.objectContaining({
      queryParams: { tag: null },
    }));
  });
});
