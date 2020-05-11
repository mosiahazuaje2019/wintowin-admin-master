import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTravelsComponent } from './history-travels.component';

describe('HistoryTravelsComponent', () => {
  let component: HistoryTravelsComponent;
  let fixture: ComponentFixture<HistoryTravelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryTravelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTravelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
