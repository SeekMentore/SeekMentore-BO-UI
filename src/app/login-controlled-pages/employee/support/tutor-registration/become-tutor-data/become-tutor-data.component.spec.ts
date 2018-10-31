import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeTutorDataComponent } from './become-tutor-data.component';

describe('BecomeTutorDataComponent', () => {
  let component: BecomeTutorDataComponent;
  let fixture: ComponentFixture<BecomeTutorDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeTutorDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeTutorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
