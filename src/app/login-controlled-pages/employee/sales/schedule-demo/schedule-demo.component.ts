import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { TutorMapperDataAccess } from '../map-tutor-to-enquiry/map-tutor-to-enquiry-data/map-tutor-to-enquiry-data.component';

@Component({
  selector: 'app-schedule-demo',
  templateUrl: './schedule-demo.component.html',
  styleUrls: ['./schedule-demo.component.css']
})
export class ScheduleDemoComponent implements OnInit, AfterViewInit {

  @ViewChild('pendingMappedTutorsGrid')
  pendingMappedTutorsGridObject: GridComponent;
  pendingMappedTutorsGridMetaData: GridDataInterface;

  @ViewChild('demoReadyMappedTutorsGrid')
  demoReadyMappedTutorsGridObject: GridComponent;
  demoReadyMappedTutorsGridMetaData: GridDataInterface;

  @ViewChild('demoScheduledMappedTutorsGrid')
  demoScheduledMappedTutorsGridObject: GridComponent;
  demoScheduledMappedTutorsGridMetaData: GridDataInterface;

  @ViewChild('enquiryClosedMappedTutorsGrid')
  enquiryClosedMappedTutorsGridObject: GridComponent;
  enquiryClosedMappedTutorsGridMetaData: GridDataInterface;

  showScheduleDemoMappedTutorData = false;
  selectedTutorMapperSerialId: string = null;
  selectedTutorSerialId: string = null;
  selectedCustomerSerialId: string = null;
  interimHoldSelectedTutorMapperSerialId: string = null;
  interimHoldSelectedTutorSerialId: string = null;
  interimHoldSelectedCustomerSerialId: string = null;
  tutorMapperDataAccess: TutorMapperDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) { 
    this.pendingMappedTutorsGridMetaData = null;
    this.demoReadyMappedTutorsGridMetaData = null;
    this.demoScheduledMappedTutorsGridObject = null;
    this.enquiryClosedMappedTutorsGridMetaData = null;
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
      this.pendingMappedTutorsGridObject.init(); 
      this.demoReadyMappedTutorsGridObject.init(); 
      this.demoScheduledMappedTutorsGridObject.init();  
      this.enquiryClosedMappedTutorsGridObject.init();     
    }, 0);
    setTimeout(() => {
      this.pendingMappedTutorsGridObject.refreshGridData();
      this.demoReadyMappedTutorsGridObject.refreshGridData();
      this.demoScheduledMappedTutorsGridObject.refreshGridData();
      this.enquiryClosedMappedTutorsGridObject.refreshGridData();
    }, 0);
  }

  public getGridObject (
    id: string, 
    title: string, 
    restURL: string, 
    hasActionColumn: boolean = false, 
    actionColumn: any = null, 
    collapsed: boolean = false
  ) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'tutorMapperSerialId',
        headerName: 'Tutor Mapper Serial Id',
        dataType: 'string',
        mapping: 'tutorMapperSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject :GridComponent) => {
          this.interimHoldSelectedTutorMapperSerialId = column.getValueForColumn(record);
          this.interimHoldSelectedTutorSerialId = record.getProperty('tutorMapperSerialId');
            this.interimHoldSelectedCustomerSerialId = record.getProperty('customerSerialId');
          if (this.tutorMapperDataAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.tutor_mapper_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedTutorMapperSerialId = this.interimHoldSelectedTutorMapperSerialId;  
            this.selectedTutorSerialId = this.interimHoldSelectedTutorSerialId;           
            this.selectedCustomerSerialId = this.interimHoldSelectedCustomerSerialId;            
            this.toggleVisibilityScheduleDemoMappedTutorGrid();
          }
        }
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
        id: 'customerSerialId',
        headerName: 'Customer Serial Id',
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
      }],
      hasSelectionColumn: false,
      hasActionColumn: hasActionColumn,
      actionColumn: hasActionColumn ? actionColumn : null
    };
    return grid;
  }

  handleUnmapRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.pendingMappedTutorsGridObject.refreshGridData();
    }
  }

  public setUpGridMetaData() {
    let actionColumn = {
      label: 'Take Action',
      buttons: [{
        id: 'unmapTutor',
        label: 'Un-map Tutor',
        btnclass: 'btnReject',
        securityMapping: {
          isSecured: true,
          visible: 'showUnMap',
          enabled: 'enableUnMap'              
        },
        clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject: GridComponent) => {
          button.disable();
          this.helperService.showConfirmationDialog({
            message: 'Please confirm if you want to un-map tutor '
                      + record.getProperty('tutorSerialId') 
                      + ' - ' 
                      + record.getProperty('tutorName')
                      + ' from the Enquiry',
            onOk: () => {
              const data = {
                allIdsList: record.getProperty('tutorMapperSerialId')
              };
              gridComponentObject.showGridLoadingMask();
              this.utilityService.makerequest(this, this.handleUnmapRequest,
                LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
              button.enable();
            },
            onCancel: () => {
              button.enable();
            }
          });
        }
      }]
    };

    this.pendingMappedTutorsGridMetaData = {
      grid: this.getGridObject('pendingMappedTutorsGrid', 'Pending Mapped Tutors', '/rest/sales/pendingMappedTutorsList', true, actionColumn, true),
      htmlDomElementId: 'pending-mapped-tutors-grid',
      hidden: false,
    };
    this.demoReadyMappedTutorsGridMetaData = {
      grid: this.getGridObject('demoReadyMappedTutorsGrid', 'Demo Ready Mapped Tutors', '/rest/sales/demoReadyMappedTutorsList'),
      htmlDomElementId: 'demo-ready-mapped-tutors-grid',
      hidden: false,
    };
    this.demoScheduledMappedTutorsGridMetaData = {
      grid: this.getGridObject('demoScheduledMappedTutorsGrid', 'Demo Scheduled Mapped Tutors', '/rest/sales/demoScheduledMappedTutorsList', false, null, true),
      htmlDomElementId: 'demo-scheduled-mapped-tutors-grid',
      hidden: false,
    };
    this.enquiryClosedMappedTutorsGridMetaData = {
      grid: this.getGridObject('enquiryClosedMappedTutorsGrid', 'Enquiry Closed Mapped Tutors', '/rest/sales/enquiryClosedMappedTutorsList', false, null, true),
      htmlDomElementId: 'enquiry-closed-mapped-tutors-grid',
      hidden: false,
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
      context.tutorMapperDataAccess = {
        success: response.success,
        message: response.message,
        tutorMapperFormAccess: response.tutorMapperFormAccess,
        scheduleDemoFormAccess: response.scheduleDemoFormAccess
      };
      context.selectedTutorMapperSerialId = context.interimHoldSelectedTutorMapperSerialId;
      context.selectedTutorSerialId = context.interimHoldSelectedTutorSerialId;           
      context.selectedCustomerSerialId = context.interimHoldSelectedCustomerSerialId;  
      context.toggleVisibilityScheduleDemoMappedTutorGrid();
    }
  }

  toggleVisibilityScheduleDemoMappedTutorGrid() {
    if (this.showScheduleDemoMappedTutorData === true) {
      this.showScheduleDemoMappedTutorData = false;
      this.selectedTutorMapperSerialId = null;
      this.selectedTutorSerialId = null;
      this.selectedCustomerSerialId = null;
      setTimeout(() => {
        this.pendingMappedTutorsGridObject.init();
        this.demoReadyMappedTutorsGridObject.init();
        this.demoScheduledMappedTutorsGridObject.init();
        this.enquiryClosedMappedTutorsGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.pendingMappedTutorsGridObject.refreshGridData();
        this.demoReadyMappedTutorsGridObject.refreshGridData();
        this.demoScheduledMappedTutorsGridObject.refreshGridData();
        this.enquiryClosedMappedTutorsGridObject.refreshGridData();
      }, 200);
    } else {
      this.showScheduleDemoMappedTutorData = true;
    }
  }
}