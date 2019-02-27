import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentAttendanceComponent } from './assignment-attendance.component';

describe('AssignmentAttendanceComponent', () => {
  let component: AssignmentAttendanceComponent;
  let fixture: ComponentFixture<AssignmentAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
