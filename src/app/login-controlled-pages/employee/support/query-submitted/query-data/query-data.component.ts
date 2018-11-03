import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { QueryDataAccess } from '../query-submitted.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';

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
