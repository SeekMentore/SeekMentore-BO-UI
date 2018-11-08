import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { EnquiryMappingDataAccess } from '../map-tutor-to-enquiry.component';

@Component({
  selector: 'app-map-tutor-to-enquiry-data',
  templateUrl: './map-tutor-to-enquiry-data.component.html',
  styleUrls: ['./map-tutor-to-enquiry-data.component.css']
})
export class MapTutorToEnquiryDataComponent implements OnInit {

  @Input()
  enquiryRecord: GridRecord = null;

  @Input()
  enquiryMappingDataAccess: EnquiryMappingDataAccess = null;

  constructor() { }

  ngOnInit() {
  }

}
