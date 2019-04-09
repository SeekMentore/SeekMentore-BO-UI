import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionPackage } from 'src/app/model/subscription-package';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { SubscriptionPackageDataAccess } from '../subscription-packages.component';

@Component({
  selector: 'app-subscription-package-data',
  templateUrl: './subscription-package-data.component.html',
  styleUrls: ['./subscription-package-data.component.css']
})
export class SubscriptionPackageDataComponent implements OnInit {

  @ViewChild('selectedSubscriptionPackageAllCurrentAssignmentGrid')
  selectedSubscriptionPackageAllCurrentAssignmentGridObject: GridComponent;
  selectedSubscriptionPackageAllCurrentAssignmentGridMetaData: GridDataInterface;

  @ViewChild('selectedSubscriptionPackageAllHistoryAssignmentGrid')
  selectedSubscriptionPackageAllHistoryAssignmentGridObject: GridComponent;
  selectedSubscriptionPackageAllHistoryAssignmentGridMetaData: GridDataInterface;

  @Input()
  subscriptionPackageSerialId: string = null;

  @Input()
  subscriptionPackageDataAccess: SubscriptionPackageDataAccess = null;

  subscriptionPackageUpdatedRecord = {};

  showCustomerDetails = false;
  showEnquiryDetails = false;
  showTutorDetails = false;
  showTutorMapperDetails = false;
  showDemoDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  editRecordForm = false;

  isContractReady = false;

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
  subscriptionPackageFormMaskLoaderHidden: boolean = true;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  showRecordUpdateButton: boolean = false;  
  canActivateSubscription: boolean = false;
  canTerminateSubscription: boolean = false;
  canCreateAssignment: boolean = false;
  takeActionActionText: string;

  dirtyFlagList: string[] = ['RECORD_UPDATE'];

  // Modal Variables
  subscriptionPackageRecord: SubscriptionPackage;
  subscriptionPackageCreatedDisplayTime: string;
  subscriptionPackageStartDateDisplayTime: string;
  subscriptionPackageEndDateDisplayTime: string;
  subscriptionPackageActionDateDisplayTime: string;
  subscriptionPackageRecordLastUpdatedDateDisplayTime: string;
  enquirySubjectLookupRendererFromValue: string;
  enquiryGradeLookupRendererFromValue: string;
  enquiryPreferredTeachingTypeLookupRendererFromValue: string;
  enquiryLocationLookupRendererFromValue: string;
  demoClientSatisfiedFromTutorLookupRendererFromValue: string;
  demoTutorSatisfiedWithClientLookupRendererFromValue: string;
  demoAdminSatisfiedFromTutorLookupRendererFromValue: string;
  demoAdminSatisfiedWithClientLookupRendererFromValue: string;
  demoNeedPriceNegotiationWithClientLookupRendererFromValue: string;
  demoNeedPriceNegotiationWithTutorLookupRendererFromValue: string;
  selectedPackageBillingTypeOptions: any[] = [];
  selectedIsCustomerGrievedOptions: any[] = [];
  selectedCustomerHappinessIndexOptions: any[] = [];
  selectedIsTutorGrievedOptions: any[] = [];
  selectedTutorHappinessIndexOptions: any[] = [];

  // Package Assignment Form Control Variables
  selectedAssignmentRecordSerialId: string = null;
  interimHoldSelectedAssignmentRecordSerialId: string = null;
  packageAssignmentDataAccess: PackageAssignmentDataAccess = null;
  showSubscriptionPackageAssignmentData = false;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.selectedSubscriptionPackageAllCurrentAssignmentGridMetaData = null;
    this.selectedSubscriptionPackageAllHistoryAssignmentGridMetaData = null;
    this.subscriptionPackageRecord = new SubscriptionPackage();
  }

  ngOnInit() {
    this.setUpGridMetaData();
    this.getSubscriptionPackageGridRecord(this.subscriptionPackageSerialId);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.selectedSubscriptionPackageAllCurrentAssignmentGridObject.init();
      this.selectedSubscriptionPackageAllCurrentAssignmentGridObject.addExtraParams('subscriptionPackageSerialId', this.subscriptionPackageSerialId);
      this.selectedSubscriptionPackageAllHistoryAssignmentGridObject.init();
      this.selectedSubscriptionPackageAllHistoryAssignmentGridObject.addExtraParams('subscriptionPackageSerialId', this.subscriptionPackageSerialId);
    }, 100);
    setTimeout(() => {
      this.selectedSubscriptionPackageAllCurrentAssignmentGridObject.refreshGridData();
      this.selectedSubscriptionPackageAllHistoryAssignmentGridObject.refreshGridData();
    }, 100);
  }

  private showRecordUpdateFormLoaderMask() {
    this.subscriptionPackageFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.subscriptionPackageFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.subscriptionPackageDataAccess.subscriptionPackageDataModificationAccess;
    this.showRecordUpdateEditControlSection = this.showRecordUpdateForm && !this.formEditMandatoryDisbaled;
    this.showRecordUpdateButton = this.showRecordUpdateEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canActivateSubscription && !this.canTerminateSubscription && !this.canCreateAssignment;
    this.isContractReady = CommonUtilityFunctions.checkStringAvailability(this.subscriptionPackageRecord.contractSerialId);
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
  
  private getSubscriptionPackageGridRecord(subscriptionPackageSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: subscriptionPackageSerialId
    };    
    this.utilityService.makerequest(this, this.onGetSubscriptionPackageGridRecord, LcpRestUrls.get_subscription_package_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetSubscriptionPackageGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['subscriptionPackageFormEditMandatoryDisbaled'];
      context.canActivateSubscription = gridRecordObject.additionalProperties['subscriptionPackageCanActivateSubscription'];
      context.canTerminateSubscription = gridRecordObject.additionalProperties['subscriptionPackageCanTerminateSubscription'];
      context.canCreateAssignment = gridRecordObject.additionalProperties['subscriptionPackageCanCreateAssignment'];
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

  private setUpDataModal(subscriptionPackageGridRecord: GridRecord) {
    this.subscriptionPackageRecord.setValuesFromGridRecord(subscriptionPackageGridRecord);
    this.subscriptionPackageSerialId = this.subscriptionPackageRecord.subscriptionPackageSerialId;
    this.subscriptionPackageCreatedDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.subscriptionPackageRecord.createdMillis);
    this.subscriptionPackageStartDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.subscriptionPackageRecord.startDateMillis);
    this.subscriptionPackageEndDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.subscriptionPackageRecord.endDateMillis);
    this.subscriptionPackageActionDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.subscriptionPackageRecord.actionDateMillis);
    this.subscriptionPackageRecordLastUpdatedDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.subscriptionPackageRecord.recordLastUpdatedMillis);
    this.enquirySubjectLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.enquirySubject, this.subjectsFilterOptions);
    this.enquiryGradeLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.enquiryGrade, this.studentGradesFilterOptions);
    this.enquiryPreferredTeachingTypeLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.enquiryPreferredTeachingType, this.preferredTeachingTypeFilterOptions);
    this.enquiryLocationLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.enquiryLocation, this.locationsFilterOptions);
    this.demoClientSatisfiedFromTutorLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.demoClientSatisfiedFromTutor, this.yesNoFilterOptions);
    this.demoTutorSatisfiedWithClientLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.demoTutorSatisfiedWithClient, this.yesNoFilterOptions);
    this.demoAdminSatisfiedFromTutorLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.demoAdminSatisfiedFromTutor, this.yesNoFilterOptions);
    this.demoAdminSatisfiedWithClientLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.demoAdminSatisfiedWithClient, this.yesNoFilterOptions);
    this.demoNeedPriceNegotiationWithClientLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.demoNeedPriceNegotiationWithClient, this.yesNoFilterOptions);
    this.demoNeedPriceNegotiationWithTutorLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.subscriptionPackageRecord.demoNeedPriceNegotiationWithTutor, this.yesNoFilterOptions);
    this.selectedPackageBillingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.packageBillingTypeFilterOptions, this.subscriptionPackageRecord.packageBillingType);
    this.selectedIsCustomerGrievedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.subscriptionPackageRecord.isCustomerGrieved);
    this.selectedCustomerHappinessIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.subscriptionPackageRecord.customerHappinessIndex);
    this.selectedIsTutorGrievedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.subscriptionPackageRecord.isTutorGrieved);
    this.selectedTutorHappinessIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.subscriptionPackageRecord.tutorHappinessIndex);
    CommonUtilityFunctions.setHTMLInputElementValue('activatingRemarks', this.subscriptionPackageRecord.activatingRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('additionalDetailsClient', this.subscriptionPackageRecord.additionalDetailsClient);
    CommonUtilityFunctions.setHTMLInputElementValue('additionalDetailsTutor', this.subscriptionPackageRecord.additionalDetailsTutor);
    CommonUtilityFunctions.setHTMLInputElementValue('terminatingRemarks', this.subscriptionPackageRecord.terminatingRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('customerRemarks', this.subscriptionPackageRecord.customerRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorRemarks', this.subscriptionPackageRecord.tutorRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('adminRemarks', this.subscriptionPackageRecord.adminRemarks);
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }  

  handleDataAccessRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.packageAssignmentDataAccess = {
        success: response.success,
        message: response.message,
        packageAssignmentDataModificationAccess: response.packageAssignmentDataModificationAccess
      };
      context.selectedAssignmentRecordSerialId = context.interimHoldSelectedAssignmentRecordSerialId;
      context.toggleVisibilitySubscriptionPackageAssignmentGrid();
    }
  }

  toggleVisibilitySubscriptionPackageAssignmentGrid() {
    if (this.showSubscriptionPackageAssignmentData === true) {
      this.showSubscriptionPackageAssignmentData = false;
      this.selectedAssignmentRecordSerialId = null;
      const backToSubscriptionPackageListingButton: HTMLElement = document.getElementById('back-to-subscription-packages-listing-button'); 
      backToSubscriptionPackageListingButton.classList.remove('noscreen');
      setTimeout(() => {
        this.selectedSubscriptionPackageAllCurrentAssignmentGridObject.init();
        this.selectedSubscriptionPackageAllCurrentAssignmentGridObject.addExtraParams('subscriptionPackageSerialId', this.subscriptionPackageSerialId);
        this.selectedSubscriptionPackageAllHistoryAssignmentGridObject.init();
        this.selectedSubscriptionPackageAllHistoryAssignmentGridObject.addExtraParams('subscriptionPackageSerialId', this.subscriptionPackageSerialId);
      }, 100);   
      setTimeout(() => {
        this.selectedSubscriptionPackageAllCurrentAssignmentGridObject.refreshGridData();
        this.selectedSubscriptionPackageAllHistoryAssignmentGridObject.refreshGridData();
      }, 100);
      this.getSubscriptionPackageGridRecord(this.subscriptionPackageSerialId);
    } else {
      const backToSubscriptionPackageListingButton: HTMLElement = document.getElementById('back-to-subscription-packages-listing-button'); 
      backToSubscriptionPackageListingButton.classList.add('noscreen');     
      this.showSubscriptionPackageAssignmentData = true;
    }
  }

  private naviagteToPackageAssignmentFormAction(record: GridRecord, column: Column, gridComponentObject: GridComponent) {
    this.interimHoldSelectedAssignmentRecordSerialId = record.getProperty('packageAssignmentSerialId');
    if (this.packageAssignmentDataAccess === null) {
      this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.subscription_package_assignment_data_access, 'POST', null, 'application/x-www-form-urlencoded');
    } else {
      this.selectedAssignmentRecordSerialId = this.interimHoldSelectedAssignmentRecordSerialId;            
      this.toggleVisibilitySubscriptionPackageAssignmentGrid();
    }
  }

  public getPackageAssignmentGridObject(id: string, title: string, restURL: string, collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'packageAssignmentSerialId',
        headerName: 'Package Assignment Serial Id',
        dataType: 'string',
        mapping: 'packageAssignmentSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          if (!this.isFlagListDirty()) {      
            this.naviagteToPackageAssignmentFormAction(record, column, gridComponentObject);
          } else {
            this.helperService.showConfirmationDialog({
              message: this.getConfirmationMessageForFormsDirty(),
              onOk: () => {
                this.setFlagListNotDirty();
                this.naviagteToPackageAssignmentFormAction(record, column, gridComponentObject);
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
      },{
        id: 'startDateMillis',
        headerName: 'Start Date',
        dataType: 'date',
        mapping: 'startDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
      },{
        id: 'totalHours',
        headerName: 'Total Hours',
        dataType: 'number',
        mapping: 'totalHours'
      },{
        id: 'completedHours',
        headerName: 'Completed Hours',
        dataType: 'number',
        mapping: 'completedHours'
      },{
        id: 'completedMinutes',
        headerName: 'Completed Minutes',
        dataType: 'number',
        mapping: 'completedMinutes'
      },{
        id: 'endDateMillis',
        headerName: 'End Date',
        dataType: 'date',
        mapping: 'endDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
      },{
        id: 'createdMillis',
        headerName: 'Created Date',
        dataType: 'date',
        mapping: 'createdMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      }]
    };
    return grid;
  }

  public setUpGridMetaData() {
    this.selectedSubscriptionPackageAllCurrentAssignmentGridMetaData = {
      grid: this.getPackageAssignmentGridObject('selectedSubscriptionPackageAllCurrentAssignmentGrid', 'Current Assignments', '/rest/sales/selectedSubscriptionPackageCurrentAssignmentList'),
      htmlDomElementId: 'selected-subscription-package-all-current-assignment-grid',
      hidden: false
    };

    this.selectedSubscriptionPackageAllHistoryAssignmentGridMetaData = {
      grid: this.getPackageAssignmentGridObject('selectedSubscriptionPackageAllHistoryAssignmentGrid', 'History Assignments', 
                                                '/rest/sales/selectedSubscriptionPackageHistoryAssignmentList', true),
      htmlDomElementId: 'selected-subscription-package-all-history-assignment-grid',
      hidden: false
    };
  }

  updateSubscriptionPackageProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_UPDATE']);
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.subscriptionPackageUpdatedRecord, this.subscriptionPackageRecord, deselected, isAllOPeration);
  }

  updateSubscriptionPackageRecord() {
    this.showRecordUpdateFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.subscriptionPackageUpdatedRecord, this.subscriptionPackageSerialId);
    this.utilityService.makerequest(this, this.onUpdateSubscriptionPackageRecord, LcpRestUrls.subscription_package_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateSubscriptionPackageRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty();
      context.getSubscriptionPackageGridRecord(context.subscriptionPackageSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  takeActionOnSubscriptionPackage(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
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
        this.takeActionActionText = actionText;             
        const data = {
          allIdsList: this.subscriptionPackageSerialId,
          button: actionText,
          comments: message
        };
        this.utilityService.makerequest(this, this.handleTakeActionOnSubscriptionPackageRecord,
          LcpRestUrls.take_action_on_subscription_package, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnSubscriptionPackageRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.getSubscriptionPackageGridRecord(context.subscriptionPackageSerialId);
      if (context.takeActionActionText === 'createAssignment') {
        context.selectedSubscriptionPackageAllCurrentAssignmentGridObject.refreshGridData();
      }
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  downloadContract() {
    if (this.isContractReady) {
      this.showRecordUpdateFormLoaderMask();
      const subscriptionPackageSerialId: HTMLInputElement = <HTMLInputElement>document.getElementById('contractDownloadForm-subscriptionPackageSerialId');
      subscriptionPackageSerialId.value = this.subscriptionPackageSerialId;
      this.utilityService.submitForm('contractDownloadForm', '/rest/sales/downloadSubscriptionPackageContractPdf', 'POST');
      setTimeout(() => {
        this.hideRecordUpdateFormLoaderMask();
      }, 5000);
    } else {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: 'Contract is still not initiated for this Subscription Package',
        onButtonClicked: () => {
        }
      });
    }
  }

  resetSubscriptionPackageRecord() {
    if (!this.isFlagListDirty()) {
      this.getSubscriptionPackageGridRecord(this.subscriptionPackageSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getSubscriptionPackageGridRecord(this.subscriptionPackageSerialId);
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

export interface PackageAssignmentDataAccess {
  success: boolean;
  message: string;
  packageAssignmentDataModificationAccess: boolean;
}
