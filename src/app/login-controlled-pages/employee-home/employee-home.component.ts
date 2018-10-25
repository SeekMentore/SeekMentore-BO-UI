import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Column } from '../grid/column';
import { GridCommonFunctions } from '../grid/grid-common-functions';
import { GridComponent, GridDataInterface } from '../grid/grid.component';
import { Record } from '../grid/record';

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

  constructor() {
    this.alertGridMetaData = null;
    this.taskGridMetaData = null;
    this.workflowGridMetaData = null;
    this.setUpGridMetaData();
  }

  public static displayDetailsForRecord(record: Record, column: Column) {
    const displayData = {
      'Initiate Date': (new Date(record.getProperty('initiatedDateMillis'))).toDateString(),
      'Subject': record.getProperty('subject') + record.getProperty('subject') + record.getProperty('subject') + record.getProperty('subject') + record.getProperty('subject'),
      'Initiated By': record.getProperty('initiatedBy'),
      'Due Date': (new Date(record.getProperty('dueDateMillis'))).toDateString(),
      'Action Date': (new Date(record.getProperty('actionDateMillis'))).toDateString(),
      'Action By': record.getProperty('actionBy')
    };
    GridCommonFunctions.displayDetailsForRecord('Record Details', displayData);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.alertGridObject.init();
      this.taskGridObject.init();
      this.workflowGridObject.init();
    }, 0);
  }


  public setUpGridMetaData() {
    this.alertGridMetaData = {
      grid: {
        id: 'alertGrid',
        title: 'Alerts & Reminders',
        store: {
          isStatic: false,
          restURL: '/rest/employee/alertsRemindersGrid'
        },
        columns: [{
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
          clickEvent: function (record: Record, column: Column) {
            EmployeeHomeComponent.displayDetailsForRecord(record, column);
          }
        }, {
          id: 'initiatedBy',
          headerName: 'Initiated By',
          dataType: 'string',
          mapping: 'initiatedBy'
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
          mapping: 'actionBy'
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
          restURL: '/rest/employee/workflowsGrid'
        },
        columns: [{
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
          clickEvent: function (record: Record, column: Column) {
            EmployeeHomeComponent.displayDetailsForRecord(record, column);
          }
        }, {
          id: 'initiatedBy',
          headerName: 'Initiated By',
          dataType: 'string',
          mapping: 'initiatedBy'
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
          mapping: 'actionBy'
        }
        ]
      },
      htmlDomElementId: 'workflow-grid',
      hidden: false
    };

    this.taskGridMetaData = {
      grid: {
        id: 'taskGrid',
        title: 'Tasks',
        store: {
          isStatic: false,
          restURL: '/rest/employee/tasksGrid'
        },
        columns: [{
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
          clickEvent: function (record: Record, column: Column) {
            EmployeeHomeComponent.displayDetailsForRecord(record, column);
          }
        }, {
          id: 'initiatedBy',
          headerName: 'Initiated By',
          dataType: 'string',
          mapping: 'initiatedBy'
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
          mapping: 'actionBy'
        }
        ]
      },
      htmlDomElementId: 'task-grid',
      hidden: false
    };
  }


}
