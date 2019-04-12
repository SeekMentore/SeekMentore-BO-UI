import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-assignment-attendance',
  templateUrl: './assignment-attendance.component.html',
  styleUrls: ['./assignment-attendance.component.css']
})
export class AssignmentAttendanceComponent implements OnInit {

  @ViewChild('newAssignmentGrid')
  newAssignmentGridObject: GridComponent;
  newAssignmentGridMetaData: GridDataInterface;

  @ViewChild('startedAssignmentGrid')
  startedAssignmentGridObject: GridComponent;
  startedAssignmentGridMetaData: GridDataInterface;

  @ViewChild('hoursCompletedAssignmentGrid')
  hoursCompletedAssignmentGridObject: GridComponent;
  hoursCompletedAssignmentGridMetaData: GridDataInterface;

  @ViewChild('reviewedAssignmentGrid')
  reviewedAssignmentGridObject: GridComponent;
  reviewedAssignmentGridMetaData: GridDataInterface;

  showAssignmentAttendanceData = false;
  selectedPackageAssignmentSerialId: string = null;
  interimHoldSelectedPackageAssignmentSerialId: string = null;
  assignmentAttendanceMarkingAccess: AssignmentAttendanceMarkingAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) { 
    this.newAssignmentGridMetaData = null;
    this.startedAssignmentGridMetaData = null;
    this.hoursCompletedAssignmentGridMetaData = null;
    this.reviewedAssignmentGridMetaData = null;
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
      this.newAssignmentGridObject.init();
      this.startedAssignmentGridObject.init();
      this.hoursCompletedAssignmentGridObject.init();
      this.reviewedAssignmentGridObject.init();
    }, 100);
    setTimeout(() => {
      this.newAssignmentGridObject.refreshGridData();
      this.startedAssignmentGridObject.refreshGridData();
      this.hoursCompletedAssignmentGridObject.refreshGridData();
      this.reviewedAssignmentGridObject.refreshGridData();
    }, 100);
  }

  expandAllGrids() {
    this.newAssignmentGridObject.expandGrid();
    this.startedAssignmentGridObject.expandGrid();
    this.hoursCompletedAssignmentGridObject.expandGrid();
    this.reviewedAssignmentGridObject.expandGrid();
  }

  collapseAllGrids() {
    this.newAssignmentGridObject.collapseGrid();
    this.startedAssignmentGridObject.collapseGrid();
    this.hoursCompletedAssignmentGridObject.collapseGrid();
    this.reviewedAssignmentGridObject.collapseGrid();
  }

  public getAssignmentGridObject(id: string, title: string, restURL: string, hasActionColumn: boolean = false, actionColumn: any = null, collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'packageAssignmentSerialId',
        headerName: 'Package Assignment Serial Id',
        dataType: 'string',
        mapping: 'packageAssignmentSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          this.interimHoldSelectedPackageAssignmentSerialId = column.getValueForColumn(record);
          if (this.assignmentAttendanceMarkingAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.assignment_attendance_marking_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedPackageAssignmentSerialId = this.interimHoldSelectedPackageAssignmentSerialId;            
            this.toggleVisibilityAssignmentsGrid();
          }
        }
      },{
        id: 'createdMillis',
        headerName: 'Created Date',
        dataType: 'date',
        mapping: 'createdMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      },{
        id: 'startDateMillis',
        headerName: 'Start Date',
        dataType: 'date',
        mapping: 'startDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
      },{
        id: 'totalHours',
        headerName: 'Total Hours',
        dataType: 'number',
        mapping: 'totalHours'
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
        id: 'customerSerialId',
        headerName: 'Customer Serial Id',
        dataType: 'string',
        mapping: 'customerSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
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
        id: 'tutorSerialId',
        headerName: 'Tutor Serial Id',
        dataType: 'string',
        mapping: 'tutorSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
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
        id: 'enquirySerialId',
        headerName: 'Enquiry Serial Id',
        dataType: 'string',
        mapping: 'enquirySerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
        }
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
      }],
      hasActionColumn : hasActionColumn,
      actionColumn : actionColumn
    };
    return grid;    
  }

  public setUpGridMetaData() {
    let actionColumn: any = {
      label: 'Download Attendance Tracker',
      buttons: [{
        id: 'downloadAttendanceTracker',
        label: 'Download',
        btnclass: 'btnSubmit',
        clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject: GridComponent) => {
          gridComponentObject.showGridLoadingMask();
          button.disable();
          const packageAssignmentSerialId: HTMLInputElement = <HTMLInputElement>document.getElementById('downloadAttendanceTracker-packageAssignmentSerialId');
          packageAssignmentSerialId.value = record.getProperty('packageAssignmentSerialId');
          this.utilityService.submitForm('attendanceTrackerDownloadForm', '/rest/sales/downloadAttendanceTrackerSheet', 'POST');
          setTimeout(() => {
            button.enable();
            gridComponentObject.hideGridLoadingMask();
          }, 5000);        
        }
      }]
    };
    this.newAssignmentGridMetaData = {
      grid: this.getAssignmentGridObject('newAssignmentGrid', 'New Assignments', '/rest/sales/newAssignmentList', false, null, true),
      htmlDomElementId: 'new-assignment-grid',
      hidden: false
    };

    this.startedAssignmentGridMetaData = {
      grid: this.getAssignmentGridObject('startedAssignmentGrid', 'Started Assignments', '/rest/sales/startedAssignmentList', true, actionColumn, false),
      htmlDomElementId: 'started-assignment-grid',
      hidden: false
    };

    this.hoursCompletedAssignmentGridMetaData = {
      grid: this.getAssignmentGridObject('hoursCompletedAssignmentGrid', 'Hours Completed Assignments', '/rest/sales/hoursCompletedAssignmentList', true, actionColumn, true),
      htmlDomElementId: 'hours-completed-assignment-grid',
      hidden: false
    };

    this.reviewedAssignmentGridMetaData = {
      grid: this.getAssignmentGridObject('reviewedAssignmentGrid', 'Reviewed Assignments', '/rest/sales/reviewedAssignmentList', true, actionColumn, true),
      htmlDomElementId: 'reviewed-assignment-grid',
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
      context.assignmentAttendanceMarkingAccess = {
        success: response.success,
        message: response.message,
        assignmentAttendanceMarkingAccess: response.assignmentAttendanceMarkingAccess
      };
      context.selectedPackageAssignmentSerialId = context.interimHoldSelectedPackageAssignmentSerialId;
      context.toggleVisibilityAssignmentsGrid();
    }
  }

  toggleVisibilityAssignmentsGrid() {
    if (this.showAssignmentAttendanceData === true) {
      this.showAssignmentAttendanceData = false;
      this.selectedPackageAssignmentSerialId = null;
      setTimeout(() => {
        this.newAssignmentGridObject.init();
        this.startedAssignmentGridObject.init();
        this.hoursCompletedAssignmentGridObject.init();
        this.reviewedAssignmentGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.newAssignmentGridObject.refreshGridData();
        this.startedAssignmentGridObject.refreshGridData();
        this.hoursCompletedAssignmentGridObject.refreshGridData();
        this.reviewedAssignmentGridObject.refreshGridData();
      }, 200);
    } else {
      this.showAssignmentAttendanceData = true;
    }
  }
}

export interface AssignmentAttendanceMarkingAccess {
  success: boolean;
  message: string;
  assignmentAttendanceMarkingAccess: boolean;
}