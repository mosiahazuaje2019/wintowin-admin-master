import { TestBed } from '@angular/core/testing';

import { UpimagesService } from './upimages.service';

describe('UpimagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpimagesService = TestBed.get(UpimagesService);
    expect(service).toBeTruthy();
  });
});
