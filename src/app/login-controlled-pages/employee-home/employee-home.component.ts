import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GridComponent, GridDataInterface} from '../grid/grid.component';
import {GridCommonFunctions} from '../grid/grid-common-functions';
import {Column} from '../grid/column';
import {Record} from '../grid/record';

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
      grid : {
        id : 'alertGrid',
        title : 'Alerts & Reminders',
        store : {
          isStatic : false,
          restURL : '/rest/employee/alertsRemindersGrid'
        },
        columns : [{
          id : 'initiatedDate',
          headerName : 'Initiated Date',
          dataType : 'date',
          mapping : 'initiatedDateMillis',
          renderer : GridCommonFunctions.renderDateFromMillis
        }, {
          id : 'subject',
          headerName : 'Subject',
          dataType : 'string',
          mapping : 'subject',
          clickEvent : function(record: Record, column: Column) {
            /**
             * Utilise this function in all 3 grids to open the modal to show the below data
             * Initiate Date : new Date(property->initiatedDateMillis)
             * Subject : property->subject
             * Initiated By : property->initiatedBy
             * Due Date : new Date(property->dueDateMillis)
             * Action Date : new Date(property->actionDateMillis)
             * Action By : property->actionBy
             */
            // alert(record.id + ' ' + column.headerName);
            GridCommonFunctions.displayDetailsForRecord(record, column);
          }
        }, {
          id : 'initiatedBy',
          headerName : 'Initiated By',
          dataType : 'string',
          mapping : 'initiatedBy'
        }, {
          id : 'dueDate',
          headerName : 'Due Date',
          dataType : 'date',
          mapping : 'dueDateMillis',
          renderer : GridCommonFunctions.renderDateFromMillis
        }, {
          id : 'actionDate',
          headerName : 'Action Date',
          dataType : 'date',
          mapping : 'actionDateMillis',
          renderer : GridCommonFunctions.renderDateFromMillis
        }, {
          id : 'actionBy',
          headerName : 'Action By',
          dataType : 'string',
          mapping : 'actionBy'
        }
        ]
      },
      htmlDomElementId : 'alert-grid',
      hidden : false
    };

    this.workflowGridMetaData = {
      grid : {
        id : 'workflowGrid',
        title : 'Workflows',
        store : {
          isStatic : false,
          restURL : '/rest/employee/workflowsGrid'
        },
        columns : [{
          id : 'initiatedDate',
          headerName : 'Initiated Date',
          dataType : 'date',
          mapping : 'initiatedDateMillis',
          renderer : GridCommonFunctions.renderDateFromMillis
        }, {
          id : 'subject',
          headerName : 'Subject',
          dataType : 'string',
          mapping : 'subject',
          clickEvent : function(record: Record, column: Column) {
            alert(record.id + ' ' + column.headerName);
          }
        }, {
          id : 'initiatedBy',
          headerName : 'Initiated By',
          dataType : 'string',
          mapping : 'initiatedBy'
        }, {
          id : 'dueDate',
          headerName : 'Due Date',
          dataType : 'date',
          mapping : 'dueDateMillis',
          renderer : GridCommonFunctions.renderDateFromMillis
        }, {
          id : 'actionDate',
          headerName : 'Action Date',
          dataType : 'date',
          mapping : 'actionDateMillis',
          renderer : GridCommonFunctions.renderDateFromMillis
        }, {
          id : 'actionBy',
          headerName : 'Action By',
          dataType : 'string',
          mapping : 'actionBy'
        }
        ]
      },
      htmlDomElementId : 'workflow-grid',
      hidden : false
    };

    this.taskGridMetaData = {
      grid : {
        id : 'taskGrid',
        title : 'Tasks',
        store : {
          isStatic : false,
          restURL : '/rest/employee/tasksGrid'
        },
        columns : [{
          id : 'initiatedDate',
          headerName : 'Initiated Date',
          dataType : 'date',
          mapping : 'initiatedDateMillis',
          renderer : GridCommonFunctions.renderDateFromMillis
        }, {
          id : 'subject',
          headerName : 'Subject',
          dataType : 'string',
          mapping : 'subject',
          clickEvent : function(record: Record, column: Column) {
            alert(record.id + ' ' + column.headerName);
          }
        }, {
          id : 'initiatedBy',
          headerName : 'Initiated By',
          dataType : 'string',
          mapping : 'initiatedBy'
        }, {
          id : 'dueDate',
          headerName : 'Due Date',
          dataType : 'date',
          mapping : 'dueDateMillis',
          renderer : GridCommonFunctions.renderDateFromMillis
        }, {
          id : 'actionDate',
          headerName : 'Action Date',
          dataType : 'date',
          mapping : 'actionDateMillis',
          renderer : GridCommonFunctions.renderDateFromMillis
        }, {
          id : 'actionBy',
          headerName : 'Action By',
          dataType : 'string',
          mapping : 'actionBy'
        }
        ]
      },
      htmlDomElementId: 'task-grid',
      hidden: false
    };
  }


}
