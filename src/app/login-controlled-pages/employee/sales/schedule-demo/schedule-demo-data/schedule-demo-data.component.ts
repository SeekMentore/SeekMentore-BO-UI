import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { MappedTutorScheduleDemoAccess } from '../schedule-demo.component';

@Component({
  selector: 'app-schedule-demo-data',
  templateUrl: './schedule-demo-data.component.html',
  styleUrls: ['./schedule-demo-data.component.css']
})
export class ScheduleDemoDataComponent implements OnInit {

  @Input()
  mappedTutorRecord: GridRecord = null;

  @Input()
  mappedTutorScheduleDemoAccess: MappedTutorScheduleDemoAccess = null;

  constructor() { }

  ngOnInit() {
  }

}
