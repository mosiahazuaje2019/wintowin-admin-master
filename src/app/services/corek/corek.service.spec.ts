import { TestBed } from '@angular/core/testing';

import { CorekService } from './corek.service';

describe('CorekService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorekService = TestBed.get(CorekService);
    expect(service).toBeTruthy();
  });
});
