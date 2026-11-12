import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('eliminarProducto', () => {
    it('devuelve true si la API responde OK y usa DELETE', async () => {
      const fetchSpy = spyOn(window, 'fetch').and.resolveTo(new Response('{}', { status: 200 }));

      expect(await service.eliminarProducto(7)).toBeTrue();
      expect(fetchSpy).toHaveBeenCalledWith(jasmine.stringMatching(/\/products\/7$/), { method: 'DELETE' });
    });

    it('devuelve false si la API responde con error', async () => {
      spyOn(window, 'fetch').and.resolveTo(new Response('{}', { status: 500 }));
      spyOn(console, 'error');

      expect(await service.eliminarProducto(7)).toBeFalse();
    });

    it('devuelve false si falla la red', async () => {
      spyOn(window, 'fetch').and.rejectWith(new TypeError('network'));
      spyOn(console, 'error');

      expect(await service.eliminarProducto(7)).toBeFalse();
    });
  });
});
