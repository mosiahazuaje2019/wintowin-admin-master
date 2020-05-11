import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoLicComponent } from './photo-lic.component';

describe('PhotoLicComponent', () => {
  let component: PhotoLicComponent;
  let fixture: ComponentFixture<PhotoLicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoLicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoLicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
