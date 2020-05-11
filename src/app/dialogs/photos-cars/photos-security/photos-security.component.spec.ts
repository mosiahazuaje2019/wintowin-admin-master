import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosSecurityComponent } from './photos-security.component';

describe('PhotosSecurityComponent', () => {
  let component: PhotosSecurityComponent;
  let fixture: ComponentFixture<PhotosSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotosSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
