import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTutorToEnquiryComponent } from './map-tutor-to-enquiry.component';

describe('MapTutorToEnquiryComponent', () => {
  let component: MapTutorToEnquiryComponent;
  let fixture: ComponentFixture<MapTutorToEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTutorToEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTutorToEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
