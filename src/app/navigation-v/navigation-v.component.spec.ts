import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationVComponent } from './navigation-v.component';

describe('NavigationVComponent', () => {
  let component: NavigationVComponent;
  let fixture: ComponentFixture<NavigationVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
