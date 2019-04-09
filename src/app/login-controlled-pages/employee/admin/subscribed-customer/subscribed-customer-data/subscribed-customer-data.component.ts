import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscribedCustomer } from 'src/app/model/subscribed-customer';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { SubscribedCustomerDataAccess } from '../subscribed-customer.component';

@Component({
  selector: 'app-subscribed-customer-data',
  templateUrl: './subscribed-customer-data.component.html',
  styleUrls: ['./subscribed-customer-data.component.css']
})
export class SubscribedCustomerDataComponent implements OnInit {

  @ViewChild('currentPackagesGrid')
  currentPackagesGridObject: GridComponent;
  currentPackagesGridMetaData: GridDataInterface;

  @ViewChild('historyPackagesGrid')
  historyPackagesGridObject: GridComponent;
  historyPackagesGridMetaData: GridDataInterface;

  @Input()
  customerSerialId: string = null;

  @Input()
  subscribedCustomerDataAccess: SubscribedCustomerDataAccess = null;

  customerUpdatedData = {};

  formEditMandatoryDisbaled = true;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;

  isRecordUpdateFormDirty: boolean = false;
  subscribeedCustomerUpdateFormMaskLoaderHidden: boolean = true;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  showRecordUpdateButton: boolean = false; 

  // Modal Properties
  customerRecord: SubscribedCustomer;
  recordLastUpdatedDateAndTimeDisplay: string;
  selectedLocationOption: any[] = [];
  selectedGradesOptions: any[] = [];
  selectedSubjectOptions: any[] = [];

  dirtyFlagList: string[] = ['RECORD_UPDATE'];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.currentPackagesGridMetaData = null;
    this.historyPackagesGridMetaData = null;
    this.customerRecord = new SubscribedCustomer();
  }

  ngOnInit() {
    this.getSubscribedCustomerGridRecord(this.customerSerialId);
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.currentPackagesGridObject.init();
      this.currentPackagesGridObject.addExtraParams('customerSerialId', this.customerSerialId);
      this.historyPackagesGridObject.init();
      this.historyPackagesGridObject.addExtraParams('customerSerialId', this.customerSerialId);
    }, 100);
    setTimeout(() => {
      this.currentPackagesGridObject.refreshGridData();
      this.historyPackagesGridObject.refreshGridData();
    }, 100);
  }

  private showRecordUpdateFormLoaderMask() {
    this.subscribeedCustomerUpdateFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.subscribeedCustomerUpdateFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.subscribedCustomerDataAccess.subscribedCustomerRecordUpdateAccess;
    this.showRecordUpdateEditControlSection = this.showRecordUpdateForm && !this.formEditMandatoryDisbaled;
    this.showRecordUpdateButton = this.showRecordUpdateEditControlSection && this.editRecordForm;
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

  private getSubscribedCustomerGridRecord(customerSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: customerSerialId
    };    
    this.utilityService.makerequest(this, this.onSubscribedCustomerGridRecord, LcpRestUrls.get_subscribed_customer_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onSubscribedCustomerGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['subscribedCustomerFormEditMandatoryDisbaled'];
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

  private setUpDataModal(subscribedCustomerGridRecord: GridRecord) {
    this.customerRecord.setValuesFromGridRecord(subscribedCustomerGridRecord);
    this.customerSerialId = this.customerRecord.customerSerialId;
    this.recordLastUpdatedDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.customerRecord.recordLastUpdatedMillis);
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.customerRecord.location);
    this.selectedGradesOptions = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.customerRecord.studentGrades);
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.customerRecord.interestedSubjects);
    CommonUtilityFunctions.setHTMLInputElementValue('customerName', this.customerRecord.name);
    CommonUtilityFunctions.setHTMLInputElementValue('addressDetails', this.customerRecord.addressDetails);
    CommonUtilityFunctions.setHTMLInputElementValue('additionalDetails', this.customerRecord.additionalDetails);
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  public getSubscriptionPackageGridObject(id: string, title: string, restURL: string, collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'subscriptionPackageSerialId',
        headerName: 'Subscription Package Serial Id',
        dataType: 'string',
        mapping: 'subscriptionPackageSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Subscription');
        }
      },{
        id: 'tutorName',
        headerName: 'Tutor Name',
        dataType: 'string',
        mapping: 'tutorName'
      },{
        id: 'tutorEmail',
        headerName: 'Tutor Email',
        dataType: 'string',
        mapping: 'tutorEmail'
      },{
        id: 'tutorContactNumber',
        headerName: 'Tutor Contact Number',
        dataType: 'string',
        mapping: 'tutorContactNumber'
      },{
        id: 'createdMillis',
        headerName: 'Created Date',
        dataType: 'date',
        mapping: 'createdMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      },{
        id: 'totalHours',
        headerName: 'Total Hours',
        dataType: 'number',
        mapping: 'totalHours'
      },{
        id: 'startDateMillis',
        headerName: 'Start Date',
        dataType: 'date',
        mapping: 'startDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
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
        id: 'enquirySubject',
        headerName: 'Enquiry Subject',
        dataType: 'list',
        filterOptions: CommonFilterOptions.subjectsFilterOptions,
        mapping: 'enquirySubject',
        renderer: AdminCommonFunctions.subjectsRenderer
      },{
        id: 'enquiryGrade',
        headerName: 'Enquiry Grade',
        dataType: 'list',
        filterOptions: CommonFilterOptions.studentGradesFilterOptions,
        mapping: 'enquiryGrade',
        renderer: AdminCommonFunctions.studentGradesRenderer
      },{
        id: 'enquiryLocation',
        headerName: 'Enquiry Location',
        dataType: 'list',
        filterOptions: CommonFilterOptions.locationsFilterOptions,
        mapping: 'enquiryLocation',
        renderer: AdminCommonFunctions.locationsRenderer
      },{
        id: 'enquiryAddressDetails',
        headerName: 'Enquiry Address Details',
        dataType: 'string',
        mapping: 'enquiryAddressDetails',
        lengthyData: true
      },{
        id: 'enquiryAdditionalDetails',
        headerName: 'Enquiry Additional Details',
        dataType: 'string',
        mapping: 'enquiryAdditionalDetails',
        lengthyData: true
      },{
        id: 'enquiryPreferredTeachingType',
        headerName: 'Enquiry Preferred Teaching Type',
        dataType: 'list',
        filterOptions: CommonFilterOptions.preferredTeachingTypeFilterOptions,
        mapping: 'enquiryPreferredTeachingType',
        multiList: true,
        renderer: AdminCommonFunctions.preferredTeachingTypeMultiRenderer
      },{
        id: 'enquiryQuotedClientRate',
        headerName: 'Enquiry Quoted Client Rate',
        dataType: 'number',
        mapping: 'enquiryQuotedClientRate'
      },{
        id: 'enquiryNegotiatedRateWithClient',
        headerName: 'Enquiry Negotiated Rate With Client',
        dataType: 'number',
        mapping: 'enquiryNegotiatedRateWithClient'
      },{
        id: 'enquiryClientNegotiationRemarks',
        headerName: 'Enquiry Client Negotiation Remarks',
        dataType: 'string',
        mapping: 'enquiryClientNegotiationRemarks',
        lengthyData: true
      },{
        id: 'tutorMapperQuotedTutorRate',
        headerName: 'Tutor Mapper Quoted Tutor Rate',
        dataType: 'number',
        mapping: 'tutorMapperQuotedTutorRate'
      },{
        id: 'tutorMapperNegotiatedRateWithTutor',
        headerName: 'Tutor Mapper Negotiated Rate With Tutor',
        dataType: 'number',
        mapping: 'tutorMapperNegotiatedRateWithTutor'
      },{
        id: 'tutorMapperTutorNegotiationRemarks',
        headerName: 'Tutor Mapper Tutor Negotiation Remarks',
        dataType: 'string',
        mapping: 'tutorMapperTutorNegotiationRemarks',
        lengthyData: true
      },{
        id: 'demoClientRemarks',
        headerName: 'Demo Client Remarks',
        dataType: 'string',
        mapping: 'demoClientRemarks',
        lengthyData: true
      },{
        id: 'demoTutorRemarks',
        headerName: 'Demo Tutor Remarks',
        dataType: 'string',
        mapping: 'demoTutorRemarks',
        lengthyData: true
      },{
        id: 'demoClientSatisfiedFromTutor',
        headerName: 'Demo Client Satisfied From Tutor',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoClientSatisfiedFromTutor',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoTutorSatisfiedWithClient',
        headerName: 'Demo Tutor Satisfied With Client',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoTutorSatisfiedWithClient',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoAdminSatisfiedFromTutor',
        headerName: 'Demo Admin Satisfied From Tutor',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoAdminSatisfiedFromTutor',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoAdminSatisfiedWithClient',
        headerName: 'Demo Admin Satisfied With Client',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoAdminSatisfiedWithClient',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoNeedPriceNegotiationWithClient',
        headerName: 'Demo Need Price Negotiation With Client',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoNeedPriceNegotiationWithClient',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoNegotiatedOverrideRateWithClient',
        headerName: 'Demo Negotiated Override Rate With Client',
        dataType: 'number',
        mapping: 'demoNegotiatedOverrideRateWithClient'
      },{
        id: 'demoClientNegotiationRemarks',
        headerName: 'Demo Client Negotiation Remarks',
        dataType: 'string',
        mapping: 'demoClientNegotiationRemarks',
        lengthyData: true
      },{
        id: 'demoNeedPriceNegotiationWithTutor',
        headerName: 'Demo Need Price Negotiation With Tutor',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoNeedPriceNegotiationWithTutor',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoNegotiatedOverrideRateWithTutor',
        headerName: 'Demo Negotiated Override Rate With Tutor',
        dataType: 'number',
        mapping: 'demoNegotiatedOverrideRateWithTutor'
      },{
        id: 'demoTutorNegotiationRemarks',
        headerName: 'Demo Tutor Negotiation Remarks',
        dataType: 'string',
        mapping: 'demoTutorNegotiationRemarks',
        lengthyData: true
      },{
        id: 'demoAdminRemarks',
        headerName: 'Demo Admin Remarks',
        dataType: 'string',
        mapping: 'demoAdminRemarks',
        lengthyData: true
      },{
        id: 'demoAdminFinalizingRemarks',
        headerName: 'Demo Admin Finalizing Remarks',
        dataType: 'string',
        mapping: 'demoAdminFinalizingRemarks',
        lengthyData: true
      }]
    };
    return grid;
  }

  public setUpGridMetaData() {
    this.currentPackagesGridMetaData = {
      grid: this.getSubscriptionPackageGridObject('currentPackagesGrid', 'Current Packages', '/rest/subscribedCustomer/currentSubscriptionPackageList', true),
      htmlDomElementId: 'current-packages-grid',
      hidden: false,
    };

    this.historyPackagesGridMetaData = {
      grid: this.getSubscriptionPackageGridObject('historyPackagesGrid', 'History Packages', '/rest/subscribedCustomer/historySubscriptionPackageList', true),
      htmlDomElementId: 'history-packages-grid',
      hidden: false
    };
  }

  updateSubscribedCustomerProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_UPDATE']);
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.customerUpdatedData, this.customerRecord, deselected, isAllOPeration);
  }

  updateSubscribedCustomerRecord() {
    this.showRecordUpdateFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.customerUpdatedData, this.customerSerialId);
    this.utilityService.makerequest(this, this.onUpdateCustomerRecord, LcpRestUrls.customer_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateCustomerRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty(false, ['RECORD_UPDATE']);
      context.getSubscribedCustomerGridRecord(context.customerSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  resetSubscribedCustomerRecord() {
    if (!this.isFlagListDirty()) {
      this.getSubscribedCustomerGridRecord(this.customerSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getSubscribedCustomerGridRecord(this.customerSerialId);
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

  downloadProfile() {
    this.showRecordUpdateFormLoaderMask();
    const customerSerialId: HTMLInputElement = <HTMLInputElement>document.getElementById('profileDownload-customerSerialId');
    customerSerialId.value = this.customerRecord.customerSerialId;
    this.utilityService.submitForm('profileDownloadForm', '/rest/subscribedCustomer/downloadAdminSubscribedCustomerProfilePdf', 'POST');
    setTimeout(() => {
      this.hideRecordUpdateFormLoaderMask();
    }, 4000);
  }
}
