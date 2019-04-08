import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TutorMapper } from 'src/app/model/tutor-mapper';
import { AppConstants } from 'src/app/utils/app-constants';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { TutorMapperDataAccess } from '../map-tutor-to-enquiry-data.component';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { Column } from 'src/app/utils/grid/column';

@Component({
  selector: 'app-mapped-tutor-data',
  templateUrl: './mapped-tutor-data.component.html',
  styleUrls: ['./mapped-tutor-data.component.css']
})
export class MappedTutorDataComponent implements OnInit {

  @ViewChild('currentTutorMappingGrid')
  currentTutorMappingGridObject: GridComponent;
  currentTutorMappingGridMetaData: GridDataInterface;

  @ViewChild('currentCustomerMappingGrid')
  currentCustomerMappingGridObject: GridComponent;
  currentCustomerMappingGridMetaData: GridDataInterface;

  @ViewChild('currentTutorScheduledDemoGrid')
  currentTutorScheduledDemoGridObject: GridComponent;
  currentTutorScheduledDemoGridMetaData: GridDataInterface;

  @ViewChild('currentCustomerScheduledDemoGrid')
  currentCustomerScheduledDemoGridObject: GridComponent;
  currentCustomerScheduledDemoGridMetaData: GridDataInterface;

  @Input()
  tutorMapperSerialId: string = null;

  @Input()
  tutorSerialId: string = null;

  @Input()
  customerSerialId: string = null;

  @Input()
  tutorMapperDataAccess: TutorMapperDataAccess = null;

  tutorMapperUpdatedRecord = {};
  scheduleDemoUpdatedRecord = {};

  showTutorContactedDetails = false;
  showClientContactedDetails = false;
  showEmployeeActionDetails = false;
  showEnquiryDetails = false;
  showCustomerDetails = false;
  showEmployeeActionButtons = false;
  showMappingGrid = true;
  showDemoGrid = true;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  editRecordForm = false;
  editScheduleDemoRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  matchStatusFilterOptions = CommonFilterOptions.matchStatusFilterOptions;
  mappingStatusFilterOptions = CommonFilterOptions.mappingStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;
  
  isRecordUpdateFormDirty: boolean = false;
  tutorMapperFormMaskLoaderHidden: boolean = true;
  showMessage: boolean = false;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  showRecordUpdateButton: boolean = false; 
  canUnmapTutor: boolean = false; 
  canMakeDemoReady: boolean = false;
  canMakePending: boolean = false;
  canScheduleDemo: boolean = false;
  takeActionActionText: string;
  textMessage: string;
  isScheduleDemoFormDirty: boolean = false;
  scheduleDemoFormMaskLoaderHidden: boolean = true;
  showSheduleDemoForm: boolean = false;
  showScheduleDemoButton: boolean = false;
  
  dirtyFlagList: string[] = ['RECORD_UPDATE', 'SCHEDULE_DEMO'];

  // Modal Variables
  tutorMapperRecord: TutorMapper;
  tutorContactedDateAndTimeDisplay: string;
  clientContactedDateAndTimeDisplay: string;
  adminActionDateAndTimeDisplay: string;
  enquirySubjectLookupRendererFromValue: string;
  enquiryGradeLookupRendererFromValue: string;
  enquiryPreferredTeachingTypeLookupRendererFromValue: string;
  enquiryLocationLookupRendererFromValue: string;
  tutorMapperStatusLookupRendererFromValue: string;
  tutorMapperIsTutorContactedLookupRendererFromValue: string;
  tutorMapperIsClientContactedLookupRendererFromValue: string;
  tutorMapperIsDemoScheduledLookupRendererFromValue: string;
  selectedIsTutorAgreedOption: any[] = [];
  selectedIsTutorRejectionValidOption: any[] = [];
  selectedIsClientAgreedOption: any[] = [];
  selectedIsClientRejectionValidOption: any[] = [];
  scheduleDemoDateModal: string;
  scheduleDemoTimeModal: string;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.currentTutorMappingGridMetaData = null;
    this.currentCustomerMappingGridMetaData = null;
    this.currentTutorScheduledDemoGridMetaData = null;
    this.currentCustomerScheduledDemoGridMetaData = null;
    this.tutorMapperRecord = new TutorMapper();    
  }

  ngOnInit() {
    this.getTutorMapperGridRecord(this.tutorMapperSerialId);
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.currentTutorMappingGridObject.init();
      this.currentTutorMappingGridObject.addExtraParams('tutorSerialId', this.tutorSerialId);
      this.currentCustomerMappingGridObject.init();
      this.currentCustomerMappingGridObject.addExtraParams('customerSerialId', this.customerSerialId);
      this.currentTutorScheduledDemoGridObject.init();
      this.currentTutorScheduledDemoGridObject.addExtraParams('tutorSerialId', this.tutorSerialId);
      this.currentCustomerScheduledDemoGridObject.init();
      this.currentCustomerScheduledDemoGridObject.addExtraParams('customerSerialId', this.customerSerialId);
    }, 100);
    setTimeout(() => {
      this.currentTutorMappingGridObject.refreshGridData();
      this.currentCustomerMappingGridObject.refreshGridData();
      this.currentTutorScheduledDemoGridObject.refreshGridData();
      this.currentCustomerScheduledDemoGridObject.refreshGridData();
    }, 100);
  }

  private showRecordUpdateFormLoaderMask() {
    this.tutorMapperFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.tutorMapperFormMaskLoaderHidden = true;
  }

  private showScheduleDemoFormLoaderMask() {
    this.scheduleDemoFormMaskLoaderHidden = false;
  }

  private hideScheduleDemoFormLoaderMask() {
    this.scheduleDemoFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  public setScheduleDemoFormStatus(isEditable: boolean) {
    this.editScheduleDemoRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.tutorMapperDataAccess.tutorMapperFormAccess;
    this.showRecordUpdateEditControlSection = this.tutorMapperDataAccess.tutorMapperFormAccess && !this.formEditMandatoryDisbaled;
    this.showRecordUpdateButton = this.showRecordUpdateEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canUnmapTutor && !this.canMakeDemoReady && !this.canMakePending;
    this.showSheduleDemoForm = this.tutorMapperDataAccess.scheduleDemoFormAccess && this.canScheduleDemo;
    this.showScheduleDemoButton = this.showSheduleDemoForm && this.editScheduleDemoRecordForm;
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
          case 'SCHEDULE_DEMO' : {
            if (this.isRecordUpdateFormDirty) {
              messageList.push('You have unsaved changes on the Schedule Demo form.');
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
          case 'SCHEDULE_DEMO' : {
            resultantFlagValue = resultantFlagValue || this.isScheduleDemoFormDirty;
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
          case 'SCHEDULE_DEMO' : {
            this.isScheduleDemoFormDirty = false;
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
          case 'SCHEDULE_DEMO' : {
            this.isScheduleDemoFormDirty = true;
            break;
          }
        }
      });
    }
  }  

  private getTutorMapperGridRecord(tutorMapperSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    this.showScheduleDemoFormLoaderMask();
    this.showMessage = false;
    const data = {
      parentSerialId: tutorMapperSerialId
    };    
    this.utilityService.makerequest(this, this.onGetTutorMapperGridRecord, LcpRestUrls.get_tutor_mapper_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetTutorMapperGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['tutorMapperFormEditMandatoryDisbaled'];
      context.canUnmapTutor = gridRecordObject.additionalProperties['tutorMapperCanUnmapTutor'];
      context.canMakeDemoReady = gridRecordObject.additionalProperties['tutorMapperCanMakeDemoReady'];
      context.canMakePending = gridRecordObject.additionalProperties['tutorMapperCanMakePending'];
      context.canScheduleDemo = gridRecordObject.additionalProperties['tutorMapperCanScheduleDemo'];
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

  private setUpDataModal(mappedTutorGridRecord: GridRecord) {
    CommonUtilityFunctions.logOnConsole(mappedTutorGridRecord);
    this.tutorMapperRecord.setValuesFromGridRecord(mappedTutorGridRecord);
    this.tutorMapperSerialId = this.tutorMapperRecord.tutorMapperSerialId;
    this.tutorSerialId = this.tutorMapperRecord.tutorSerialId;
    this.customerSerialId = this.tutorMapperRecord.customerSerialId;
    this.tutorContactedDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.tutorMapperRecord.tutorContactedDateMillis);
    this.clientContactedDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.tutorMapperRecord.clientContactedDateMillis);
    this.adminActionDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.tutorMapperRecord.adminActionDateMillis);
    this.enquirySubjectLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.enquirySubject, this.subjectsFilterOptions);
    this.enquiryGradeLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.enquiryGrade, this.studentGradesFilterOptions);
    this.enquiryPreferredTeachingTypeLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.enquiryPreferredTeachingType, this.preferredTeachingTypeFilterOptions);
    this.enquiryLocationLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.enquiryLocation, this.locationsFilterOptions);
    this.tutorMapperStatusLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.mappingStatus, this.mappingStatusFilterOptions);
    this.tutorMapperIsTutorContactedLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.isTutorContacted, this.yesNoFilterOptions);
    this.tutorMapperIsClientContactedLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.isClientContacted, this.yesNoFilterOptions);
    this.tutorMapperIsDemoScheduledLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.isDemoScheduled, this.yesNoFilterOptions);
    this.selectedIsTutorAgreedOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.tutorMapperRecord.isTutorAgreed);
    this.selectedIsTutorRejectionValidOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.tutorMapperRecord.isTutorRejectionValid);
    this.selectedIsClientAgreedOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.tutorMapperRecord.isClientAgreed);
    this.selectedIsClientRejectionValidOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.tutorMapperRecord.isClientRejectionValid);
    CommonUtilityFunctions.setHTMLInputElementValue('quotedTutorRate', this.tutorMapperRecord.quotedTutorRate);
    CommonUtilityFunctions.setHTMLInputElementValue('negotiatedRateWithTutor', this.tutorMapperRecord.negotiatedRateWithTutor);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorNegotiationRemarks', this.tutorMapperRecord.tutorNegotiationRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorResponse', this.tutorMapperRecord.tutorResponse);
    CommonUtilityFunctions.setHTMLInputElementValue('adminTutorRejectionValidityResponse', this.tutorMapperRecord.adminTutorRejectionValidityResponse);
    CommonUtilityFunctions.setHTMLInputElementValue('adminRemarksForTutor', this.tutorMapperRecord.adminRemarksForTutor);
    CommonUtilityFunctions.setHTMLInputElementValue('clientResponse', this.tutorMapperRecord.clientResponse);
    CommonUtilityFunctions.setHTMLInputElementValue('adminClientRejectionValidityResponse', this.tutorMapperRecord.adminClientRejectionValidityResponse);
    CommonUtilityFunctions.setHTMLInputElementValue('adminRemarksForClient', this.tutorMapperRecord.adminRemarksForClient);
    CommonUtilityFunctions.setHTMLInputElementValue('adminActionRemarks', this.tutorMapperRecord.adminActionRemarks);
    this.scheduleDemoDateModal = CommonUtilityFunctions.getDateForDateMillisParam(new Date().getTime());
    this.scheduleDemoTimeModal = CommonUtilityFunctions.getTimeForDateMillisParam(new Date().getTime());
    setTimeout(() => {
      this.editRecordForm = false;
      this.editScheduleDemoRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
      this.hideScheduleDemoFormLoaderMask();
    }, 500);
  }

  public getTutorMappingGridObject(id: string, title: string, restURL: string, startColumns: any[], collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: startColumns.concat([{
        id: 'enquirySerialId',
        headerName: 'Enquiry Serial Id',
        dataType: 'string',
        mapping: 'enquirySerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Enquiry Record > ' + column.getValueForColumn(record));
        }
      }, {
        id: 'enquirySubject',
        headerName: 'Enquiry Subject',
        dataType: 'list',
        filterOptions: CommonFilterOptions.subjectsFilterOptions,
        mapping: 'enquirySubject',
        renderer: AdminCommonFunctions.subjectsRenderer
      }, {
        id: 'enquiryGrade',
        headerName: 'Enquiry Grade',
        dataType: 'list',
        filterOptions: CommonFilterOptions.studentGradesFilterOptions,
        mapping: 'enquiryGrade',
        renderer: AdminCommonFunctions.studentGradesRenderer
      }, {
        id: 'enquiryPreferredTeachingType',
        headerName: 'Enquiry Preferred Teaching Type',
        dataType: 'list',
        filterOptions: CommonFilterOptions.preferredTeachingTypeFilterOptions,
        mapping: 'enquiryPreferredTeachingType',
        multiList: true,
        renderer: AdminCommonFunctions.preferredTeachingTypeMultiRenderer
      }, {
        id: 'enquiryLocation',
        headerName: 'Enquiry Location',
        dataType: 'list',
        filterOptions: CommonFilterOptions.locationsFilterOptions,
        mapping: 'enquiryLocation',
        renderer: AdminCommonFunctions.locationsRenderer
      }, {
        id: 'enquiryAddressDetails',
        headerName: 'Enquiry Address Details',
        dataType: 'string',
        mapping: 'enquiryAddressDetails',
        lengthyData: true
      }, {
        id: 'enquiryAdditionalDetails',
        headerName: 'Enquiry Additional Details',
        dataType: 'string',
        mapping: 'enquiryAdditionalDetails',
        lengthyData: true
      }, {
        id: 'enquiryQuotedClientRate',
        headerName: 'Enquiry Quoted Client Rate',
        dataType: 'number',
        mapping: 'enquiryQuotedClientRate'
      }, {
        id: 'enquiryNegotiatedRateWithClient',
        headerName: 'Enquiry Negotiated Rate With Client',
        dataType: 'number',
        mapping: 'enquiryNegotiatedRateWithClient'
      }, {
        id: 'enquiryClientNegotiationRemarks',
        headerName: 'Enquiry Client Negotiation Remarks',
        dataType: 'string',
        mapping: 'enquiryClientNegotiationRemarks',
        lengthyData: true
      },{
        id: 'mappingStatus',
        headerName: 'Mapping Status',
        dataType: 'list',
        filterOptions: CommonFilterOptions.mappingStatusFilterOptions,
        mapping: 'mappingStatus',
        renderer: AdminCommonFunctions.mappingStatusRenderer
      },{
        id: 'isTutorContacted',
        headerName: 'Is Tutor Contacted',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'isTutorContacted',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'isTutorAgreed',
        headerName: 'Is Tutor Agreed',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'isTutorAgreed',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'quotedTutorRate',
        headerName: 'Quoted Tutor Rate',
        dataType: 'number',
        mapping: 'quotedTutorRate'
      },{
        id: 'negotiatedRateWithTutor',
        headerName: 'Negotiated Rate With Tutor',
        dataType: 'number',
        mapping: 'negotiatedRateWithTutor'
      },{
        id: 'tutorNegotiationRemarks',
        headerName: 'Tutor Negotiation Remarks',
        dataType: 'string',
        mapping: 'tutorNegotiationRemarks',
        lengthyData: true
      },{
        id: 'isDemoScheduled',
        headerName: 'Is Demo Scheduled',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'isDemoScheduled',
        renderer: GridCommonFunctions.yesNoRenderer
      }])
    };
    return grid;
  }

  public getDemoGridObject(id: string, title: string, restURL: string, startColumns: any[], collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: startColumns.concat([{
        id: 'demoSerialId',
        headerName: 'Demo Serial Id',
        dataType: 'string',
        mapping: 'demoSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Demo Record > ' + column.getValueForColumn(record));
        }
      }, {
        id: 'demoDateAndTime',
        headerName: 'Demo Date And Time',
        dataType: 'date',
        mapping: 'demoDateAndTimeMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      }, {
        id: 'demoStatus',
        headerName: 'Demo Status',
        dataType: 'list',
        filterOptions: CommonFilterOptions.demoStatusFilterOptions,
        mapping: 'demoStatus',
        renderer: AdminCommonFunctions.demoStatusRenderer
      }, {
        id: 'enquirySerialId',
        headerName: 'Enquiry Serial Id',
        dataType: 'string',
        mapping: 'enquirySerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Enquiry Record > ' + column.getValueForColumn(record));
        }
      }, {
        id: 'enquirySubject',
        headerName: 'Enquiry Subject',
        dataType: 'list',
        filterOptions: CommonFilterOptions.subjectsFilterOptions,
        mapping: 'enquirySubject',
        renderer: AdminCommonFunctions.subjectsRenderer
      }, {
        id: 'enquiryGrade',
        headerName: 'Enquiry Grade',
        dataType: 'list',
        filterOptions: CommonFilterOptions.studentGradesFilterOptions,
        mapping: 'enquiryGrade',
        renderer: AdminCommonFunctions.studentGradesRenderer
      }, {
        id: 'enquiryPreferredTeachingType',
        headerName: 'Enquiry Preferred Teaching Type',
        dataType: 'list',
        filterOptions: CommonFilterOptions.preferredTeachingTypeFilterOptions,
        mapping: 'enquiryPreferredTeachingType',
        multiList: true,
        renderer: AdminCommonFunctions.preferredTeachingTypeMultiRenderer
      }, {
        id: 'enquiryLocation',
        headerName: 'Enquiry Location',
        dataType: 'list',
        filterOptions: CommonFilterOptions.locationsFilterOptions,
        mapping: 'enquiryLocation',
        renderer: AdminCommonFunctions.locationsRenderer
      }, {
        id: 'enquiryAddressDetails',
        headerName: 'Enquiry Address Details',
        dataType: 'string',
        mapping: 'enquiryAddressDetails',
        lengthyData: true
      }, {
        id: 'enquiryAdditionalDetails',
        headerName: 'Enquiry Additional Details',
        dataType: 'string',
        mapping: 'enquiryAdditionalDetails',
        lengthyData: true
      }, {
        id: 'enquiryQuotedClientRate',
        headerName: 'Enquiry Quoted Client Rate',
        dataType: 'number',
        mapping: 'enquiryQuotedClientRate'
      }, {
        id: 'enquiryNegotiatedRateWithClient',
        headerName: 'Enquiry Negotiated Rate With Client',
        dataType: 'number',
        mapping: 'enquiryNegotiatedRateWithClient'
      }, {
        id: 'enquiryClientNegotiationRemarks',
        headerName: 'Enquiry Client Negotiation Remarks',
        dataType: 'string',
        mapping: 'enquiryClientNegotiationRemarks',
        lengthyData: true
      },{
        id: 'tutorMapperQuotedTutorRate',
        headerName: 'Mapping Quoted Tutor Rate',
        dataType: 'number',
        mapping: 'tutorMapperQuotedTutorRate'
      },{
        id: 'tutorMapperNegotiatedRateWithTutor',
        headerName: 'Mapping Negotiated Rate With Tutor',
        dataType: 'number',
        mapping: 'tutorMapperNegotiatedRateWithTutor'
      },{
        id: 'tutorMapperTutorNegotiationRemarks',
        headerName: 'Mapping Tutor Negotiation Remarks',
        dataType: 'string',
        mapping: 'tutorMapperTutorNegotiationRemarks',
        lengthyData: true
      }, {
        id: 'rescheduledFromDemoSerialId',
        headerName: 'Rescheduled From Demo Serial Id',
        dataType: 'string',
        mapping: 'rescheduledFromDemoSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject :GridComponent) => {
          alert('Open Demo Record > ' + column.getValueForColumn(record));
        }
      }, {
        id: 'reschedulingRemarks',
        headerName: 'Re-scheduling Remarks',
        dataType: 'string',
        mapping: 'reschedulingRemarks',
        lengthyData: true
      }])
    };
    return grid;
  }

  public setUpGridMetaData() {
    this.currentTutorMappingGridMetaData = {
      grid: this.getTutorMappingGridObject('currentTutorMappingGrid', 'Current Tutor All Open Mappings', 
                                      '/rest/sales/currentTutorMappingList', 
                                      [{
                                        id: 'customerSerialId',
                                        headerName: 'Customer Serial Id',
                                        dataType: 'string',
                                        mapping: 'customerSerialId',
                                        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
                                          alert('Open Customer Record > ' + column.getValueForColumn(record));
                                        }
                                      }, {
                                        id: 'customerName',
                                        headerName: 'Customer Name',
                                        dataType: 'string',
                                        mapping: 'customerName'
                                      }, {
                                        id: 'customerEmail',
                                        headerName: 'Customer Email',
                                        dataType: 'string',
                                        mapping: 'customerEmail'
                                      }, {
                                        id: 'customerContactNumber',
                                        headerName: 'Customer Contact Number',
                                        dataType: 'string',
                                        mapping: 'customerContactNumber'
                                      }], true),
      htmlDomElementId: 'current-tutor-mapping-grid',
      hidden: false,
    };
    this.currentCustomerMappingGridMetaData = {
      grid: this.getTutorMappingGridObject('currentCustomerMappingGrid', 'Current Customer All Open Mappings', 
                                      '/rest/sales/currentCustomerMappingList', 
                                      [{
                                        id: 'tutorSerialId',
                                        headerName: 'Tutor Serial Id',
                                        dataType: 'string',
                                        mapping: 'tutorSerialId',
                                        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
                                          alert('Open Tutor Record > ' + column.getValueForColumn(record));
                                        }
                                      }, {
                                        id: 'tutorName',
                                        headerName: 'Tutor Name',
                                        dataType: 'string',
                                        mapping: 'tutorName',
                                        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
                                        }        
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
                                      }], true),
      htmlDomElementId: 'current-tutor-mapping-grid',
      hidden: false,
    };
    this.currentTutorScheduledDemoGridMetaData = {
      grid: this.getDemoGridObject('currentTutorScheduledDemoGrid', 'Current Tutor All Scheduled Demo', 
                                    '/rest/sales/currentTutorScheduledDemoList', 
                                    [{
                                      id: 'customerSerialId',
                                      headerName: 'Customer Serial Id',
                                      dataType: 'string',
                                      mapping: 'customerSerialId',
                                      clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
                                        alert('Open Customer Record > ' + column.getValueForColumn(record));
                                      }
                                    }, {
                                      id: 'customerName',
                                      headerName: 'Customer Name',
                                      dataType: 'string',
                                      mapping: 'customerName'
                                    }, {
                                      id: 'customerEmail',
                                      headerName: 'Customer Email',
                                      dataType: 'string',
                                      mapping: 'customerEmail'
                                    }, {
                                      id: 'customerContactNumber',
                                      headerName: 'Customer Contact Number',
                                      dataType: 'string',
                                      mapping: 'customerContactNumber'
                                    }], true),
      htmlDomElementId: 'current-tutor-mapping-grid',
      hidden: false,
    };
    this.currentCustomerScheduledDemoGridMetaData = {
      grid: this.getDemoGridObject('currentCustomerScheduledDemoGrid', 'Current Customer All Scheduled Demo', 
                                    '/rest/sales/currentCustomerScheduledDemoList', 
                                    [{
                                      id: 'tutorSerialId',
                                      headerName: 'Tutor Serial Id',
                                      dataType: 'string',
                                      mapping: 'tutorSerialId',
                                      clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
                                        alert('Open Tutor Record > ' + column.getValueForColumn(record));
                                      }
                                    }, {
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
                                    }], true),
      htmlDomElementId: 'current-tutor-mapping-grid',
      hidden: false,
    };
  }

  private updateProperty(key: string, event: any, data_type: string, updatedRecord: any, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, updatedRecord, this.tutorMapperRecord, deselected, isAllOPeration);
  }

  updateTutorMapperProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    if (!this.isFlagListDirty(false, ['SCHEDULE_DEMO'])) {
      this.setFlagListDirty(false, ['RECORD_UPDATE']);
      this.updateProperty(key, event, data_type, this.tutorMapperUpdatedRecord, deselected, isAllOPeration);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty(false, ['SCHEDULE_DEMO']);
          this.setFlagListDirty(false, ['RECORD_UPDATE']);
          this.updateProperty(key, event, data_type, this.tutorMapperUpdatedRecord, deselected, isAllOPeration);
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

  updateTutorMapperRecord() {
    if (!this.isFlagListDirty(false, ['SCHEDULE_DEMO'])) {
      this.updateTutorMapper();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty(false, ['SCHEDULE_DEMO']);
          this.updateTutorMapper();
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

  private updateTutorMapper() {
    this.showRecordUpdateFormLoaderMask();
    this.showScheduleDemoFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.tutorMapperUpdatedRecord, this.tutorMapperRecord.tutorMapperSerialId);
    this.utilityService.makerequest(this, this.onUpdateTutorMapperRecord, LcpRestUrls.mapped_tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateTutorMapperRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.editScheduleDemoRecordForm = false;
      context.setFlagListNotDirty();
      context.getTutorMapperGridRecord(context.tutorMapperSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
      context.hideScheduleDemoFormLoaderMask();
    }
  }

  resetTutorMapperRecord() {
    if (!this.isFlagListDirty()) {
      this.getTutorMapperGridRecord(this.tutorMapperSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getTutorMapperGridRecord(this.tutorMapperSerialId);
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

  updateScheduleDemoProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    if (!this.isFlagListDirty(false, ['RECORD_UPDATE'])) {
      this.setFlagListDirty(false, ['SCHEDULE_DEMO']);
      this.updateProperty(key, event, data_type, this.scheduleDemoUpdatedRecord, deselected, isAllOPeration);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty(false, ['RECORD_UPDATE']);
          this.setFlagListDirty(false, ['SCHEDULE_DEMO']);
          this.updateProperty(key, event, data_type, this.scheduleDemoUpdatedRecord, deselected, isAllOPeration);
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

  scheduleDemo() {
    if (!this.isFlagListDirty(false, ['RECORD_UPDATE'])) {
      this.schedule();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty(false, ['RECORD_UPDATE']);
          this.schedule();
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

  private schedule() {
    this.showRecordUpdateFormLoaderMask();
    this.showScheduleDemoFormLoaderMask();
    const demoDate: HTMLInputElement = <HTMLInputElement>document.getElementById('demoDate');
    const demoTime: HTMLInputElement = <HTMLInputElement>document.getElementById('demoTime');
    if (CommonUtilityFunctions.checkObjectAvailability(demoDate) && CommonUtilityFunctions.checkObjectAvailability(demoTime)) {
      CommonUtilityFunctions.updateRecordProperty(null, null, 'predefined_value', this.scheduleDemoUpdatedRecord, null, null, null, AppConstants.VARIABLE_LOCAL_TZ_OFFSET_MS);
      CommonUtilityFunctions.updateRecordProperty('demoDateMillis', demoDate.valueAsNumber.toString(), 'direct_value', this.scheduleDemoUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('demoTimeMillis', demoTime.valueAsNumber.toString(), 'direct_value', this.scheduleDemoUpdatedRecord, null, null, null);
    }
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.scheduleDemoUpdatedRecord, this.tutorMapperRecord.tutorMapperSerialId);
    this.utilityService.makerequest(this, this.onScheduleDemo, LcpRestUrls.schedule_demo, 'POST',
      data, 'multipart/form-data', true);
  }

  onScheduleDemo(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.editScheduleDemoRecordForm = false;
      context.setFlagListNotDirty();
      context.getTutorMapperGridRecord(context.tutorMapperSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
      context.hideScheduleDemoFormLoaderMask();
    }
  }

  unmapTutorRecord() {
    if (!this.isFlagListDirty()) {
      this.unmapTutor();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();     
          this.unmapTutor();
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

  private unmapTutor() {
    this.helperService.showConfirmationDialog({
      message: 'Please confirm if you want to un-map tutor '
                          + this.tutorMapperRecord.tutorSerialId 
                          + ' - ' 
                          + this.tutorMapperRecord.tutorName
                          + ' from the Enquiry',
      onOk: () => {
        this.showRecordUpdateFormLoaderMask();
        this.showScheduleDemoFormLoaderMask();
        this.takeActionActionText = 'unmap'; 
        this.setFlagListNotDirty();     
        const data = {
          allIdsList: this.tutorMapperRecord.tutorMapperSerialId
        };
        this.utilityService.makerequest(this, this.handleTakeActionOnMappedTutorRecord,
          LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  takeActionOnTutorMapperRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
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
        this.showScheduleDemoFormLoaderMask();
        this.takeActionActionText = actionText; 
        this.setFlagListNotDirty();              
        const data = {
          allIdsList: this.tutorMapperRecord.tutorMapperSerialId,
          button: actionText,
          comments: message
        };
        this.utilityService.makerequest(this, this.handleTakeActionOnMappedTutorRecord,
          LcpRestUrls.take_action_on_mapped_tutor, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnMappedTutorRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      if (context.takeActionActionText === 'unmap') {
        context.showMappingGrid = false;
        context.showDemoGrid = false;
        context.showRecordUpdateForm = false;
        context.showMessage = true;
        context.textMessage = 'Successfully Unmapped the Tutor Record, please go back to listing to select another record';
      } else {
        context.editRecordForm = false;
        context.editScheduleDemoRecordForm = false;
        context.setFlagListNotDirty(); 
        context.getTutorMapperGridRecord(context.tutorMapperSerialId);
      }
    } else {
      context.hideRecordUpdateFormLoaderMask();
      context.hideScheduleDemoFormLoaderMask();
    }
  }

  openCustomerRecord() {
    if (!this.isFlagListDirty()) {
      this.loadCustomerRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadCustomerRecord();
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

  loadCustomerRecord() {
    alert("Loading Customer Record > " + this.tutorMapperRecord.customerSerialId);
  }

  openEnquiryRecord() {
    if (!this.isFlagListDirty()) {
      this.loadEnquiryRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadTutorRecord();
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

  loadEnquiryRecord() {
    alert("Loading Enquiry Record > " + this.tutorMapperRecord.enquirySerialId);
  }
  
  openTutorRecord() {
    if (!this.isFlagListDirty()) {
      this.loadTutorRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadTutorRecord();
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

  loadTutorRecord() {
    alert("Loading Tutor Record > " + this.tutorMapperRecord.tutorSerialId);
  }
}
