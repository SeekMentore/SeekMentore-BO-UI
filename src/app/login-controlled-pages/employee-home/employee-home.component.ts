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

  public static displayDetailsForRecord(record: Record, column: Column) {
    const dialog: HTMLDivElement = document.createElement('div');
    dialog.setAttribute('class', 'dialog');
    const dialogModal: HTMLDivElement = document.createElement('div');
    dialog.appendChild(dialogModal);
    dialogModal.setAttribute('class', 'dialog_modal');

    const closeButton: HTMLSpanElement = document.createElement('span');
    closeButton.innerHTML = '<i class=\'fas fa-times\' style=\'color: var(--colorPrimary); align-self: flex-end; margin: 0px; cursor: pointer;\'></i>';
    closeButton.onclick = (ev) => {
      document.body.removeChild(dialog);
    };
    closeButton.style.padding = '4px';

    const dialogTitle: HTMLSpanElement = document.createElement('div');
    dialogTitle.innerText = 'Record Details';
    dialogTitle.style.fontWeight = '600';
    dialogTitle.style.flex = '1 1 auto';
    dialogTitle.style.alignSelf = 'centre';

    const headerDiv: HTMLDivElement = document.createElement('div');
    headerDiv.style.display = 'flex';
    headerDiv.style.width = '100%';
    headerDiv.appendChild(dialogTitle);
    headerDiv.appendChild(closeButton);
    dialogModal.appendChild(headerDiv);

    const contentDiv = document.createElement('div');
    dialogModal.appendChild(contentDiv);
    contentDiv.style.maxHeight = '400px';
    contentDiv.style.overflowY = 'auto';
    contentDiv.style.width = '100%';

    const displayData = {
      'Initiate Date': (new Date(record.getProperty('initiatedDateMillis'))).toDateString(),
      'Subject': record.getProperty('subject'),
      'Initiated By': record.getProperty('initiatedBy'),
      'Due Date': record.getProperty('dueDateMillis'),
      'Action Date': (new Date(record.getProperty('actionDateMillis'))).toDateString(),
      'Action By': record.getProperty('actionBy')
    };

    for (const key in displayData) {
      const dataDiv = document.createElement('div');
      dataDiv.innerHTML = '<b>' + key + ' :</b> ' + displayData[key];
      dataDiv.style.margin = '5px 10px';
      dataDiv.style.padding = '3px';
      //dataDiv.noWrap = false;
      //dataDiv.style.maxHeight = '40px';
      contentDiv.appendChild(dataDiv);
    }


    document.body.appendChild(dialog);
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
            EmployeeHomeComponent.displayDetailsForRecord(record, column);
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
            EmployeeHomeComponent.displayDetailsForRecord(record, column);
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
            EmployeeHomeComponent.displayDetailsForRecord(record, column);
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
