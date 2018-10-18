import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../utils/app-constants';
import { AppUtilityService } from '../utils/app-utility.service';
import { EnvironmentConstants } from '../utils/environment-constants';
import { AlertDialogEvent, ConfirmationDialogEvent, HelperService } from '../utils/helper.service';
import { LcpConstants } from '../utils/lcp-constants';
import { LcpRestUrls } from '../utils/lcp-rest-urls';
import { EmailInterface } from './create-email/create-email.component';
import { ActionButton } from './grid/action-button';
import { Column } from './grid/column';
import { GridComponent, GridDataInterface } from './grid/grid.component';
import { Record } from './grid/record';
import { GridCommonFunctions } from './grid/grid-common-functions';

@Component({
  selector: 'app-login-controlled-pages',
  templateUrl: './login-controlled-pages.component.html',
  styleUrls: ['./login-controlled-pages.component.css']
})
export class LoginControlledPagesComponent implements OnInit, AfterViewInit {

  title = EnvironmentConstants.APPLICATION_NAME;
  staticPageURl = '';
  username = '';
  menu: MenuItem[] = [];
  settingMenu: SubMenuItem[] = [];
  userMenu: SubMenuItem[] = [];
  accessOptions: AccessOptions;
  logoURL = EnvironmentConstants.IMAGE_SERVER + AppConstants.LOGO_PATH;
  idleTime: number;
  confirmationDialog: HTMLDivElement;
  alertDialog: HTMLDivElement;
  emailData: EmailInterface;
  emailDialog: HTMLDivElement;

  @ViewChild('alertGrid')
  alertGridObject: GridComponent;
  alertGridMetaData: GridDataInterface;

  @ViewChild('taskGrid')
  taskGridObject: GridComponent;
  taskGridMetaData: GridDataInterface;

  constructor(private helperService: HelperService,
              private utilityService: AppUtilityService,
              public router: Router) {
    this.staticPageURl = EnvironmentConstants.PUBLIC_PAGES_URL;
    this.idleTime = 0;
    this.setActivityTimer();
    this.emailData = null;
    this.alertGridMetaData = null;
    this.taskGridMetaData = null;
    this.setUpGridMetaData();
  }

  ngOnInit(): void {

    this.helperService.titleState.subscribe((title: string) => {
      this.title = title;
    });
    this.parseMenu();
    // set event handler for confirmation dialog
    this.confirmationDialog = <HTMLDivElement>document.getElementById('confirmation-dialog');
    this.helperService.confirmationDialogState.subscribe((eventListener: ConfirmationDialogEvent) => {
      const okButton = <HTMLButtonElement>this.confirmationDialog.getElementsByClassName('ok-button')[0];
      const cancelButton = <HTMLButtonElement>this.confirmationDialog.getElementsByClassName('cancel-button')[0];
      const messageElement = <HTMLSpanElement>this.confirmationDialog.getElementsByClassName('message')[0];
      const titleElement = <HTMLSpanElement>this.confirmationDialog.getElementsByClassName('title')[0];
      titleElement.innerText = LcpConstants.confirmation_dialog_title;
      messageElement.innerText = eventListener.message;
      okButton.onclick = (ev: Event) => {
        eventListener.onOk();
        this.confirmationDialog.style.display = 'none';
      };
      cancelButton.onclick = (ev: Event) => {
        eventListener.onCancel();
        this.confirmationDialog.style.display = 'none';
      };
      this.confirmationDialog.style.display = 'flex';
    });
    // set event handler for alert dialog
    this.alertDialog = <HTMLDivElement>document.getElementById('alert-dialog');
    this.helperService.alertDialogState.subscribe((eventListener: AlertDialogEvent) => {
      const actionButton = <HTMLButtonElement>this.alertDialog.getElementsByClassName('action-button')[0];
      const titleElement = <HTMLSpanElement>this.alertDialog.getElementsByClassName('title')[0];
      const messageElement = <HTMLSpanElement>this.alertDialog.getElementsByClassName('message')[0];
      actionButton.classList.remove('cancel-button');
      actionButton.classList.remove('ok-button');
      if (eventListener.isSuccess) {
        titleElement.innerText = LcpConstants.success_alert_title;
        actionButton.innerText = 'ok';
        actionButton.classList.add('ok-button');
      } else {
        titleElement.innerText = LcpConstants.failure_alert_title;
        actionButton.innerText = 'Dismiss';
        actionButton.classList.add('cancel-button');
      }
      messageElement.innerText = eventListener.message;

      actionButton.onclick = (ev: Event) => {
        eventListener.onButtonClicked();
        this.alertDialog.style.display = 'none';
      };
      this.alertDialog.style.display = 'flex';
    });
    // set event handler for email
    this.emailDialog = <HTMLDivElement>document.getElementById('email-dialog');
    this.helperService.emailDialogState.subscribe((data: EmailInterface) => {
      if (data === null) {
        this.emailDialog.style.display = 'none';
      } else {
        this.emailData = data;
        this.emailDialog.style.display = 'flex';
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.alertGridObject.init();
      this.alertGridObject.createGrid();

      this.taskGridObject.init();
      this.taskGridObject.createGrid();
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
          },{
            id : 'actionDate',
            headerName : 'Action Date',
            dataType : 'date',
            mapping : 'actionDateMillis',
            renderer : GridCommonFunctions.renderDateFromMillis            
          },{
            id : 'dueDate',
            headerName : 'Due Date',
            dataType : 'date',
            mapping : 'dueDateMillis',
            renderer : GridCommonFunctions.renderDateFromMillis            
          },{
            id : 'initiatedBy',
            headerName : 'Initiated By',
            dataType : 'string',
            mapping : 'initiatedBy'            
          },{
            id : 'actionBy',
            headerName : 'Action By',
            dataType : 'string',
            mapping : 'actionBy'            
          },{
            id : 'subject',
            headerName : 'Subject',
            dataType : 'string',
            mapping : 'subject'            
          }
        ]
      },
      htmlDomElementId : 'alert-grid',
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
            renderer : GridCommonFunctions.renderDateFromMillisWithTime
          },{
            id : 'actionDate',
            headerName : 'Action Date',
            dataType : 'date',
            mapping : 'actionDateMillis',
            renderer : GridCommonFunctions.renderDateFromMillisWithTime
          },{
            id : 'dueDate',
            headerName : 'Due Date',
            dataType : 'date',
            mapping : 'dueDateMillis',
            renderer : GridCommonFunctions.renderDateFromMillisWithTime
          },{
            id : 'initiatedBy',
            headerName : 'Initiated By',
            dataType : 'string',
            mapping : 'initiatedBy'
          },{
            id : 'actionBy',
            headerName : 'Action By',
            dataType : 'string',
            mapping : 'actionBy'
          },{
            id : 'subjectList',
            headerName : 'Subject List',
            dataType : 'list',
            mapping : 'subject',
            filterOptions : [{
                  value : 'phy',
                  label : 'Physics'
                },{
                  value : 'chem',
                  label : 'Chemimstry'
                },{
                  value : 'bio',
                  label : 'Biology'
                },{
                  value : 'maths',
                  label : 'Mathematics'
                }
            ],
            renderer : function(record: Record, column: Column) {
                        return column.getValueForColumn(record) + 'External';
            },
            clickEvent : function(record: Record, column: Column) {
                        alert(record.id + ' ' + column.headerName);
            }            
          } 
        ],
        recordsPerPage : 20,
        hasSelectionColumn : true,
        hasActionColumn : true,
        actionColumn : {
          label : 'Modified Actions',
          buttons : [{
            id : 'openBtn',
            label : 'Open',
            clickEvent : function(record: Record, button: ActionButton) {
                                alert(record.id + ' ' + button.label);
                        }
          },{
            id : 'updateBtn',
            label : 'Update',
            btnclass : 'btnReset',
            clickEvent : function(record: Record, button: ActionButton) {
                                alert(record.id + ' ' + button.label);
                        }
          },{
            id : 'removeBtn',
            label : 'Remove',
            btnclass : 'btnReject',
            clickEvent : function(record: Record, button: ActionButton) {
                                alert(record.id + ' ' + button.label);
                        }
          }]
        }
      },
      htmlDomElementId: 'task-grid',
      hidden: false
    };
  }


  public parseMenu() {
    this.utilityService.makerequest(this, this.onSuccessBasicInfo, LcpRestUrls.basicInfoUrl, 'POST');
  }

  onSuccessBasicInfo(context: any, response: any) {
    context.username = response['username'];
    context.helperService.setTitle('Welcome ' + context.username);
    context.menu = response['menu'];
    context.accessOptions = response['accessoptions'];
    context.userMenu.push(
      {name: 'Personalize', url: '', functioncall: false},
      {name: 'Profile', url: '', functioncall: false},
      {name: 'Complaint Box', url: '', functioncall: false},
      {name: 'Help & Support', url: '', functioncall: false}
    );

    context.settingMenu.push({name: 'Change Password', url: '', functioncall: false});
    if (context.accessOptions.impersonationaccess) {
      context.settingMenu.push({name: 'Impersonate', url: '', functioncall: false});
    }
    context.settingMenu.push(
      {name: 'User Settings', url: '', functioncall: false},
      {name: 'Sign Out', url: '', functioncall: true});
  }

  public functionCallMenuItem(itemName: string) {
    switch (itemName) {
      case 'Sign Out':
        this.doLogout();
        break;
    }
  }

  public askForConfirmation() {
    const myListener: ConfirmationDialogEvent = {
      message: 'hello there',
      onOk: () => {
        // console.log('ok button clicked');
      },
      onCancel: () => {
        // console.log('cancel button clicked');
      }
    };
    this.helperService.showConfirmationDialog(myListener);
  }

  public showAlertDialog() {
    const myListener: AlertDialogEvent = {
      isSuccess: true,
      message: 'this is message for dialog',
      onButtonClicked: () => {

      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public showEmailDialog() {
    this.helperService.showEmailDialog();
  }

  public doLogout() {
    this.utilityService.makerequest(this, this.onSuccessLogout, LcpRestUrls.logoutUrl, 'POST');
  }

  onSuccessLogout(context: any, response: any) {

    if (response['success'] === true) {
      context.router.navigateByUrl('/');
    } else {

    }
  }

  public setActivityTimer() {
    setInterval(() => {
      this.checkActivity();
    }, 60000); // interval of 1 minute
    window.onmousemove = (ev: Event) => {
      this.idleTime = 0;
    };
    window.onkeypress = (ev: Event) => {
      this.idleTime = 0;
    };
  }

  public checkActivity() {
    this.idleTime = this.idleTime + 1;
    if (this.idleTime > AppConstants.IDLE_TIMEOUT) {
      this.doLogout();
    }
  }


}

interface SubMenuItem {
  name: string;
  url: string;
  functioncall: boolean;
}

interface MenuItem {
  name: string;
  submenu: boolean;
  subMenuItems: SubMenuItem[];
}

interface AccessOptions {
  impersonationaccess: boolean;
  emailformaccess: boolean;

}
