import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

@Component({
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.css']
})
export class EmployeeHomeComponent implements OnInit, AfterViewInit {

  @ViewChild('alertGrid')
  alertGridObject: GridComponent;
  alertGridMetaData: GridDataInterface;

  @ViewChild('taskGrid')
  taskGridObject: GridComponent;
  taskGridMetaData: GridDataInterface;

  @ViewChild('workflowGrid')
  workflowGridObject: GridComponent;
  workflowGridMetaData: GridDataInterface;

  constructor(public utilityService: AppUtilityService, public helperService: HelperService, private router: Router) {
    this.alertGridMetaData = null;
    this.taskGridMetaData = null;
    this.workflowGridMetaData = null;
    this.setUpGridMetaData();
  }

  public getDisplayDataForRecord(record: GridRecord, column: Column) {
    const displayData = {
      'Initiate Date': (new Date(record.getProperty('initiatedDateMillis'))).toDateString(),
      'Subject': record.getProperty('subject'),
      'Initiated By': record.getProperty('initiatedByName'),
      'Due Date': (new Date(record.getProperty('dueDateMillis'))).toDateString(),
      'Action Date': (new Date(record.getProperty('actionDateMillis'))).toDateString(),
      'Action By': record.getProperty('actionByName')
    };
    return displayData;
  }

  ngOnInit() {
    this.helperService.setBreadCrumb({
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.alertGridObject.init();
      this.taskGridObject.init();
      this.workflowGridObject.init();
    }, 0);

    setTimeout(() => {
      this.alertGridObject.refreshGridData();
      this.taskGridObject.refreshGridData();
      this.workflowGridObject.refreshGridData();
    }, 100);
  }

  expandAllGrids() {
    this.alertGridObject.expandGrid();
    this.taskGridObject.expandGrid();
    this.workflowGridObject.expandGrid();
  }

  collapseAllGrids() {
    this.alertGridObject.collapseGrid();
    this.taskGridObject.collapseGrid();
    this.workflowGridObject.collapseGrid();
  }

  public setUpGridMetaData() {
    this.alertGridMetaData = {
      grid: {
        id: 'alertGrid',
        title: 'Alerts & Reminders',
        store: {
          isStatic: false,
          restURL: '/rest/employee/alertReminderList'
        },
        columns: [{
          id: 'alertReminderSerialId',
          headerName: 'Alert Reminder Serial Id',
          dataType: 'string',
          mapping: 'alertReminderSerialId'
        }, {
          id: 'initiatedDate',
          headerName: 'Initiated Date',
          dataType: 'date',
          mapping: 'initiatedDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'subject',
          headerName: 'Subject',
          dataType: 'string',
          mapping: 'subject',
          lengthyData: true,
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {    
            gridComponentObject.displayRecordAsPopUp('Record Details', this.getDisplayDataForRecord(record, column));            
          }
        }, {
          id: 'initiatedBy',
          headerName: 'Initiated By',
          dataType: 'string',
          mapping: 'initiatedByName'
        }, {
          id: 'dueDate',
          headerName: 'Due Date',
          dataType: 'date',
          mapping: 'dueDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'actionDate',
          headerName: 'Action Date',
          dataType: 'date',
          mapping: 'actionDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'actionBy',
          headerName: 'Action By',
          dataType: 'string',
          mapping: 'actionByName'
        }
        ]
      },
      htmlDomElementId: 'alert-grid',
      hidden: false
    };

    this.workflowGridMetaData = {
      grid: {
        id: 'workflowGrid',
        title: 'Workflows',
        store: {
          isStatic: false,
          restURL: '/rest/employee/workflowList'
        },
        columns: [{
          id: 'workflowSerialId',
          headerName: 'Workflow Serial Id',
          dataType: 'string',
          mapping: 'workflowSerialId'
        }, {
          id: 'initiatedDate',
          headerName: 'Initiated Date',
          dataType: 'date',
          mapping: 'initiatedDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'subject',
          headerName: 'Subject',
          dataType: 'string',
          mapping: 'subject',
          lengthyData: true,
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            gridComponentObject.displayRecordAsPopUp('Record Details', this.getDisplayDataForRecord(record, column)); 
          }
        }, {
          id: 'initiatedBy',
          headerName: 'Initiated By',
          dataType: 'string',
          mapping: 'initiatedByName'
        }, {
          id: 'dueDate',
          headerName: 'Due Date',
          dataType: 'date',
          mapping: 'dueDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'actionDate',
          headerName: 'Action Date',
          dataType: 'date',
          mapping: 'actionDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'actionBy',
          headerName: 'Action By',
          dataType: 'string',
          mapping: 'actionByName'
        }
        ]
      },
      htmlDomElementId: 'workflow-grid',
      hidden: false,

    };

    this.taskGridMetaData = {
      grid: {
        id: 'taskGrid',
        title: 'Tasks',
        store: {
          isStatic: false,
          restURL: '/rest/employee/taskList'
        },
        columns: [{
          id: 'taskSerialId',
          headerName: 'Task Serial Id',
          dataType: 'string',
          mapping: 'taskSerialId'
        }, {
          id: 'initiatedDate',
          headerName: 'Initiated Date',
          dataType: 'date',
          mapping: 'initiatedDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'subject',
          headerName: 'Subject',
          dataType: 'string',
          mapping: 'subject',
          lengthyData: true,
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            gridComponentObject.displayRecordAsPopUp('Record Details', this.getDisplayDataForRecord(record, column)); 
          }
        }, {
          id: 'initiatedBy',
          headerName: 'Initiated By',
          dataType: 'string',
          mapping: 'initiatedByName'
        }, {
          id: 'dueDate',
          headerName: 'Due Date',
          dataType: 'date',
          mapping: 'dueDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'actionDate',
          headerName: 'Action Date',
          dataType: 'date',
          mapping: 'actionDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'actionBy',
          headerName: 'Action By',
          dataType: 'string',
          mapping: 'actionByName'
        }
        ]
      },
      htmlDomElementId: 'task-grid',
      hidden: false
    };
  }  
}
