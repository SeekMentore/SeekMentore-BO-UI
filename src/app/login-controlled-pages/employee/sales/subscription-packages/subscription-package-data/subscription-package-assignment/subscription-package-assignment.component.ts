import { Component, Input, OnInit } from '@angular/core';
import { PackageAssignment } from 'src/app/model/package-assignment';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { SubscriptionPackageAssignmentDataAccess } from '../subscription-package-data.component';

@Component({
  selector: 'app-subscription-package-assignment',
  templateUrl: './subscription-package-assignment.component.html',
  styleUrls: ['./subscription-package-assignment.component.css']
})
export class SubscriptionPackageAssignmentComponent implements OnInit {

  @Input()
  packageAssignmentSerialId: string = null;

  @Input()
  subscriptionPackageAssignmentDataAccess: SubscriptionPackageAssignmentDataAccess = null;  

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

  isFormDirty: boolean = false;
  packageAssignmentFormMaskLoaderHidden: boolean = true;
  showForm: boolean = false;
  showEditControlSection: boolean = false;
  showUpdateButton: boolean = false;  
  canStartAssignment: boolean = false;
  canReviewCompleteAssignment: boolean = false;

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

  private showFormLoaderMask() {
    this.packageAssignmentFormMaskLoaderHidden = false;
  }

  private hideFormLoaderMask() {
    this.packageAssignmentFormMaskLoaderHidden = true;
  }

  private setSectionShowParams() {
    this.showForm = this.subscriptionPackageAssignmentDataAccess.subscriptionPackageAssignmentDataModificationAccess;
    this.showEditControlSection = this.subscriptionPackageAssignmentDataAccess.subscriptionPackageAssignmentDataModificationAccess && !this.formEditMandatoryDisbaled;
    this.showUpdateButton = this.showEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canStartAssignment && !this.canReviewCompleteAssignment; 
  }

  public setFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }
  
  private getPackageAssignmentGridRecord(packageAssignmentSerialId: string) {
    this.showFormLoaderMask();
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
      this.hideFormLoaderMask();
    }, 500);
  }

  updateSubscriptionPackageAssignmentProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.isFormDirty = true;
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.subscriptionPackageAssignmentUpdatedRecord, this.packageAssignmentRecord, deselected, isAllOPeration);
  }

  updateSubscriptionPackageAssignmentRecord() {
    this.showFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.subscriptionPackageAssignmentUpdatedRecord, this.packageAssignmentRecord.packageAssignmentSerialId);
    this.utilityService.makerequest(this, this.onUpdateSubscriptionPackageAssignmentRecord, LcpRestUrls.subscription_package_assignment_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateSubscriptionPackageAssignmentRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.isFormDirty = false;
      context.getPackageAssignmentGridRecord(context.packageAssignmentSerialId);
    } else {
      context.hideFormLoaderMask();
    }
  }

  takeActionOnSubscriptionPackageAssignment(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    if (!this.isFormDirty) {      
      this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired);
    } else {
      this.helperService.showConfirmationDialog({
        message: 'You have unsaved changes on the form do you still want to continue.',
        onOk: () => {
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
        this.showFormLoaderMask();
        this.isFormDirty = false;                  
        const data = {
          allIdsList: this.packageAssignmentRecord.packageAssignmentSerialId,
          button: actionText,
          comments: message
        };                     
        this.utilityService.makerequest(this, this.handleTakeActionOnSubscriptionPackageAssignmentRecord,
          LcpRestUrls.take_action_on_subscription_package_assignment, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnSubscriptionPackageAssignmentRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.getPackageAssignmentGridRecord(context.packageAssignmentSerialId);
    } else {
      context.hideFormLoaderMask();
    }
  }
}