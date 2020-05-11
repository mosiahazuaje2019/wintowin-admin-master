import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugaresMatriculasComponent } from './lugares-matriculas.component';

describe('LugaresMatriculasComponent', () => {
  let component: LugaresMatriculasComponent;
  let fixture: ComponentFixture<LugaresMatriculasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugaresMatriculasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugaresMatriculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
