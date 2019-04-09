import { Component, Input, OnInit } from '@angular/core';
import { PackageAssignment } from 'src/app/model/package-assignment';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { PackageAssignmentDataAccess } from '../subscription-package-data.component';

@Component({
  selector: 'app-subscription-package-assignment',
  templateUrl: './subscription-package-assignment.component.html',
  styleUrls: ['./subscription-package-assignment.component.css']
})
export class SubscriptionPackageAssignmentComponent implements OnInit {

  @Input()
  packageAssignmentSerialId: string = null;

  @Input()
  packageAssignmentDataAccess: PackageAssignmentDataAccess = null;  

  subscriptionPackageAssignmentUpdatedRecord = {};

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
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

  isRecordUpdateFormDirty: boolean = false;
  packageAssignmentFormMaskLoaderHidden: boolean = true;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  showRecordUpdateButton: boolean = false;  
  canStartAssignment: boolean = false;
  canReviewCompleteAssignment: boolean = false;

  dirtyFlagList: string[] = ['RECORD_UPDATE'];

  // Modal properties
  packageAssignmentRecord: PackageAssignment;
  packageAssignmentCreatedDisplayTime: string;
  packageAssignmentStartDateDisplayTime: string;
  packageAssignmentEndDateDisplayTime: string;
  packageAssignmentActionDateDisplayTime: string;
  packageAssignmentRecordLastUpdatedDateDisplayTime: string;
  selectedPackageBillingTypeOptions: any[] = [];
  selectedIsCustomerGrievedOptions: any[] = [];
  selectedCustomerHappinessIndexOptions: any[] = [];
  selectedIsTutorGrievedOptions: any[] = [];
  selectedTutorHappinessIndexOptions: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.packageAssignmentRecord = new PackageAssignment();
  }

  ngOnInit() {
    this.getPackageAssignmentGridRecord(this.packageAssignmentSerialId);    
  }

  private showRecordUpdateFormLoaderMask() {
    this.packageAssignmentFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.packageAssignmentFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.packageAssignmentDataAccess.packageAssignmentDataModificationAccess;
    this.showRecordUpdateEditControlSection = this.showRecordUpdateForm && !this.formEditMandatoryDisbaled;
    this.showRecordUpdateButton = this.showRecordUpdateEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canStartAssignment && !this.canReviewCompleteAssignment; 
  }

  private getConfirmationMessageForFormsDirty(allFlags: boolean = true, flagList: string[] = null) {
    let confirmationMessage: string = '';
    let messageList: string[] = [];
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            if (this.isRecordUpdateFormDirty) {
              messageList.push('You have unsaved changes on the Update form.');
            }
            break;
          }
        }
      });
    }
    if (CommonUtilityFunctions.checkNonEmptyList(messageList)) {
      messageList.push('Do you still want to continue');
      messageList.forEach((message) => {
        confirmationMessage += message + '\n';
      });      
    }
    return confirmationMessage;
  }

  private isFlagListDirty(allFlags: boolean = true, flagList: string[] = null) {
    let resultantFlagValue: boolean = false;
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            resultantFlagValue = resultantFlagValue || this.isRecordUpdateFormDirty;
            break;
          }
        }
      });
    }
    return resultantFlagValue;
  }

  private setFlagListNotDirty(allFlags: boolean = true, flagList: string[] = null) {
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            this.isRecordUpdateFormDirty = false;
            break;
          }
        }
      });
    }
  }

  private setFlagListDirty(allFlags: boolean = true, flagList: string[] = null) {
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            this.isRecordUpdateFormDirty = true;
            break;
          }
        }
      });
    }
  }
  
  private getPackageAssignmentGridRecord(packageAssignmentSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: packageAssignmentSerialId
    };    
    this.utilityService.makerequest(this, this.onGetPackageAssignmentGridRecord, LcpRestUrls.get_package_assignment_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetPackageAssignmentGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['packageAssignmentFormEditMandatoryDisbaled'];
      context.canStartAssignment = gridRecordObject.additionalProperties['packageAssignmentCanStartAssignment'];
      context.canReviewCompleteAssignment = gridRecordObject.additionalProperties['packageAssignmentCanReviewCompleteAssignment'];
      context.setUpDataModal(gridRecordObject.record);
    } else {
      context.helperService.showAlertDialog({
        isSuccess: false,
        message: gridRecordObject.errorMessage,
        onButtonClicked: () => {
        }
      });
      context.hideRecordUpdateFormLoaderMask();
    }
  }
  
  private setUpDataModal(packageAssignmentGridRecord: GridRecord) {
    this.packageAssignmentRecord.setValuesFromGridRecord(packageAssignmentGridRecord);
    this.packageAssignmentSerialId = this.packageAssignmentRecord.packageAssignmentSerialId;
    this.packageAssignmentCreatedDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.packageAssignmentRecord.createdMillis);
    this.packageAssignmentStartDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.packageAssignmentRecord.startDateMillis);
    this.packageAssignmentEndDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.packageAssignmentRecord.endDateMillis);
    this.packageAssignmentActionDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.packageAssignmentRecord.actionDateMillis);
    this.packageAssignmentRecordLastUpdatedDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.packageAssignmentRecord.recordLastUpdatedMillis);
    this.selectedIsCustomerGrievedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.packageAssignmentRecord.isCustomerGrieved);
    this.selectedCustomerHappinessIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.packageAssignmentRecord.customerHappinessIndex);
    this.selectedIsTutorGrievedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.packageAssignmentRecord.isTutorGrieved);
    this.selectedTutorHappinessIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.packageAssignmentRecord.tutorHappinessIndex);
    CommonUtilityFunctions.setHTMLInputElementValue('customerRemarks', this.packageAssignmentRecord.customerRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorRemarks', this.packageAssignmentRecord.tutorRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('adminRemarks', this.packageAssignmentRecord.adminRemarks);
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  updatePackageAssignmentProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_UPDATE']);
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.subscriptionPackageAssignmentUpdatedRecord, this.packageAssignmentRecord, deselected, isAllOPeration);
  }

  updatePackageAssignmentRecord() {
    this.showRecordUpdateFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.subscriptionPackageAssignmentUpdatedRecord, this.packageAssignmentSerialId);
    this.utilityService.makerequest(this, this.onUpdatePackageAssignmentRecord, LcpRestUrls.subscription_package_assignment_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdatePackageAssignmentRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty();
      context.getPackageAssignmentGridRecord(context.packageAssignmentSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  takeActionOnPackageAssignment(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    if (!this.isFlagListDirty()) {      
      this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired);
        },
        onCancel: () => {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Action Aborted',
            onButtonClicked: () => {
            }
          });
        }
      });
    }    
  }

  private takeActionPrompt(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => { 
        this.showRecordUpdateFormLoaderMask();
        this.setFlagListNotDirty();                 
        const data = {
          allIdsList: this.packageAssignmentSerialId,
          button: actionText,
          comments: message
        };                     
        this.utilityService.makerequest(this, this.handleTakeActionOnPackageAssignmentRecord,
          LcpRestUrls.take_action_on_subscription_package_assignment, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnPackageAssignmentRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.getPackageAssignmentGridRecord(context.packageAssignmentSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  resetPackageAssignmentRecord() {
    if (!this.isFlagListDirty()) {
      this.getPackageAssignmentGridRecord(this.packageAssignmentSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getPackageAssignmentGridRecord(this.packageAssignmentSerialId);
        },
        onCancel: () => {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Action Aborted',
            onButtonClicked: () => {
            }
          });
        }
      });
    }    
  }
}