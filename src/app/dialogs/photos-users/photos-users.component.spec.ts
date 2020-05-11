import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosUsersComponent } from './photos-users.component';

describe('PhotosUsersComponent', () => {
  let component: PhotosUsersComponent;
  let fixture: ComponentFixture<PhotosUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotosUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
