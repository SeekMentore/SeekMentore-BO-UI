import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { ComplaintDataAccess } from '../complaints.component';

@Component({
  selector: 'app-complaint-data',
  templateUrl: './complaint-data.component.html',
  styleUrls: ['./complaint-data.component.css']
})
export class ComplaintDataComponent implements OnInit {

  @Input()
  complaintRecord: GridRecord = null;

  @Input()
  complaintDataAccess: ComplaintDataAccess = null;

  constructor() { }

  ngOnInit() {
  }

}
