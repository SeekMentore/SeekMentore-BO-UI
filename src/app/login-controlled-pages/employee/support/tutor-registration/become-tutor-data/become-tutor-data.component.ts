import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { BecomeTutorDataAccess } from '../tutor-registration.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';

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

  editRecordForm = false;

  applicationStatusFilterOptions = CommonFilterOptions.applicationStatusFilterOptions;
  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;

  singleSelectOptions = {
    singleSelection: true,
    idField: 'value',
    textField: 'label',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  multiSelectOptions = {
    singleSelection: false,
    idField: 'value',
    textField: 'label',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };


  constructor() { }

  ngOnInit() {
  }

}
