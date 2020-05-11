import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoatBackComponent } from './soat-back.component';

describe('SoatBackComponent', () => {
  let component: SoatBackComponent;
  let fixture: ComponentFixture<SoatBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoatBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoatBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
