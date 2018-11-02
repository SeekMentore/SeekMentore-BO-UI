import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AllEnquiriesDataAccess } from '../all-enquiries.component';

@Component({
  selector: 'app-enquiries-data',
  templateUrl: './enquiries-data.component.html',
  styleUrls: ['./enquiries-data.component.css']
})
export class EnquiriesDataComponent implements OnInit {

  @Input()
  enquiriesRecord: GridRecord = null;

  @Input()
  allEnquiriesDataAccess: AllEnquiriesDataAccess = null;

  constructor() { }

  ngOnInit() {
  }

}
