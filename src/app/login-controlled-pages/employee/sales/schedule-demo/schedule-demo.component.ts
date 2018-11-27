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

@Component({
  selector: 'app-schedule-demo',
  templateUrl: './schedule-demo.component.html',
  styleUrls: ['./schedule-demo.component.css']
})
export class ScheduleDemoComponent implements OnInit, AfterViewInit {

  @ViewChild('allDemoReadyMappedTutorsGrid')
  allDemoReadyMappedTutorsGridObject: GridComponent;
  allDemoReadyMappedTutorsGridMetaData: GridDataInterface;

  showScheduleDemoMappedTutorData = false;
  selectedMappedTutorRecord: GridRecord = null;
  interimHoldSelectedMappedTutorRecord: GridRecord = null;
  mappedTutorScheduleDemoAccess: MappedTutorScheduleDemoAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.allDemoReadyMappedTutorsGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.allDemoReadyMappedTutorsGridObject.init();      
    }, 0);
    setTimeout(() => {
      this.allDemoReadyMappedTutorsGridObject.refreshGridData();
    }, 0);
  }

  public setUpGridMetaData() {
    this.allDemoReadyMappedTutorsGridMetaData = {
      grid: {
        id: 'allDemoReadyMappedTutorsGrid',
        title: 'Demo Ready Mapped Tutors',
        store: {
          isStatic: false,
          restURL: '/rest/sales/allDemoReadyMappedTutorsList'
        },
        columns: [{
          id: 'tutorName',
          headerName: 'Tutor Name',
          dataType: 'string',
          mapping: 'tutorName',
          clickEvent: (record: GridRecord, column: Column) => {
            this.interimHoldSelectedMappedTutorRecord = record;
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
          mapping: 'mappingStatus'
        }],
        hasSelectionColumn: true,
        selectionColumn: {
          buttons: [{
            id: 'demoNotReadyTutors',
            label: 'Undo Demo Ready',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              const tutorMapperIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tutorMapperId');
              if (tutorMapperIdsList.length === 0) {
                this.helperService.showAlertDialog({
                  isSuccess: false,
                  message: LcpConstants.grid_generic_no_record_selected_error,
                  onButtonClicked: () => {
                  }
                });
              } else {
                const data = {
                  allIdsList: tutorMapperIdsList.join(';'),
                  comments: ''
                };
                this.utilityService.makerequest(this, this.handleUndoDemoReadyRequest,
                  LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
                  'application/x-www-form-urlencoded');
              }
            }
          }]
        },
        hasActionColumn: true,
        actionColumn: {
          label: 'Take Action',
          buttons: [{
            id: 'demoNotReadyTutor',
            label: 'Undo Demo Ready',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              const data = {
                tutorMapperId: record.getProperty('tutorMapperId'),
                comments: ''
              };
              this.utilityService.makerequest(this, this.handleUndoDemoReadyRequest,
                LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutor, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            }
          }]
        }
      },
      htmlDomElementId: 'all-demo-ready-mapped-tutors-grid',
      hidden: false,
    };
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
      context.allDemoReadyMappedTutorsGridObject.refreshGridData();
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
        this.allDemoReadyMappedTutorsGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.allDemoReadyMappedTutorsGridObject.refreshGridData();
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
