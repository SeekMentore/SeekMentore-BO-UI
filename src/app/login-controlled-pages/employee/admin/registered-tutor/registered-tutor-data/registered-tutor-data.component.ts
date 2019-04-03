import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { RegisteredTutorDataAccess } from 'src/app/login-controlled-pages/employee/admin/registered-tutor/registered-tutor.component';
import { RegisteredTutor } from 'src/app/model/registered-tutor';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';

@Component({
  selector: 'app-registered-tutor-data',
  templateUrl: './registered-tutor-data.component.html',
  styleUrls: ['./registered-tutor-data.component.css']
})
export class RegisteredTutorDataComponent implements OnInit, AfterViewInit {

  @ViewChild('uploadedDocumentGrid')
  uploadedDocumentGridObject: GridComponent;
  uploadedDocumentGridMetaData: GridDataInterface;

  @ViewChild('bankDetailGrid')
  bankDetailGridObject: GridComponent;
  bankDetailGridMetaData: GridDataInterface;

  @ViewChild('currentPackagesGrid')
  currentPackagesGridObject: GridComponent;
  currentPackagesGridMetaData: GridDataInterface;

  @ViewChild('historyPackagesGrid')
  historyPackagesGridObject: GridComponent;
  historyPackagesGridMetaData: GridDataInterface;

  @Input()
  tutorSerialId: string = null;

  @Input()
  registeredTutorDataAccess: RegisteredTutorDataAccess = null;

  tutorUpdatedData = {};

  formEditMandatoryDisbaled = true;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
  primaryProfessionFilterOptions = CommonFilterOptions.primaryProfessionFilterOptions;
  transportModeFilterOptions = CommonFilterOptions.transportModeFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  isRecordUpdateFormDirty: boolean = false;
  registeredTutorUpdateFormMaskLoaderHidden: boolean = true;
  documentRemovalAccess: boolean = false;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  showRecordUpdateButton: boolean = false; 

  dirtyFlagList: string[] = ['RECORD_UPDATE'];

  // Modal Properties
  tutorRecord: RegisteredTutor;
  dateOfBirthValue: string;
  recordLastUpdatedDateAndTimeDisplay: string;
  selectedGenderOption: any[] = [];
  selectedQualificationOption: any[] = [];
  selectedProfessionOption: any[] = [];
  selectedTransportOption: any[] = [];
  selectedStudentGrades: any[] = [];
  selectedSubjectOptions: any[] = [];
  selectedLocationOptions: any[] = [];
  selectedTeachingTypeOptions: any[] = []; 
  totalTutorDocumentFiles: number = 0;
  aadharCardFile: any = null;
  aadharCardFileExists: boolean = false;
  panCardFile: any = null;
  panCardFileExists: boolean = false;
  photographFile: any = null;
  photographFileExists: boolean = false;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.uploadedDocumentGridMetaData = null;
    this.bankDetailGridMetaData = null;
    this.currentPackagesGridMetaData = null;
    this.historyPackagesGridMetaData = null;
    this.tutorRecord = new RegisteredTutor();
  }

  ngOnInit() {
    this.getRegisteredTutorGridRecord(this.tutorSerialId);
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.uploadedDocumentGridObject.init();
      this.uploadedDocumentGridObject.addExtraParams('tutorSerialId', this.tutorSerialId);
      this.bankDetailGridObject.init();
      this.bankDetailGridObject.addExtraParams('tutorSerialId', this.tutorSerialId);
      this.currentPackagesGridObject.init();
      this.currentPackagesGridObject.addExtraParams('tutorSerialId', this.tutorSerialId);
      this.historyPackagesGridObject.init();
      this.historyPackagesGridObject.addExtraParams('tutorSerialId', this.tutorSerialId);
    }, 100);
    setTimeout(() => {
      this.uploadedDocumentGridObject.refreshGridData();
      this.bankDetailGridObject.refreshGridData();
      this.currentPackagesGridObject.refreshGridData();
      this.historyPackagesGridObject.refreshGridData();
    }, 100);
  }

  private showRecordUpdateFormLoaderMask() {
    this.registeredTutorUpdateFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.registeredTutorUpdateFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.registeredTutorDataAccess.registeredTutorRecordUpdateAccess;
    this.showRecordUpdateEditControlSection = this.showRecordUpdateForm && !this.formEditMandatoryDisbaled;
    this.documentRemovalAccess = !this.formEditMandatoryDisbaled && this.editRecordForm;
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

  private getRegisteredTutorGridRecord(tutorSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: tutorSerialId
    };    
    this.utilityService.makerequest(this, this.onRegisteredTutorGridRecord, LcpRestUrls.get_registered_tutor_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
    this.getRegisteredTutorDocumentCountAndExistence(tutorSerialId);
  }

  onRegisteredTutorGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['registeredTutorFormEditMandatoryDisbaled'];
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

  private getRegisteredTutorDocumentCountAndExistence(tutorSerialId: string) {    
    const data = {
      tutorSerialId: tutorSerialId
    };    
    this.utilityService.makerequest(this, this.onGetRegisteredTutorDocumentCountAndExistence, LcpRestUrls.get_registered_tutor_document_count_and_existence, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetRegisteredTutorDocumentCountAndExistence(context: any, response: any) {
    CommonUtilityFunctions.logOnConsole(response);
    if (response['success']) {
      let registeredTutorDocumentCountAndExistenceObject = response['recordObject'];
      if (CommonUtilityFunctions.checkObjectAvailability(registeredTutorDocumentCountAndExistenceObject)) {
        context.totalTutorDocumentFiles = registeredTutorDocumentCountAndExistenceObject['TOTAL_FILES'];
        context.aadharCardFileExists = CommonUtilityFunctions.decodeTrueFalseFromYN(registeredTutorDocumentCountAndExistenceObject['AADHAR_CARD_FILE_EXIST']);
        context.panCardFileExists = CommonUtilityFunctions.decodeTrueFalseFromYN(registeredTutorDocumentCountAndExistenceObject['PAN_CARD_FILE_EXIST']);
        context.photographFileExists = CommonUtilityFunctions.decodeTrueFalseFromYN(registeredTutorDocumentCountAndExistenceObject['PHOTOGRAH_FILE_EXIST']);
      }
    } else {
      context.helperService.showAlertDialog({
        isSuccess: false,
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    }
  }

  private setUpDataModal(registeredTutorGridRecord: GridRecord) {
    this.tutorRecord.setValuesFromGridRecord(registeredTutorGridRecord);
    this.tutorSerialId = this.tutorRecord.tutorSerialId;
    this.dateOfBirthValue = CommonUtilityFunctions.getDateForDateInputParam(this.tutorRecord.dateOfBirth);
    this.recordLastUpdatedDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.tutorRecord.recordLastUpdatedMillis);
    this.selectedGenderOption = CommonUtilityFunctions.getSelectedFilterItems(this.genderFilterOptions, this.tutorRecord.gender);
    this.selectedQualificationOption = CommonUtilityFunctions.getSelectedFilterItems(this.qualificationFilterOptions, this.tutorRecord.qualification);
    this.selectedProfessionOption = CommonUtilityFunctions.getSelectedFilterItems(this.primaryProfessionFilterOptions, this.tutorRecord.primaryProfession);
    this.selectedTransportOption = CommonUtilityFunctions.getSelectedFilterItems(this.transportModeFilterOptions, this.tutorRecord.transportMode);
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.tutorRecord.interestedSubjects);
    this.selectedLocationOptions = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.tutorRecord.comfortableLocations);
    this.selectedStudentGrades = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.tutorRecord.interestedStudentGrades);
    this.selectedTeachingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTeachingTypeFilterOptions, this.tutorRecord.preferredTeachingType);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorName', this.tutorRecord.name);
    CommonUtilityFunctions.setHTMLInputElementValue('teachingExp', this.tutorRecord.teachingExp);
    CommonUtilityFunctions.setHTMLInputElementValue('addressDetails', this.tutorRecord.addressDetails);
    CommonUtilityFunctions.setHTMLInputElementValue('additionalDetails', this.tutorRecord.additionalDetails);
    this.detachAllFiles();
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  attachFile(event: any, type: any) {
    if (type === 'aadharCard') {
      this.aadharCardFile = event.target.files[0];
    }
    if (type === 'panCard') {
      this.panCardFile = event.target.files[0];
    }
    if (type === 'photo') {
      this.photographFile = event.target.files[0];
    }
  }

  detachFile(type: any) {
    if (type === 'aadharCard') {
      this.aadharCardFile = null;
    }
    if (type === 'panCard') {
      this.panCardFile = null;
    }
    if (type === 'photo') {
      this.photographFile = null;
    }
  }

  detachAllFiles() {
    this.panCardFile = null;
    this.aadharCardFile = null;
    this.photographFile = null;    
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
        id: 'customerName',
        headerName: 'Customer Name',
        dataType: 'string',
        mapping: 'customerName'
      },{
        id: 'customerEmail',
        headerName: 'Customer Email',
        dataType: 'string',
        mapping: 'customerEmail'
      },{
        id: 'customerContactNumber',
        headerName: 'Customer Contact Number',
        dataType: 'string',
        mapping: 'customerContactNumber'
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
    this.uploadedDocumentGridMetaData = {
      grid: {
        id: 'uploadedDocumentGrid',
        title: 'Uploaded Documents',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/uploadedDocumentList'
        },
        columns: [{
          id: 'documentSerialId',
          headerName: 'Document Serial Id',
          dataType: 'string',
          mapping: 'documentSerialId',
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            gridComponentObject.showGridLoadingMask()
            const documentSerialIdElement: HTMLInputElement = <HTMLInputElement>document.getElementById('tutorDocumentDownloadForm-documentSerialId');
            documentSerialIdElement.value = column.getValueForColumn(record);
            this.utilityService.submitForm('tutorDocumentDownloadForm', '/rest/registeredTutor/downloadTutorDocument', 'POST');
            setTimeout(() => {
              gridComponentObject.hideGridLoadingMask();
            }, 5000);
          }
        },{
          id: 'documentType',
          headerName: 'Document Type',
          dataType: 'list',
          filterOptions: CommonFilterOptions.tutorDocumentTypeFilterOptions,
          mapping: 'documentType',
          renderer: AdminCommonFunctions.tutorDocumentTypeRenderer          
        }, {
          id: 'isApproved',
          headerName: 'Is Approved',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isApproved',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'whoActed',
          headerName: 'Who Acted',
          dataType: 'string',
          mapping: 'whoActedName'
        }, {
          id: 'remarks',
          headerName: 'Remarks',
          dataType: 'string',
          mapping: 'remarks',
          lengthyData: true          
        }, {
          id: 'actionDate',
          headerName: 'Action Date',
          dataType: 'date',
          mapping: 'actionDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        }],
        hasSelectionColumn: false,
        hasActionColumn: this.registeredTutorDataAccess.registeredTutorDocumentTakeActionAccess,
        actionColumn: {
          label: 'Take Action',
          buttons: [{
            id: 'approve',
            label: 'Approve',
            securityMapping: {
              isSecured: true,
              visible: 'showApprove',
              enabled: 'enableApprove'              
            },
            clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject :GridComponent) => {              
              this.takeActionOnGridRecord(
                    LcpRestUrls.tutor_document_grid_approve, 
                    [record],
                    'documentSerialId', 
                    button,
                    gridComponentObject,
                    'Enter comments to Approve Document',
                    'Please provide your comments for approving the document.',
                    false);
            }
          }, {
            id: 'sendReminder',
            label: 'Remind',
            btnclass: 'btnReset',
            securityMapping: {
              isSecured: true,
              visible: 'showSendReminder',
              enabled: 'enableSendReminder'              
            },
            clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject :GridComponent) => {
              this.takeActionOnGridRecord(
                    LcpRestUrls.tutor_document_grid_reminder, 
                    [record],
                    'documentSerialId', 
                    button,
                    gridComponentObject,
                    'Enter comments to Send Reminder for Document',
                    'Please provide your comments for reminding the document.',
                    false,
                    false,
                    true);
            }
          }, {
            id: 'reject',
            label: 'Reject',
            btnclass: 'btnReject',
            securityMapping: {
              isSecured: true,
              visible: 'showReject',
              enabled: 'enableReject'              
            },
            clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject :GridComponent) => {
              this.takeActionOnGridRecord(
                    LcpRestUrls.tutor_document_grid_reject, 
                    [record],
                    'documentSerialId', 
                    button,
                    gridComponentObject,
                    'Enter comments to Reject Document',
                    'Please provide your comments for rejecting the document.');
            }
          }]
        }
      },
      htmlDomElementId: 'uploaded-document-grid',
      hidden: false,
    };

    this.bankDetailGridMetaData = {
      grid: {
        id: 'bankDetailGrid',
        title: 'Bank Details',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/bankDetailList'
        },
        columns: [{
          id: 'bankAccountSerialId',
          headerName: 'Bank Account Serial Id',
          dataType: 'string',
          mapping: 'bankAccountSerialId',
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            alert('Open Bank Account Details');
          }
        }, {
          id: 'bankName',
          headerName: 'Bank Name',
          dataType: 'string',
          mapping: 'bankName'
        }, {
          id: 'accountNumber',
          headerName: 'Account Number',
          dataType: 'string',
          mapping: 'accountNumber'
        }, {
          id: 'ifscCode',
          headerName: 'IFSC Code',
          dataType: 'string',
          mapping: 'ifscCode'
        }, {
          id: 'accountHolderName',
          headerName: 'Account Holder Name',
          dataType: 'string',
          mapping: 'accountHolderName'
        }, {
          id: 'isDefault',
          headerName: 'Is Default',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isDefault',
          renderer: GridCommonFunctions.yesNoRenderer
        }],
        hasSelectionColumn: false,
        hasActionColumn: this.registeredTutorDataAccess.registeredTutorBankDetailTakeActionAccess,
        actionColumn: {
          label: 'Take Action',
          buttons: [{
            id: 'approve',
            label: 'Approve',
            clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject :GridComponent) => {
              this.takeActionOnGridRecord(
                    LcpRestUrls.tutor_bank_grid_approve, 
                    [record],
                    'bankAccountSerialId', 
                    button,
                    gridComponentObject,
                    'Enter comments to Approve Bank Account',
                    'Please provide your comments for approving the account.',
                    false);
            }
          }, {
            id: 'makeDefault',
            label: 'Default',
            btnclass: 'btnReset',
            clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject :GridComponent) => {
              this.takeActionOnGridRecord(
                    LcpRestUrls.tutor_bank_grid_approve, 
                    [record],
                    'bankAccountSerialId', 
                    button,
                    gridComponentObject,
                    'Enter comments to Make Default this Bank Account',
                    'Please provide your comments for making the account Default.');
            }
          }, {
            id: 'reject',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject :GridComponent) => {
              this.takeActionOnGridRecord(
                    LcpRestUrls.tutor_bank_grid_reject, 
                    [record],
                    'bankAccountSerialId', 
                    button,
                    gridComponentObject,
                    'Enter comments to Reject Bank Account',
                    'Please provide your comments for rejecting the account.');
            }
          }]
        }
      },
      htmlDomElementId: 'bank-detail-grid',
      hidden: false,
    };

    this.currentPackagesGridMetaData = {
      grid: this.getSubscriptionPackageGridObject('currentPackagesGrid', 'Current Packages', '/rest/registeredTutor/currentSubscriptionPackageList', true),
      htmlDomElementId: 'current-packages-grid',
      hidden: false,
    };

    this.historyPackagesGridMetaData = {
      grid: this.getSubscriptionPackageGridObject('historyPackagesGrid', 'History Packages', '/rest/registeredTutor/historySubscriptionPackageList', true),
      htmlDomElementId: 'history-packages-grid',
      hidden: false
    };
  }

  takeActionOnGridRecord(
    url: string, 
    selectedRecords: GridRecord[], 
    property: string,
    button: ActionButton, 
    gridComponentObject: GridComponent, 
    commentPopupTitleText: string,
    commentPopupPlaceholderText: string,
    commentsMandatory: boolean = true, 
    multipleRecords: boolean = false,
    showAlertMessageAndDoNotRefreshGrid: boolean = false
  ) {
    if (!this.isFlagListDirty()) {
      this.takeActionOnGridRecordPrompt(url, selectedRecords, property, button, gridComponentObject, commentPopupTitleText, 
                                        commentPopupPlaceholderText, commentsMandatory, multipleRecords, showAlertMessageAndDoNotRefreshGrid);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.takeActionOnGridRecordPrompt(url, selectedRecords, property, button, gridComponentObject, commentPopupTitleText, 
                                          commentPopupPlaceholderText, commentsMandatory, multipleRecords, showAlertMessageAndDoNotRefreshGrid);
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

  private takeActionOnGridRecordPrompt(
    url: string, 
    selectedRecords: GridRecord[], 
    property: string,
    button: ActionButton, 
    gridComponentObject: GridComponent, 
    commentPopupTitleText: string,
    commentPopupPlaceholderText: string,
    commentsMandatory: boolean = true, 
    multipleRecords: boolean = false,
    showAlertMessageAndDoNotRefreshGridAndReloadForm: boolean = false
  ) {
    let selectedIdsList = [];
    if (multipleRecords) {
      selectedIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, property);
    } else {
      selectedIdsList = [selectedRecords[0].getProperty(property)];
    }
    if (selectedIdsList.length > 0) {
      this.helperService.showPromptDialog({
        required: commentsMandatory,
        titleText: commentPopupTitleText,
        placeholderText: commentPopupPlaceholderText,
        onOk: (message) => {
          if (CommonUtilityFunctions.checkObjectAvailability(button)) {
            button.disable();
          }
          if (CommonUtilityFunctions.checkObjectAvailability(gridComponentObject)) {
            gridComponentObject.showGridLoadingMask();
          }
          const data = {
            allIdsList: selectedIdsList.join(';'),
            tutorSerialId: this.tutorRecord.tutorSerialId,
            comments: message
          };
          const extraContextProperties = {
            button: button,
            gridComponentObject: gridComponentObject,
            showAlertMessageAndDoNotRefreshGridAndReloadForm: showAlertMessageAndDoNotRefreshGridAndReloadForm
          }
          this.utilityService.makerequest(this, this.handleTakeActionOnGridRecord, url, 'POST', this.utilityService.urlEncodeData(data), 
                                          'application/x-www-form-urlencoded', false, null, extraContextProperties);
        },
        onCancel: () => {
        }
      });  
    } else {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: LcpConstants.grid_generic_no_record_selected_error,
        onButtonClicked: () => {
        }
      });
    }
  }

  handleTakeActionOnGridRecord(context: any, response: any, extraContextProperties: Object) {
    let button: ActionButton = extraContextProperties['button']; 
    let gridComponentObject: GridComponent = extraContextProperties['gridComponentObject'];   
    let showAlertMessageAndDoNotRefreshGridAndReloadForm: boolean = extraContextProperties['showAlertMessageAndDoNotRefreshGridAndReloadForm']; 
    if (CommonUtilityFunctions.checkObjectAvailability(button)) {
      button.enable();
    }
    if (CommonUtilityFunctions.checkObjectAvailability(gridComponentObject)) {
      gridComponentObject.hideGridLoadingMask();
    }
    if (response['success']) {
      if (showAlertMessageAndDoNotRefreshGridAndReloadForm) {
        context.helperService.showAlertDialog({
          isSuccess: response['success'],
          message: response['message'],
          onButtonClicked: () => {
          }
        });
      } else {
        if (CommonUtilityFunctions.checkObjectAvailability(gridComponentObject)) {
          gridComponentObject.refreshGridData();
        }
        context.getRegisteredTutorGridRecord(context.tutorSerialId);
      }
    } else {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });      
    }
  }  

  updateRegisteredTutorProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_UPDATE']);
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.tutorUpdatedData, this.tutorRecord, deselected, isAllOPeration);
  }
  
  updateRegisteredTutorRecord() {
    this.showRecordUpdateFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.tutorUpdatedData, this.tutorSerialId);
    if (CommonUtilityFunctions.checkObjectAvailability(this.panCardFile)) {
      data.append('inputFilePANCard', this.panCardFile);
    }
    if (CommonUtilityFunctions.checkObjectAvailability(this.aadharCardFile)) {
      data.append('inputFileAadhaarCard', this.aadharCardFile);
    }
    if (CommonUtilityFunctions.checkObjectAvailability(this.photographFile)) {
      data.append('inputFilePhoto', this.photographFile);
    }
    this.utilityService.makerequest(this, this.onUpdateRegisteredTutorRecord, LcpRestUrls.tutor_update_record, 'POST',
                                    data, 'multipart/form-data', true);
  }

  onUpdateRegisteredTutorRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty(false, ['RECORD_UPDATE']);
      context.getRegisteredTutorGridRecord(context.tutorSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  resetRegisteredTutorRecord() {
    if (!this.isFlagListDirty()) {
      this.getRegisteredTutorGridRecord(this.tutorSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getRegisteredTutorGridRecord(this.tutorSerialId);
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
    const tutorSerialId: HTMLInputElement = <HTMLInputElement>document.getElementById('profileDownload-tutorSerialId');
    tutorSerialId.value = this.tutorSerialId;
    this.utilityService.submitForm('profileDownloadForm', '/rest/registeredTutor/downloadAdminRegisteredTutorProfilePdf', 'POST');
    setTimeout(() => {
      this.hideRecordUpdateFormLoaderMask();
    }, 4000);
  }

  downloadTutorDocumentFile(type: any) {
    this.showRecordUpdateFormLoaderMask();
    CommonUtilityFunctions.setHTMLInputElementValue('tutorDocumentDownloadForm-tutorSerialId', this.tutorSerialId);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorDocumentDownloadForm-documentType', type);
    this.utilityService.submitForm('tutorDocumentDownloadForm', '/rest/registeredTutor/downloadRegisteredTutorDocumentFile', 'POST');
    setTimeout(() => {
      this.hideRecordUpdateFormLoaderMask();
    }, 5000);
  }

  downloadAllTutorDocuments() {
    if (this.totalTutorDocumentFiles > 0) {
      this.showRecordUpdateFormLoaderMask();
      CommonUtilityFunctions.setHTMLInputElementValue('tutorDocumentDownloadForm-tutorSerialId', this.tutorSerialId);
      this.utilityService.submitForm('tutorDocumentDownloadForm', '/rest/registeredTutor/downloadRegisteredTutorAllDocuments', 'POST');
      setTimeout(() => {
        this.hideRecordUpdateFormLoaderMask();
      }, (this.totalTutorDocumentFiles * 5000));
    } else {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: 'No files are present for this Tutor',
        onButtonClicked: () => {
        }
      });
    }
  }

  removeTutorDocumentUploadedFile(type: any) {
    this.helperService.showConfirmationDialog({
      message: 'Are you sure you want to remove the "' + type + '" file for Tutor - "' + this.tutorRecord.name + '"',
      onOk: () => {
        const data = {
          tutorSerialId: this.tutorSerialId,
          documentType: type
        };
        this.showRecordUpdateFormLoaderMask();    
        this.utilityService.makerequest(this, this.onRemoveTutorDocumentUploadedFile, LcpRestUrls.remove_registered_tutor_document_file, 
                                        'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
      },
      onCancel: () => {
        this.helperService.showAlertDialog({
          isSuccess: false,
          message: 'File not removed',
          onButtonClicked: () => {
          }
        });
      }
    });
  }

  onRemoveTutorDocumentUploadedFile(context: any, response: any) {
    CommonUtilityFunctions.logOnConsole(response);
    if (response['success']) {
      let removedDocumentType = response['removedDocumentType'];
      if (CommonUtilityFunctions.checkObjectAvailability(removedDocumentType)) {
        if (removedDocumentType === 'aadharCard') {
          context.aadharCardFileExists = false;
        }
        if (removedDocumentType === 'panCard') {
          context.panCardFileExists = false;
        }
        if (removedDocumentType === 'photo') {
          context.photographFileExists = false;
        }
        context.helperService.showAlertDialog({
          isSuccess: true,
          message: 'Successfully removed document',
          onButtonClicked: () => {
          }
        });
        context.uploadedDocumentGridObject.refreshGridData();
      }
    } else {
      context.helperService.showAlertDialog({
        isSuccess: false,
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    }
    context.hideRecordUpdateFormLoaderMask();
  }
}
