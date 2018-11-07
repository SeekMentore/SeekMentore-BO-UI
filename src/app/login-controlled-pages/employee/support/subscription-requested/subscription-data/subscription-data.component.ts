import {Component, OnInit, Input} from '@angular/core';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {SubscriptionDataAccess} from '../subscription-requested.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';
import {AppUtilityService} from "../../../../../utils/app-utility.service";
import {HelperService} from "../../../../../utils/helper.service";
import {LcpRestUrls} from "../../../../../utils/lcp-rest-urls";
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

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

  updatedSubscriptionRecord = {};

  editRecordForm = false;


  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  applicationStatusFilterOptions = CommonFilterOptions.applicationStatusFilterOptions;
  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;


  selectedApplicationStatus: any[] = [];
  selectedStudentGradeOptions: any[] = [];
  selectedSubjectOptions: any[] = [];
  selectedLocationOptions: any[] = [];
  selectedCallTimeOption: any[] = [];
  selectedReferenceOption: any[] = [];



  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
    this.selectedApplicationStatus = CommonUtilityFunctions.getSelectedFilterItems(this.applicationStatusFilterOptions, this.subscriptionRecord.getProperty('applicationStatus'));
    this.selectedStudentGradeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.subscriptionRecord.getProperty('studentGrades'));
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.subscriptionRecord.getProperty('subjects'));
    this.selectedLocationOptions = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.subscriptionRecord.getProperty('locations'));
    this.selectedCallTimeOption = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.subscriptionRecord.getProperty('preferredTimeToCall'));
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.subscriptionRecord.getProperty('reference'));
  }

  updateSubscriptionProperty(key: string, value: string, data_type: string) {
    CommonUtilityFunctions.updateRecordProperty(key, value, data_type, this.updatedSubscriptionRecord, this.subscriptionRecord);
  }

  updateSubscriptionRecord() {
    const data = this.helperService.encodedGridFormData(this.updatedSubscriptionRecord, this.subscriptionRecord.getProperty('subscriptionId'));
    this.utilityService.makerequest(this, this.onUpdateSubscriptionRecord, LcpRestUrls.customer_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateSubscriptionRecord(context: any, data: any) {
    if (data['success'] === true) {

    } else {

    }

  }

}
