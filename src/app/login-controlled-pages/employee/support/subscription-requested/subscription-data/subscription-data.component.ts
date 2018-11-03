import {Component, OnInit, Input} from '@angular/core';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {SubscriptionDataAccess} from '../subscription-requested.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';

@Component({
  selector: 'app-subscription-data',
  templateUrl: './subscription-data.component.html',
  styleUrls: ['./subscription-data.component.css']
})
export class SubscriptionDataComponent implements OnInit {

  @Input()
  subscriptionRecord: GridRecord = null;

  @Input()
  subscriptionDataAccess: SubscriptionDataAccess = null;

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

  constructor() {
  }

  ngOnInit() {
  }

}
