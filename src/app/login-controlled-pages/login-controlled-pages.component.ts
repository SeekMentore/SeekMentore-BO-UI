import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../utils/app-constants';
import { AppUtilityService } from '../utils/app-utility.service';
import { EnvironmentConstants } from '../utils/environment-constants';
import { HelperService, ConfirmationDialogEvent, AlertDialogEvent } from '../utils/helper.service';
import { LcpConstants } from '../utils/lcp-constants';
import { LcpRestUrls } from '../utils/lcp-rest-urls';
import { EmailInterface } from './create-email/create-email.component';
import { ActionButton } from './grid/action-button';
import { ActionColumn } from './grid/action-column';
import { Column } from './grid/column';
import { GridComponent, GridDataInterface } from './grid/grid.component';
import { Paginator } from './grid/paginator';
import { SelectionColumn } from './grid/selection-column';
import { Store } from './grid/store';
import { Grid } from './grid/grid';
import { EventHandler } from './grid/event-handler';
import { FilterOption } from './grid/filter-option';
import { UIRenderer } from './grid/ui-renderer';
import { Record } from './grid/record';


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

  constructor(private helperService: HelperService,
              private utilityService: AppUtilityService,
              public router: Router) {
    this.staticPageURl = EnvironmentConstants.PUBLIC_PAGES_URL;
    this.idleTime = 0;
    this.setActivityTimer();
    this.emailData = null;
    this.alertGridMetaData = null;
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
    }, 0);
  }

  public setUpGridMetaData() {
    this.alertGridMetaData = {
      grid: new Grid(
        'alertGrid',
        'Alerts & Reminders',
        new Store('alertGrid-Store', false, '/rest/employee/alertsRemindersGrid', null),
        [
          new Column('alertGrid-Column-Id', 'ID', 'number', 'id', true, true, true, false, [], null, null),
          new Column('alertGrid-Column-InitiatedDate', 'Initiated Date', 'date', 'initiatedDate', true, true, true, false, [], null, null),
          new Column('alertGrid-Column-ActionDate', 'Action Date', 'date', 'actionDate', true, true, true, false, [], null, null),
          new Column('alertGrid-Column-DueDate', 'Due Date', 'date', 'dueDate', true, true, true, false, [], null, null),
          new Column('alertGrid-Column-InitiatedBy', 'Initiated By', 'string', 'initiatedBy', true, true, true, false, [], null, null),
          new Column('alertGrid-Column-ActionBy', 'Action By', 'string', 'actionBy', true, true, true, false, [], null, null),
          new Column('alertGrid-Column-Subject', 'Subject ', 'string', 'subject', true, true, true, false, [], null, null),
          new Column('alertGrid-Column-SubjectList', 'Subject List', 'list', 'subject', true, true, true, false, [
            new FilterOption('alertGrid-Column-SubjectList-FilterOption-Physics', 'Physics', 'phy'),
            new FilterOption('alertGrid-Column-SubjectList-FilterOption-Chemimstry', 'Chemimstry', 'chem'),
            new FilterOption('alertGrid-Column-SubjectList-FilterOption-Biology', 'Biology', 'bio'),
            new FilterOption('alertGrid-Column-SubjectList-FilterOption-Mathematics', 'Mathematics', 'maths')
          ], new UIRenderer('alertGrid-Column-SubjectList-Renderer', function(record: Record, column: Column) {
                                return record.getProperty(column.mapping) + 'External';
          }),
          new EventHandler('alertGrid-ColumnSubjectList-EH', function(record: Record, column: Column) {
                      alert(record.id + ' ' + column.headerName);
          })),
          new Column('alertGrid-Column-SubjectList2', 'Subject List 2', 'list', 'subject', true, true, true, false, [
            new FilterOption('alertGrid-Column-SubjectList2-FilterOption-Hindi', 'Hindi', 'hindi'),
            new FilterOption('alertGrid-Column-SubjectList2-FilterOption-English', 'English', 'english'),
            new FilterOption('alertGrid-Column-SubjectList2-FilterOption-Sanskrit', 'Sanskrit', 'sanskrit'),
            new FilterOption('alertGrid-Column-SubjectList2-FilterOption-Geography', 'Geography', 'geo')
          ], null, null)
        ],
        true,
        new Paginator('alertGrid-Paginator', 20),
        true,
        true,
        true,
        new SelectionColumn('alertGrid-SelectionColumn'),
        true,
        new ActionColumn('alertGrid-ActionColumn',
         [
          new ActionButton('alertGrid-ActionButtonOpen',
                          'Open', new EventHandler('alertGrid-ActionButtonOpen-EH', function(record: Record, button: ActionButton) {
                        alert(record.id + ' ' + button.label);
          })),
          new ActionButton('alertGrid-ActionButtonOpen',
                           'Update', new EventHandler('alertGrid-ActionButtonOpen-EH', function(record: Record, button: ActionButton) {
                        alert(record.id + ' ' + button.label);
          }), 'btnReset'),
          new ActionButton('alertGrid-ActionButtonOpen',
                           'Remove', new EventHandler('alertGrid-ActionButtonOpen-EH', function(record: Record, button: ActionButton) {
                        alert(record.id + ' ' + button.label);
          }), 'btnReject'),
          ]),
      ),
      htmlDomElementId: 'alert-grid',
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
