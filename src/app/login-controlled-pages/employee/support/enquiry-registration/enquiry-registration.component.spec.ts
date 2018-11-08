import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryRegistrationComponent } from './enquiry-registration.component';

describe('EnquiryRegistrationComponent', () => {
  let component: EnquiryRegistrationComponent;
  let fixture: ComponentFixture<EnquiryRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
