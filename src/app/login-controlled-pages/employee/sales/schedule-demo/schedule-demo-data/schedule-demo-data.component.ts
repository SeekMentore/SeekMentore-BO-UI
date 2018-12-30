import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { MappedTutorScheduleDemoAccess } from '../schedule-demo.component';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { Column } from 'src/app/utils/grid/column';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';

@Component({
  selector: 'app-schedule-demo-data',
  templateUrl: './schedule-demo-data.component.html',
  styleUrls: ['./schedule-demo-data.component.css']
})
export class ScheduleDemoDataComponent implements OnInit, AfterViewInit {

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
  mappedTutorRecord: GridRecord = null;

  @Input()
  mappedTutorScheduleDemoAccess: MappedTutorScheduleDemoAccess = null;

  @Input()
  selectedRecordGridType: string = null;

  scheduleDemoMappedTutorUpdatedRecord = {};

  showTutorDetails = false;
  showTutorContactedDetails = false;
  showClientContactedDetails = false;
  showEmployeeActionDetails = false;
  showEmployeeActionButtons = false;

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
  mappingStatusFilterOptions = CommonFilterOptions.mappingStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.currentTutorMappingGridMetaData = null;
    this.currentCustomerMappingGridMetaData = null;
    this.currentTutorScheduledDemoGridMetaData = null;
    this.currentCustomerScheduledDemoGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
    this.setDisabledStatus();
  }

  private setDisabledStatus() {
    if (this.selectedRecordGridType === 'demoReadyMappedTutorsGrid') {
      this.formEditMandatoryDisbaled = false;
      this.takeActionDisabled = false;
    }
    if (this.selectedRecordGridType === 'pendingMappedTutorsGrid') {
      this.takeActionDisabled = false;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.currentTutorMappingGridObject.init();
      this.currentTutorMappingGridObject.addExtraParams('tutorId', this.mappedTutorRecord.getProperty('tutorId'));

      this.currentCustomerMappingGridObject.init();
      this.currentCustomerMappingGridObject.addExtraParams('customerId', this.mappedTutorRecord.getProperty('customerId'));

      this.currentTutorScheduledDemoGridObject.init();
      this.currentTutorScheduledDemoGridObject.addExtraParams('tutorId', this.mappedTutorRecord.getProperty('tutorId'));

      this.currentCustomerScheduledDemoGridObject.init();
      this.currentCustomerScheduledDemoGridObject.addExtraParams('customerId', this.mappedTutorRecord.getProperty('customerId'));
    }, 0);
    setTimeout(() => {
      this.currentTutorMappingGridObject.refreshGridData();
      this.currentCustomerMappingGridObject.refreshGridData();
      this.currentTutorScheduledDemoGridObject.refreshGridData();
      this.currentCustomerScheduledDemoGridObject.refreshGridData();
    }, 0);
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  public getMappingGridObject(id: string, title: string, restURL: string, startColumns: any[], collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: startColumns.concat([{
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
      grid: this.getMappingGridObject('currentTutorMappingGrid', 'Current Tutor Open Mapping', 
                                      '/rest/sales/currentTutorMappingList', 
                                      [{
                                        id: 'customerName',
                                        headerName: 'Customer Name',
                                        dataType: 'string',
                                        mapping: 'customerName',
                                        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
                                        }
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
      grid: this.getMappingGridObject('currentCustomerMappingGrid', 'Current Customer Open Mapping', 
                                      '/rest/sales/currentCustomerMappingList', 
                                      [{
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
      grid: this.getDemoGridObject('currentTutorScheduledDemoGrid', 'Current Tutor Scheduled Demo', 
                                    '/rest/sales/currentTutorScheduledDemoList', 
                                    [{
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
      grid: this.getDemoGridObject('currentCustomerScheduledDemoGrid', 'Current Customer Scheduled Demo', 
                                    '/rest/sales/currentCustomerScheduledDemoList', 
                                    [{
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

  updateScheduleDemoMappedTutorProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.scheduleDemoMappedTutorUpdatedRecord, this.mappedTutorRecord, deselected, isAllOPeration);
  }

  updateScheduleDemoMappedTutorRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.scheduleDemoMappedTutorUpdatedRecord, this.mappedTutorRecord.getProperty('tutorMapperId'));
    this.utilityService.makerequest(this, this.onUpdateScheduleDemoMappedTutorRecord, LcpRestUrls.schedule_demo, 'POST',
      data, 'multipart/form-data', true);
  }

  takeActionOnMappedTutorRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.mappedTutorRecord.getProperty('tutorMapperId'),
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
  }

  onUpdateScheduleDemoMappedTutorRecord(context: any, response: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: response['success'],
      message: CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']),
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (response['success']) {
      context.editRecordForm = false;
    }
  }
}
