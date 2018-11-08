import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredTutorComponent } from './registered-tutor.component';

describe('RegisteredTutorComponent', () => {
  let component: RegisteredTutorComponent;
  let fixture: ComponentFixture<RegisteredTutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredTutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
