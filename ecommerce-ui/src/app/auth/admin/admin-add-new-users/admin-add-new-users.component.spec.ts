import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddNewUsersComponent } from './admin-add-new-users.component';

describe('AdminAddNewUsersComponent', () => {
  let component: AdminAddNewUsersComponent;
  let fixture: ComponentFixture<AdminAddNewUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddNewUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddNewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
