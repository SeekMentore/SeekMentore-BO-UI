import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredTutorDataComponent } from './registered-tutor-data.component';

describe('RegisteredTutorDataComponent', () => {
  let component: RegisteredTutorDataComponent;
  let fixture: ComponentFixture<RegisteredTutorDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredTutorDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredTutorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
