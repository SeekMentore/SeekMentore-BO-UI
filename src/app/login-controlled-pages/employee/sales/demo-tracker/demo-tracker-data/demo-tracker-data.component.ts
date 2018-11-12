import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { DemoTrackerModifyAccess } from '../demo-tracker.component';

@Component({
  selector: 'app-demo-tracker-data',
  templateUrl: './demo-tracker-data.component.html',
  styleUrls: ['./demo-tracker-data.component.css']
})
export class DemoTrackerDataComponent implements OnInit {

  @Input()
  demoTrackerRecord: GridRecord = null;

  @Input()
  demoTrackerModifyAccess: DemoTrackerModifyAccess = null;

  constructor() { }

  ngOnInit() {
  }

}
