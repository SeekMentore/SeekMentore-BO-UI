import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAssignmentAttendanceComponent } from './mark-assignment-attendance.component';

describe('MarkAssignmentAttendanceComponent', () => {
  let component: MarkAssignmentAttendanceComponent;
  let fixture: ComponentFixture<MarkAssignmentAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAssignmentAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAssignmentAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
