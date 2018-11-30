import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GridDataInterface, GridComponent } from 'src/app/utils/grid/grid.component';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { Column } from 'src/app/utils/grid/column';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';

@Component({
  selector: 'app-demo-tracker',
  templateUrl: './demo-tracker.component.html',
  styleUrls: ['./demo-tracker.component.css']
})
export class DemoTrackerComponent implements OnInit, AfterViewInit {

  @ViewChild('scheduledDemoGrid')
  scheduledDemoGridObject: GridComponent;
  scheduledDemoGridMetaData: GridDataInterface;

  @ViewChild('reScheduledDemoGrid')
  reScheduledDemoGridObject: GridComponent;
  reScheduledDemoGridMetaData: GridDataInterface;

  @ViewChild('successfulDemoGrid')
  successfulDemoGridObject: GridComponent;
  successfulDemoGridMetaData: GridDataInterface;

  @ViewChild('failedDemoGrid')
  failedDemoGridObject: GridComponent;
  failedDemoGridMetaData: GridDataInterface;

  @ViewChild('cancelledDemoGrid')
  cancelledDemoGridObject: GridComponent;
  cancelledDemoGridMetaData: GridDataInterface;

  showDemoTrackerData = false;
  selectedDemoTrackerRecord: GridRecord = null;
  interimHoldSelectedDemoTrackerRecord: GridRecord = null;
  demoTrackerModifyAccess: DemoTrackerModifyAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.scheduledDemoGridMetaData = null;
    this.reScheduledDemoGridMetaData = null;
    this.successfulDemoGridMetaData = null;
    this.failedDemoGridMetaData = null;
    this.cancelledDemoGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scheduledDemoGridObject.init();
      this.reScheduledDemoGridObject.init();
      this.successfulDemoGridObject.init();
      this.failedDemoGridObject.init();
      this.cancelledDemoGridObject.init();
    }, 0);
    setTimeout(() => {
      this.scheduledDemoGridObject.refreshGridData();
      this.reScheduledDemoGridObject.refreshGridData();
      this.successfulDemoGridObject.refreshGridData();
      this.failedDemoGridObject.refreshGridData();
      this.cancelledDemoGridObject.refreshGridData();
    }, 0);
  }

  public getGridObject(id: string, title: string, restURL: string) {
    let grid = {
      id: id,
      title: title,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'customerName',
        headerName: 'Customer Name',
        dataType: 'string',
        mapping: 'customerName',
        clickEvent: (record: GridRecord, column: Column) => {
          this.interimHoldSelectedDemoTrackerRecord = record;
          if (this.demoTrackerModifyAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.demo_tracker_modify_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedDemoTrackerRecord = this.interimHoldSelectedDemoTrackerRecord;            
            this.toggleVisibilityDemoTrackerGrid();
          }
        }
      }, {
        id: 'tutorName',
        headerName: 'Tutor Name',
        dataType: 'string',
        mapping: 'tutorName'
      }, {
        id: 'demoDateAndTime',
        headerName: 'Demo Date And Time',
        dataType: 'date',
        mapping: 'demoDateAndTimeMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      }, {
        id: 'demoOccurred',
        headerName: 'Demo Occurred',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoOccurred',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'demoStatus',
        headerName: 'Demo Status',
        dataType: 'list',
        filterOptions: CommonFilterOptions.demoStatusFilterOptions,
        mapping: 'demoStatus'
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
        buttons: [{
          id: 'cancelDemos',
          label: 'Cancel Demos',
          btnclass: 'btnReject',
          clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
            const tutorIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'demoTrackerId');
            if (tutorIdsList.length === 0) {
              this.helperService.showAlertDialog({
                isSuccess: false,
                message: LcpConstants.grid_generic_no_record_selected_error,
                onButtonClicked: () => {
                }
              });
            } else {
              this.helperService.showPromptDialog({
                required: true,
                titleText: 'Enter comments to Cancel',
                placeholderText: 'Please provide your comments for cancelling the demo.',
                onOk: (message) => {
                  const data = {
                    allIdsList: tutorIdsList.join(';'),
                    comments: message
                  };
                  this.utilityService.makerequest(this, this.handleCancelDemoRequest,
                    LcpRestUrls.cancel_demos, 'POST', this.utilityService.urlEncodeData(data),
                    'application/x-www-form-urlencoded');
                },
                onCancel: () => {
                }
              });
            }
          }
        }]
      }
    }
    return grid;
  }

  public setUpGridMetaData() {
    this.scheduledDemoGridMetaData = {
      grid: this.getGridObject('scheduledDemoGrid', 'Scheduled Demo', '/rest/sales/scheduledDemoList'),
      htmlDomElementId: 'scheduled-demo-grid',
      hidden: false
    };

    this.reScheduledDemoGridMetaData = {
      grid: this.getGridObject('reScheduledDemoGrid', 'Re-Scheduled Demo', '/rest/sales/reScheduledDemoList'),
      htmlDomElementId: 're-scheduled-demo-grid',
      hidden: false
    };

    this.successfulDemoGridMetaData = {
      grid: this.getGridObject('abortedEnquiriesGrid', 'Successful Demo', '/rest/sales/successfulDemoList'),
      htmlDomElementId: 'successful-demo-grid',
      hidden: false
    }; 

    this.failedDemoGridMetaData = {
      grid: this.getGridObject('failedDemoGrid', 'Failed Demo', '/rest/sales/failedDemoList'),
      htmlDomElementId: 'failed-demo-grid',
      hidden: false
    }; 

    this.cancelledDemoGridMetaData = {
      grid: this.getGridObject('cancelledDemoGrid', 'Canceled Demo', '/rest/sales/canceledDemoList'),
      htmlDomElementId: 'cancelled-demo-grid',
      hidden: false
    }; 
  }

  handleCancelDemoRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.scheduledDemoGridObject.refreshGridData();
      context.reScheduledDemoGridObject.refreshGridData();
      context.successfulDemoGridObject.refreshGridData();
      context.failedDemoGridObject.refreshGridData();
      context.cancelledDemoGridObject.refreshGridData();
    }
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
        this.reScheduledDemoGridObject.init();
        this.successfulDemoGridObject.init();
        this.failedDemoGridObject.init();
        this.cancelledDemoGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.scheduledDemoGridObject.refreshGridData();
        this.reScheduledDemoGridObject.refreshGridData();
        this.successfulDemoGridObject.refreshGridData();
        this.failedDemoGridObject.refreshGridData();
        this.cancelledDemoGridObject.refreshGridData();
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
