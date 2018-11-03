import {Component, Input, OnInit} from '@angular/core';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {EnquiryDataAccess} from '../enquiry-registration.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';

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

  editRecordForm = false;

  enquiryStatusFilterOptions = CommonFilterOptions.enquiryStatusFilterOptions;
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

  constructor() {
  }

  ngOnInit() {
  }

}
