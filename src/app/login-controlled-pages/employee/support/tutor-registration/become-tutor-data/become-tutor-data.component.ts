import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { BecomeTutorDataAccess } from '../tutor-registration.component';

@Component({
  selector: 'app-become-tutor-data',
  templateUrl: './become-tutor-data.component.html',
  styleUrls: ['./become-tutor-data.component.css']
})
export class BecomeTutorDataComponent implements OnInit {

  @Input()
  tutorRecord: GridRecord = null;

  @Input()
  tutorDataAccess: BecomeTutorDataAccess = null;

  constructor() { }

  ngOnInit() {
  }

}
