import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { QueryDataAccess } from '../query-submitted.component';

@Component({
  selector: 'app-query-data',
  templateUrl: './query-data.component.html',
  styleUrls: ['./query-data.component.css']
})
export class QueryDataComponent implements OnInit {

  @Input()
  queryRecord: GridRecord = null;

  @Input()
  queryDataAccess: QueryDataAccess = null;

  constructor() { }

  ngOnInit() {
  }

}
