import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTutorToEnquiryDataComponent } from './map-tutor-to-enquiry-data.component';

describe('MapTutorToEnquiryDataComponent', () => {
  let component: MapTutorToEnquiryDataComponent;
  let fixture: ComponentFixture<MapTutorToEnquiryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTutorToEnquiryDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTutorToEnquiryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
