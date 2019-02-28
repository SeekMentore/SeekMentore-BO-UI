import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbEvent } from 'src/app/login-controlled-pages/bread-crumb/bread-crumb.component';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { Column } from 'src/app/utils/grid/column';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';

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
  selectedAssignmentRecord: GridRecord = null;
  interimHoldSelectedAssignmentRecord: GridRecord = null;
  assignmentAttendanceMarkingAccess: AssignmentAttendanceMarkingAccess = null;
  selectedRecordGridType: string = null;

  interimHoldSelectedAssignmentGridObject: GridComponent = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) { 
    this.newAssignmentGridMetaData = null;
    this.startedAssignmentGridMetaData = null;
    this.hoursCompletedAssignmentGridMetaData = null;
    this.reviewedAssignmentGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
    const breadCrumb: BreadCrumbEvent = {
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    };
    this.helperService.setBreadCrumb(breadCrumb);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.newAssignmentGridObject.init();
      this.startedAssignmentGridObject.init();
      this.hoursCompletedAssignmentGridObject.init();
      this.reviewedAssignmentGridObject.init();
    }, 0);
    setTimeout(() => {
      this.newAssignmentGridObject.refreshGridData();
      this.startedAssignmentGridObject.refreshGridData();
      this.hoursCompletedAssignmentGridObject.refreshGridData();
      this.reviewedAssignmentGridObject.refreshGridData();
    }, 0);
  }

  public getAssignmentGridObject(id: string, title: string, restURL: string, collapsed: boolean = false) {
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
        headerName: 'Serial Id',
        dataType: 'string',
        mapping: 'packageAssignmentSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          this.interimHoldSelectedAssignmentRecord = record;
          this.selectedRecordGridType = gridComponentObject.grid.id; 
          if (this.assignmentAttendanceMarkingAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.assignment_attendance_marking_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedAssignmentRecord = this.interimHoldSelectedAssignmentRecord;            
            this.toggleVisibilityAssignmentsGrid();
          }
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
        id: 'createdMillis',
        headerName: 'Created Date',
        dataType: 'date',
        mapping: 'createdMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      }]
    };
    return grid;    
  }

  public setUpGridMetaData() {
    this.newAssignmentGridMetaData = {
      grid: this.getAssignmentGridObject('newAssignmentGrid', 'New Assignments', '/rest/sales/newAssignmentList', true),
      htmlDomElementId: 'new-assignment-grid',
      hidden: false
    };

    this.startedAssignmentGridMetaData = {
      grid: this.getAssignmentGridObject('startedAssignmentGrid', 'Started Assignments', '/rest/sales/startedAssignmentList'),
      htmlDomElementId: 'started-assignment-grid',
      hidden: false
    };

    this.hoursCompletedAssignmentGridMetaData = {
      grid: this.getAssignmentGridObject('hoursCompletedAssignmentGrid', 'Hours Completed Assignments', '/rest/sales/hoursCompletedAssignmentList', true),
      htmlDomElementId: 'hours-completed-assignment-grid',
      hidden: false
    };

    this.reviewedAssignmentGridMetaData = {
      grid: this.getAssignmentGridObject('reviewedAssignmentGrid', 'Reviewed Assignments', '/rest/sales/reviewedAssignmentList', true),
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
      context.selectedAssignmentRecord = context.interimHoldSelectedAssignmentRecord;
      context.toggleVisibilityAssignmentsGrid();
    }
  }

  toggleVisibilityAssignmentsGrid() {
    if (this.showAssignmentAttendanceData === true) {
      this.showAssignmentAttendanceData = false;
      this.selectedAssignmentRecord = null;
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