import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoatComponent } from './soat.component';

describe('SoatComponent', () => {
  let component: SoatComponent;
  let fixture: ComponentFixture<SoatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
