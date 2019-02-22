import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { SubscriptionPackageDataAccess } from '../../subscription-packages.component';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { SubscriptionPackageAssignmentDataAccess } from '../subscription-package-data.component';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-subscription-package-assignment',
  templateUrl: './subscription-package-assignment.component.html',
  styleUrls: ['./subscription-package-assignment.component.css']
})
export class SubscriptionPackageAssignmentComponent implements OnInit {

  @Input()
  subscriptionPackageAssignmentRecord: GridRecord = null;

  @Input()
  subscriptionPackageAssignmentDataAccess: SubscriptionPackageAssignmentDataAccess = null;

  @Input()
  selectedRecordGridType: string = null;

  subscriptionPackageAssignmentUpdatedRecord = {};

  loadSelectedSubscriptionPackageAssignment = true;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  matchStatusFilterOptions = CommonFilterOptions.matchStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;
  happinessIndexFilterOptions = CommonFilterOptions.happinessIndexFilterOptions;
  packageBillingTypeFilterOptions = CommonFilterOptions.packageBillingTypeFilterOptions;

  selectedPackageBillingTypeOptions: any[] = [];
  selectedIsCustomerGrievedOptions: any[] = [];
  selectedCustomerHappinessIndexOptions: any[] = [];
  selectedIsTutorGrievedOptions: any[] = [];
  selectedTutorHappinessIndexOptions: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
  }

  ngOnInit() {
    this.selectedPackageBillingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.packageBillingTypeFilterOptions, this.subscriptionPackageAssignmentRecord.getProperty('packageBillingType'));
    this.selectedIsCustomerGrievedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.subscriptionPackageAssignmentRecord.getProperty('isCustomerGrieved'));
    this.selectedCustomerHappinessIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.subscriptionPackageAssignmentRecord.getProperty('customerHappinessIndex'));
    this.selectedIsTutorGrievedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.subscriptionPackageAssignmentRecord.getProperty('isTutorGrieved'));
    this.selectedTutorHappinessIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.subscriptionPackageAssignmentRecord.getProperty('tutorHappinessIndex'));
    this.setDisabledStatus();
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  private setDisabledStatus() {
    if (this.selectedRecordGridType === 'selectedSubscriptionPackageAllCurrentAssignmentGrid') {
      this.formEditMandatoryDisbaled = false;
      this.takeActionDisabled = false;
    }
  }

  updateSubscriptionPackageAssignmentProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.subscriptionPackageAssignmentUpdatedRecord, this.subscriptionPackageAssignmentRecord, deselected, isAllOPeration);
  }

  updateSubscriptionPackageAssignmentRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.subscriptionPackageAssignmentUpdatedRecord, this.subscriptionPackageAssignmentRecord.getProperty('packageAssignmentSerialId'));
    this.utilityService.makerequest(this, this.onUpdateSubscriptionPackageAssignmentRecord, LcpRestUrls.subscription_package_assignment_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateSubscriptionPackageAssignmentRecord(context: any, data: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: data['success'],
      message: data['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (data['success']) {
      context.editRecordForm = false;
    }
  }
}