import { TestBed } from '@angular/core/testing';

import { FiltradoServiceService } from './filtrado-service.service';

describe('FiltradoServiceService', () => {
  let service: FiltradoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltradoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
