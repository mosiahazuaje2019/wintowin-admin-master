import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterHeroComponent } from './register-hero.component';

describe('RegisterHeroComponent', () => {
  let component: RegisterHeroComponent;
  let fixture: ComponentFixture<RegisterHeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterHeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
