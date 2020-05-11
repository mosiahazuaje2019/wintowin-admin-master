import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTravelsComponent } from './details-travels.component';

describe('DetailsTravelsComponent', () => {
  let component: DetailsTravelsComponent;
  let fixture: ComponentFixture<DetailsTravelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsTravelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTravelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
