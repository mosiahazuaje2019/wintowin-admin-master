import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMessageComponent } from './support-message.component';

describe('SupportMessageComponent', () => {
  let component: SupportMessageComponent;
  let fixture: ComponentFixture<SupportMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
