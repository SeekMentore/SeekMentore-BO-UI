import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiriesDataComponent } from './enquiries-data.component';

describe('EnquiriesDataComponent', () => {
  let component: EnquiriesDataComponent;
  let fixture: ComponentFixture<EnquiriesDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiriesDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiriesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
