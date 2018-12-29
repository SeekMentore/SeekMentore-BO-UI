import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { Column } from 'src/app/utils/grid/column';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';

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

  showScheduleDemoMappedTutorData = false;
  selectedMappedTutorRecord: GridRecord = null;
  interimHoldSelectedMappedTutorRecord: GridRecord = null;
  mappedTutorScheduleDemoAccess: MappedTutorScheduleDemoAccess = null;

  selectedRecordGridType: string = null;

  interimHoldSelectedMappedTutorObject: GridComponent = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.pendingMappedTutorsGridMetaData = null;
    this.demoReadyMappedTutorsGridMetaData = null;
    this.demoScheduledMappedTutorsGridObject = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.pendingMappedTutorsGridObject.init(); 
      this.demoReadyMappedTutorsGridObject.init(); 
      this.demoScheduledMappedTutorsGridObject.init();      
    }, 0);
    setTimeout(() => {
      this.pendingMappedTutorsGridObject.refreshGridData();
      this.demoReadyMappedTutorsGridObject.refreshGridData();
      this.demoScheduledMappedTutorsGridObject.refreshGridData();
    }, 0);
  }

  public getGridObject (
    id: string, 
    title: string, 
    restURL: string, 
    customSelectionButtons: any[], 
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
        id: 'tutorName',
        headerName: 'Tutor Name',
        dataType: 'string',
        mapping: 'tutorName',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          this.interimHoldSelectedMappedTutorRecord = record;
          this.selectedRecordGridType = gridComponentObject.grid.id; 
          if (this.mappedTutorScheduleDemoAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.mapped_tutor_schedule_demo_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedMappedTutorRecord = this.interimHoldSelectedMappedTutorRecord;            
            this.toggleVisibilityScheduleDemoMappedTutorGrid();
          }
        }        
      },{
        id: 'tutorContactNumber',
        headerName: 'Tutor Contact Number',
        dataType: 'string',
        mapping: 'tutorContactNumber'
      },{
        id: 'tutorEmail',
        headerName: 'Tutor Email Id',
        dataType: 'string',
        mapping: 'tutorEmail'
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
        id: 'isDemoScheduled',
        headerName: 'Is Demo Scheduled',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'isDemoScheduled',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'mappingStatus',
        headerName: 'Mapping Status',
        dataType: 'list',
        filterOptions: CommonFilterOptions.mappingStatusFilterOptions,
        mapping: 'mappingStatus',
        renderer: AdminCommonFunctions.mappingStatusRenderer
      }],
      hasSelectionColumn: true,
      selectionColumn: {
        buttons: customSelectionButtons
      },
      hasActionColumn: hasActionColumn,
      actionColumn: hasActionColumn ? actionColumn : null
    };
    return grid;
  }

  private getCustomSelectionButton (
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
        this.interimHoldSelectedMappedTutorObject = gridComponentObject;
        const enquiryIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tutorMapperId');
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
                LcpRestUrls.take_action_on_mapped_tutor, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            },
            onCancel: () => {
            }
          });
        }
      }
    };
  }

  public setUpGridMetaData() {
    let demoReady = this.getCustomSelectionButton('demoReady', 'Demo Ready', 'btnSubmit', 'demoReady', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let pending = this.getCustomSelectionButton('pending', 'Pending', 'btnReset', 'pending', true, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let unmapTutorsSelectionButton = {
      id: 'unmapTutors',
      label: 'Un-map Tutors',
      btnclass: 'btnReject',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        this.interimHoldSelectedMappedTutorObject = gridComponentObject;
        const tutorMapperIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tutorMapperId');
        if (tutorMapperIdsList.length === 0) {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: LcpConstants.grid_generic_no_record_selected_error,
            onButtonClicked: () => {
            }
          });
        } else {
          this.helperService.showConfirmationDialog({
            message: 'Please confirm if you want to un-map the selected tutors from the Enquiry',
            onOk: () => {
              const data = {
                allIdsList: tutorMapperIdsList.join(';')
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            },
            onCancel: () => {
            }
          });
        }
      }
    };
    let actionColumn = {
      label: 'Take Action',
      buttons: [{
        id: 'unmapTutor',
        label: 'Un-map Tutor',
        btnclass: 'btnReject',
        clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject: GridComponent) => {
          this.interimHoldSelectedMappedTutorObject = gridComponentObject;
          this.helperService.showConfirmationDialog({
            message: 'Please confirm if you want to un-map this tutor from the Enquiry',
            onOk: () => {
              const data = {
                allIdsList: record.getProperty('tutorMapperId')
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            },
            onCancel: () => {
            }
          });
        }
      }]
    };

    this.pendingMappedTutorsGridMetaData = {
      grid: this.getGridObject('pendingMappedTutorsGrid', 'Pending Mapped Tutors', '/rest/sales/pendingMappedTutorsList', [demoReady, unmapTutorsSelectionButton], true, actionColumn, true),
      htmlDomElementId: 'pending-mapped-tutors-grid',
      hidden: false,
    };

    this.demoReadyMappedTutorsGridMetaData = {
      grid: this.getGridObject('demoReadyMappedTutorsGrid', 'Demo Ready Mapped Tutors', '/rest/sales/demoReadyMappedTutorsList', [pending]),
      htmlDomElementId: 'demo-ready-mapped-tutors-grid',
      hidden: false,
    };

    this.demoScheduledMappedTutorsGridMetaData = {
      grid: this.getGridObject('demoScheduledMappedTutorsGrid', 'Demo Scheduled Mapped Tutors', '/rest/sales/demoScheduledMappedTutorsList', [], false, null, true),
      htmlDomElementId: 'demo-scheduled-mapped-tutors-grid',
      hidden: false,
    };
  }

  handleSelectionActionRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.interimHoldSelectedMappedTutorObject.refreshGridData();
    }
  }

  handleUndoDemoReadyRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.demoReadyMappedTutorsGridObject.refreshGridData();
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
      context.mappedTutorScheduleDemoAccess = {
        success: response.success,
        message: response.message,
        scheduleDemoFormAccess: response.scheduleDemoFormAccess
      };
      context.selectedMappedTutorRecord = context.interimHoldSelectedMappedTutorRecord;
      context.toggleVisibilityScheduleDemoMappedTutorGrid();
    }
  }

  toggleVisibilityScheduleDemoMappedTutorGrid() {
    if (this.showScheduleDemoMappedTutorData === true) {
      this.showScheduleDemoMappedTutorData = false;
      this.selectedMappedTutorRecord = null;
      setTimeout(() => {
        this.pendingMappedTutorsGridObject.init();
        this.demoReadyMappedTutorsGridObject.init();
        this.demoScheduledMappedTutorsGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.pendingMappedTutorsGridObject.refreshGridData();
        this.demoReadyMappedTutorsGridObject.refreshGridData();
        this.demoScheduledMappedTutorsGridObject.refreshGridData();
      }, 200);
    } else {
      this.showScheduleDemoMappedTutorData = true;
    }
  }

}

export interface MappedTutorScheduleDemoAccess {
  success: boolean;
  message: string;
  scheduleDemoFormAccess: boolean;
}
