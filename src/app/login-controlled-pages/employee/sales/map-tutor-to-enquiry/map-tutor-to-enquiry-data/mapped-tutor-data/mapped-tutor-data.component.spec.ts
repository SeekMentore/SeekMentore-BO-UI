import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedTutorDataComponent } from './mapped-tutor-data.component';

describe('MappedTutorDataComponent', () => {
  let component: MappedTutorDataComponent;
  let fixture: ComponentFixture<MappedTutorDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappedTutorDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappedTutorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
