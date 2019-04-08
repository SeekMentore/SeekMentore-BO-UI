import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
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
  selectedDemoSerialId: string = null;
  interimHoldSelectedDemoSerialId: string = null;
  demoModifyAccess: DemoModifyAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) { 
    this.scheduledDemoGridMetaData = null;
    this.successfulDemoGridMetaData = null;
    this.failedDemoGridMetaData = null;
    this.cancelledDemoGridMetaData = null;
    this.enquiryClosedDemoGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
    this.helperService.setBreadCrumb({
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    });
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

  public getGridObject(id: string, title: string, restURL: string, collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'demoSerialId',
        headerName: 'Demo Serial Id',
        dataType: 'string',
        mapping: 'demoSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject :GridComponent) => {
          this.interimHoldSelectedDemoSerialId = record.getProperty('demoSerialId');
          if (this.demoModifyAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.demo_modify_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedDemoSerialId = this.interimHoldSelectedDemoSerialId;            
            this.toggleVisibilityDemoTrackerGrid();
          }
        }
      },{
        id: 'customerSerialId',
        headerName: 'Customer Serial',
        dataType: 'string',
        mapping: 'customerSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Customer Section ' + column.getValueForColumn(record));
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
      }, {
        id: 'tutorSerialId',
        headerName: 'Tutor Serial Id',
        dataType: 'string',
        mapping: 'tutorSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Tutor Section ' + column.getValueForColumn(record));
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
          alert('Open Enquiry Section ' + column.getValueForColumn(record));
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
        id: 'rescheduledFromDemoSerialId',
        headerName: 'Rescheduled From Demo Serial Id',
        dataType: 'string',
        mapping: 'rescheduledFromDemoSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject :GridComponent) => {
          this.interimHoldSelectedDemoSerialId = record.getProperty('rescheduledFromDemoSerialId');
          if (this.demoModifyAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.demo_modify_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedDemoSerialId = this.interimHoldSelectedDemoSerialId;            
            this.toggleVisibilityDemoTrackerGrid();
          }
        }
      }, {
        id: 'reschedulingRemarks',
        headerName: 'Rescheduling Remarks',
        dataType: 'string',
        mapping: 'reschedulingRemarks',
        lengthyData: true
      }],
      hasSelectionColumn: false      
    }
    return grid;
  }

  public setUpGridMetaData() {
    this.scheduledDemoGridMetaData = {
      grid: this.getGridObject('scheduledDemoGrid', 'Scheduled Demo', '/rest/sales/scheduledDemoList'),
      htmlDomElementId: 'scheduled-demo-grid',
      hidden: false
    };
    this.successfulDemoGridMetaData = {
      grid: this.getGridObject('abortedEnquiriesGrid', 'Successful Demo', '/rest/sales/successfulDemoList', true),
      htmlDomElementId: 'successful-demo-grid',
      hidden: false
    }; 
    this.failedDemoGridMetaData = {
      grid: this.getGridObject('failedDemoGrid', 'Failed Demo', '/rest/sales/failedDemoList', true),
      htmlDomElementId: 'failed-demo-grid',
      hidden: false
    }; 
    this.cancelledDemoGridMetaData = {
      grid: this.getGridObject('cancelledDemoGrid', 'Canceled Demo', '/rest/sales/canceledDemoList', true),
      htmlDomElementId: 'cancelled-demo-grid',
      hidden: false
    }; 
    this.enquiryClosedDemoGridMetaData = {
      grid: this.getGridObject('enquiryClosedDemoGrid', 'Enquiry Closed Demo', '/rest/sales/enquiryClosedDemoList', true),
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
      context.demoModifyAccess = {
        success: response.success,
        message: response.message,
        demoUpdateFormAccess: response.demoUpdateFormAccess,
        demoRescheduleFormAccess: response.demoRescheduleFormAccess
      };
      context.selectedDemoSerialId = context.interimHoldSelectedDemoSerialId;
      context.toggleVisibilityDemoTrackerGrid();
    }
  }

  toggleVisibilityDemoTrackerGrid() {
    if (this.showDemoTrackerData === true) {
      this.showDemoTrackerData = false;
      this.selectedDemoSerialId = null;
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

export interface DemoModifyAccess {
  success: boolean;
  message: string;
  demoUpdateFormAccess: boolean;
  demoRescheduleFormAccess: boolean;
}
