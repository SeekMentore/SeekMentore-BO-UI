import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GridDataInterface, GridComponent } from 'src/app/utils/grid/grid.component';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { Column } from 'src/app/utils/grid/column';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';

@Component({
  selector: 'app-demo-tracker',
  templateUrl: './demo-tracker.component.html',
  styleUrls: ['./demo-tracker.component.css']
})
export class DemoTrackerComponent implements OnInit, AfterViewInit {

  @ViewChild('scheduledDemoGrid')
  scheduledDemoGridObject: GridComponent;
  scheduledDemoGridMetaData: GridDataInterface;

  @ViewChild('successfulDemoGrid')
  successfulDemoGridObject: GridComponent;
  successfulDemoGridMetaData: GridDataInterface;

  @ViewChild('failedDemoGrid')
  failedDemoGridObject: GridComponent;
  failedDemoGridMetaData: GridDataInterface;

  @ViewChild('cancelledDemoGrid')
  cancelledDemoGridObject: GridComponent;
  cancelledDemoGridMetaData: GridDataInterface;

  @ViewChild('enquiryClosedDemoGrid')
  enquiryClosedDemoGridObject: GridComponent;
  enquiryClosedDemoGridMetaData: GridDataInterface;

  showDemoTrackerData = false;
  selectedDemoTrackerRecord: GridRecord = null;
  interimHoldSelectedDemoTrackerRecord: GridRecord = null;
  demoTrackerModifyAccess: DemoTrackerModifyAccess = null;

  selectedRecordGridType: string = null;
  interimHoldSelectedDemoTrackerObject: GridComponent = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.scheduledDemoGridMetaData = null;
    this.successfulDemoGridMetaData = null;
    this.failedDemoGridMetaData = null;
    this.cancelledDemoGridMetaData = null;
    this.enquiryClosedDemoGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scheduledDemoGridObject.init();
      this.successfulDemoGridObject.init();
      this.failedDemoGridObject.init();
      this.cancelledDemoGridObject.init();
      this.enquiryClosedDemoGridObject.init();
    }, 0);
    setTimeout(() => {
      this.scheduledDemoGridObject.refreshGridData();
      this.successfulDemoGridObject.refreshGridData();
      this.failedDemoGridObject.refreshGridData();
      this.cancelledDemoGridObject.refreshGridData();
      this.enquiryClosedDemoGridObject.refreshGridData();
    }, 0);
  }

  public getGridObject(id: string, title: string, restURL: string, customSelectionButtons: any[], collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'customerName',
        headerName: 'Customer Name',
        dataType: 'string',
        mapping: 'customerName',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject :GridComponent) => {
          this.interimHoldSelectedDemoTrackerRecord = record;
          this.selectedRecordGridType = gridComponentObject.grid.id; 
          if (this.demoTrackerModifyAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.demo_tracker_modify_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedDemoTrackerRecord = this.interimHoldSelectedDemoTrackerRecord;            
            this.toggleVisibilityDemoTrackerGrid();
          }
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
        id: 'demoOccurred',
        headerName: 'Demo Occurred',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoOccurred',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'clientSatisfiedFromTutor',
        headerName: 'Client Satisfied From Tutor',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'clientSatisfiedFromTutor',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'clientRemarks',
        headerName: 'Client Remarks',
        dataType: 'string',
        mapping: 'clientRemarks',
        lengthyData: true
      }, {
        id: 'tutorSatisfiedWithClient',
        headerName: 'Tutor Satisfied With Client',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'tutorSatisfiedWithClient',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'tutorRemarks',
        headerName: 'Tutor Remarks',
        dataType: 'string',
        mapping: 'tutorRemarks',
        lengthyData: true
      }, {
        id: 'adminSatisfiedFromTutor',
        headerName: 'Admin Satisfied From Tutor',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'adminSatisfiedFromTutor',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'adminSatisfiedWithClient',
        headerName: 'Admin Satisfied With Client',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'adminSatisfiedWithClient',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'isDemoSuccess',
        headerName: 'Demo Success',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'isDemoSuccess',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'needPriceNegotiationWithClient',
        headerName: 'Need Price Negotiation With Client',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'needPriceNegotiationWithClient',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'negotiatedOverrideRateWithClient',
        headerName: 'Negotiated Override Rate With Client',
        dataType: 'number',
        mapping: 'negotiatedOverrideRateWithClient'
      }, {
        id: 'clientNegotiationRemarks',
        headerName: 'Client Negotiation Remarks',
        dataType: 'string',
        mapping: 'clientNegotiationRemarks',
        lengthyData: true
      }, {
        id: 'needPriceNegotiationWithTutor',
        headerName: 'Need Price Negotiation With Tutor',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'needPriceNegotiationWithTutor',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'negotiatedOverrideRateWithTutor',
        headerName: 'Negotiated Override Rate With Tutor',
        dataType: 'number',
        mapping: 'negotiatedOverrideRateWithTutor'
      }, {
        id: 'tutorNegotiationRemarks',
        headerName: 'Tutor Negotiation Remarks',
        dataType: 'string',
        mapping: 'tutorNegotiationRemarks',
        lengthyData: true
      }, {
        id: 'adminRemarks',
        headerName: 'Admin Remarks',
        dataType: 'string',
        mapping: 'adminRemarks',
        lengthyData: true
      }, {
        id: 'adminFinalizingRemarks',
        headerName: 'Admin Finalizing Remarks',
        dataType: 'string',
        mapping: 'adminFinalizingRemarks',
        lengthyData: true
      }, {
        id: 'reschedulingRemarks',
        headerName: 'Re-scheduling Remarks',
        dataType: 'string',
        mapping: 'reschedulingRemarks',
        lengthyData: true
      }],
      hasSelectionColumn: true,
      selectionColumn: {
        buttons: customSelectionButtons
      }
    }
    return grid;
  }

  private getCustomButton (
      id:string, 
      label: string, 
      btnclass: string = 'btnSubmit', 
      actionText: string, 
      commentsRequired: boolean = false,
      titleText: string,
      placeholderText: string
  ) {
    return {
      id: id,
      label: label,
      btnclass: btnclass,
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        this.interimHoldSelectedDemoTrackerObject = gridComponentObject;
        const enquiryIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'demoTrackerId');
        if (enquiryIdsList.length === 0) {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: LcpConstants.grid_generic_no_record_selected_error,
            onButtonClicked: () => {
            }
          });
        } else {
          this.helperService.showPromptDialog({
            required: commentsRequired,
            titleText: titleText,
            placeholderText: placeholderText,
            onOk: (message) => {                  
              const data = {
                allIdsList: enquiryIdsList.join(';'),
                button: actionText,
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.take_action_on_demo, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            },
            onCancel: () => {
            }
          });
        }
      }
    };
  }

  handleSelectionActionRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']),
        onButtonClicked: () => {
        }
      });
    } else {
      context.interimHoldSelectedDemoTrackerObject.refreshGridData();
    }
  }

  public setUpGridMetaData() {
    let cancelDemo = this.getCustomButton('cancel', 'Cancel Demo', 'btnReject', 'cancel', true, 'Enter comments for Cancelling Demo', 'Please provide your comments for Cancelling Demo.');

    this.scheduledDemoGridMetaData = {
      grid: this.getGridObject('scheduledDemoGrid', 'Scheduled Demo', '/rest/sales/scheduledDemoList', [cancelDemo]),
      htmlDomElementId: 'scheduled-demo-grid',
      hidden: false
    };

    this.successfulDemoGridMetaData = {
      grid: this.getGridObject('abortedEnquiriesGrid', 'Successful Demo', '/rest/sales/successfulDemoList', [], true),
      htmlDomElementId: 'successful-demo-grid',
      hidden: false
    }; 

    this.failedDemoGridMetaData = {
      grid: this.getGridObject('failedDemoGrid', 'Failed Demo', '/rest/sales/failedDemoList', [], true),
      htmlDomElementId: 'failed-demo-grid',
      hidden: false
    }; 

    this.cancelledDemoGridMetaData = {
      grid: this.getGridObject('cancelledDemoGrid', 'Canceled Demo', '/rest/sales/canceledDemoList', [], true),
      htmlDomElementId: 'cancelled-demo-grid',
      hidden: false
    }; 

    this.enquiryClosedDemoGridMetaData = {
      grid: this.getGridObject('enquiryClosedDemoGrid', 'Enquiry Closed Demo', '/rest/sales/enquiryClosedDemoList', [], true),
      htmlDomElementId: 'enquiry-closed-grid',
      hidden: false
    }; 
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
      context.demoTrackerModifyAccess = {
        success: response.success,
        message: response.message,
        demoTrackerFormAccess: response.demoTrackerFormAccess
      };
      context.selectedDemoTrackerRecord = context.interimHoldSelectedDemoTrackerRecord;
      context.toggleVisibilityDemoTrackerGrid();
    }
  }

  toggleVisibilityDemoTrackerGrid() {
    if (this.showDemoTrackerData === true) {
      this.showDemoTrackerData = false;
      this.selectedDemoTrackerRecord = null;
      setTimeout(() => {
        this.scheduledDemoGridObject.init();
        this.successfulDemoGridObject.init();
        this.failedDemoGridObject.init();
        this.cancelledDemoGridObject.init();
        this.enquiryClosedDemoGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.scheduledDemoGridObject.refreshGridData();
        this.successfulDemoGridObject.refreshGridData();
        this.failedDemoGridObject.refreshGridData();
        this.cancelledDemoGridObject.refreshGridData();
        this.enquiryClosedDemoGridObject.refreshGridData();
      }, 200);
    } else {
      this.showDemoTrackerData = true;
    }
  }
}

export interface DemoTrackerModifyAccess {
  success: boolean;
  message: string;
  demoTrackerFormAccess: boolean;
}
