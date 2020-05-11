import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMessageComponent } from './users-message.component';

describe('UsersMessageComponent', () => {
  let component: UsersMessageComponent;
  let fixture: ComponentFixture<UsersMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
