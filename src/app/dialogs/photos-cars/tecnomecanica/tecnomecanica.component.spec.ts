import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnomecanicaComponent } from './tecnomecanica.component';

describe('TecnomecanicaComponent', () => {
  let component: TecnomecanicaComponent;
  let fixture: ComponentFixture<TecnomecanicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TecnomecanicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TecnomecanicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
