import { Component, Input, OnInit } from '@angular/core';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AppUtilityService } from "../../../../../utils/app-utility.service";
import { CommonFilterOptions } from '../../../../../utils/common-filter-options';
import { HelperService } from "../../../../../utils/helper.service";
import { LcpRestUrls } from "../../../../../utils/lcp-rest-urls";
import { SubscriptionDataAccess } from '../subscription-requested.component';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';

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

  @Input()
  selectedRecordGridType: string = null;

  updatedSubscriptionRecord = {};

  showSubscriptionActionDetails = false;
  showSubscriptionActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  applicationStatusFilterOptions = CommonFilterOptions.publicApplicationStatusFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  selectedStudentGradeOptions: any[] = [];
  selectedSubjectOptions: any[] = [];
  selectedLocationOptions: any[] = [];
  selectedCallTimeOption: any[] = [];
  selectedReferenceOption: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
    this.selectedStudentGradeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.subscriptionRecord.getProperty('studentGrade'));
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.subscriptionRecord.getProperty('subjects'));
    this.selectedLocationOptions = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.subscriptionRecord.getProperty('location'));
    this.selectedCallTimeOption = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.subscriptionRecord.getProperty('preferredTimeToCall'));
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.subscriptionRecord.getProperty('reference'));
    this.setDisabledStatus();
  }

  private setDisabledStatus() {
    if (
      this.selectedRecordGridType === 'nonContactedSubscriptionGrid' 
      || this.selectedRecordGridType === 'nonVerifiedSubscriptionGrid' 
      || this.selectedRecordGridType === 'verifiedSubscriptionGrid'
      || this.selectedRecordGridType === 'verificationFailedSubscriptionGrid'
      || this.selectedRecordGridType === 'toBeReContactedSubscriptionGrid'
    ) {
      this.formEditMandatoryDisbaled = false;
      this.takeActionDisabled = false;
    }
    if (this.selectedRecordGridType === 'rejectedSubscriptionGrid') {
      this.takeActionDisabled = false;
    }
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);;
  }

  updateSubscriptionProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.updatedSubscriptionRecord, this.subscriptionRecord, deselected, isAllOPeration);
  }

  updateSubscriptionRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.updatedSubscriptionRecord, this.subscriptionRecord.getProperty('tentativeSubscriptionId'));
    this.utilityService.makerequest(this, this.onUpdateSubscriptionRecord, LcpRestUrls.subscription_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  takeActionOnSubscriptionRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false, blacklist: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.subscriptionRecord.getProperty('tentativeSubscriptionId'),
          button: actionText,
          comments: message
        };
        let url: string = LcpRestUrls.take_action_on_subscription;
        if (blacklist) {
          url = LcpRestUrls.blackList_subscription_request;
        }
        this.utilityService.makerequest(this, this.handleTakeActionOnSubscriptionRecord,
          url, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnSubscriptionRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
  }

  onUpdateSubscriptionRecord(context: any, response: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (response['success']) {
      context.editRecordForm = false;
    }
  }
}
