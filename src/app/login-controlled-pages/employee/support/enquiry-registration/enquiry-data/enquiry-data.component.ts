import { Component, Input, OnInit } from '@angular/core';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { EnquiryDataAccess } from 'src/app/login-controlled-pages/employee/support/enquiry-registration/enquiry-registration.component';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';

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

  @Input()
  selectedRecordGridType: string = null;

  enquiryUpdatedRecord = {};

  showEmployeeActionDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  enquiryStatusFilterOptions = CommonFilterOptions.publicApplicationStatusFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  selectedStudentGradeOption: any[] = [];
  selectedSubjectOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedCallTimeOptions: any[] = [];
  selectedReferenceOption: any[] = [];  

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
    this.selectedStudentGradeOption = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.enquiryRecord.getProperty('studentGrade'));
    this.selectedSubjectOption = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.enquiryRecord.getProperty('subjects'));
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.enquiryRecord.getProperty('location'));
    this.selectedCallTimeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.enquiryRecord.getProperty('preferredTimeToCall'));
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.enquiryRecord.getProperty('reference'));
    this.setDisabledStatus();  
  }

  private setDisabledStatus() {
    if (
      this.selectedRecordGridType === 'nonContactedEnquiryGrid' 
      || this.selectedRecordGridType === 'nonVerifiedEnquiryGrid' 
      || this.selectedRecordGridType === 'verifiedEnquiryGrid'
      || this.selectedRecordGridType === 'verificationFailedEnquiryGrid'
      || this.selectedRecordGridType === 'toBeReContactedEnquiryGrid'
    ) {
      this.formEditMandatoryDisbaled = false;
      this.takeActionDisabled = false;
    }
    if (this.selectedRecordGridType === 'rejectedEnquiryGrid') {
      this.takeActionDisabled = false;
    }
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  updateEnquiryProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.enquiryUpdatedRecord, this.enquiryRecord.property, deselected, isAllOPeration);
  }

  updateEnquiryRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.enquiryUpdatedRecord, this.enquiryRecord.getProperty('enquiryId'));
    this.utilityService.makerequest(this, this.onUpdateEnquiryRecord, LcpRestUrls.enquiry_request_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  takeActionOnEnquiryRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false, blacklist: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.enquiryRecord.getProperty('enquiryId'),
          button: actionText,
          comments: message
        };
        let url: string = LcpRestUrls.take_action_on_find_tutor;
        if (blacklist) {
          url = LcpRestUrls.blackList_enquiry_requests;
        }
        this.utilityService.makerequest(this, this.handleTakeActionOnEnquiryRecord,
          url, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnEnquiryRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
  }

  onUpdateEnquiryRecord(context: any, response: any) {
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

  downloadProfile() {
    const enquiryId: HTMLInputElement = <HTMLInputElement>document.getElementById('profileDownload-enquiryId');
    enquiryId.value = this.enquiryRecord.getProperty('enquiryId');
    this.utilityService.submitForm('profileDownloadForm', '/rest/support/downloadAdminFindTutorProfilePdf', 'POST')
  }
}
