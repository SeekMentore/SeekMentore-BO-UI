import { Component, Input, OnInit } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { EnquiryDataAccess } from '../enquiry-registration.component';

@Component({
  selector: 'app-enquiry-data',
  templateUrl: './enquiry-data.component.html',
  styleUrls: ['./enquiry-data.component.css']
})
export class EnquiryDataComponent implements OnInit {

  @Input()
  enquiryRecord: GridRecord = null;

  @Input()
  enquiryDataAccess: EnquiryDataAccess = null;

  constructor() { }

  ngOnInit() {
  }

}
