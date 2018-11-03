import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { ComplaintDataAccess } from '../complaints.component';
import {CommonFilterOptions} from "../../../../../utils/common-filter-options";

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
  editRecordForm = false;

  complaintStatusFilterOptions = CommonFilterOptions.complaintStatusFilterOptions;
  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  complaintUserFilterOptions = CommonFilterOptions.complaintUserFilterOptions;

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
