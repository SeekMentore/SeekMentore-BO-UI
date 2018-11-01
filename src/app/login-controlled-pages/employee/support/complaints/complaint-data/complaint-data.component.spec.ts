import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDataComponent } from './complaint-data.component';

describe('ComplaintDataComponent', () => {
  let component: ComplaintDataComponent;
  let fixture: ComponentFixture<ComplaintDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
