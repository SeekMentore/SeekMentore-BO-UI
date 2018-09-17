import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AppUtilityService} from '../utils/app-utility.service';
import {HelperService} from '../utils/helper.service';
import {AppConstants} from '../utils/app-constants';
import {Router} from '@angular/router';
import {LcpConstants} from '../utils/lcp-constants';
import {EmailInterface} from './create-email/create-email.component';
import {EnvironmentConstants} from '../utils/environment-constants';
import {LcpRestUrls} from '../utils/lcp-rest-urls';
import {GridColumnInterface, GridMetaDataInterface} from './create-grid/create-grid.component';
import {Store} from "./grid/store";
import {SelectionColumn} from "./grid/selection-column";
import {ActionButton} from "./grid/action-button";
import {ActionColumn} from "./grid/action-column";
import {Paginator} from "./grid/paginator";
import {Column} from "./grid/column";
import {Filter} from "./grid/filter";
import {Sorter} from "./grid/sorter";
import {GridComponent} from "./grid/grid.component";


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

  showGrid = false;
  gridColumnsData: GridColumnInterface[];
  gridMetaData: GridMetaDataInterface;
  gridRecords: any[];

  @ViewChild('grid1')
  gridObject: GridComponent;

  constructor(private helperService: HelperService,
              private utilityService: AppUtilityService,
              public router: Router) {
    this.staticPageURl = EnvironmentConstants.PUBLIC_PAGES_URL;
    this.idleTime = 0;
    this.setActivityTimer();
    this.emailData = null;
  }

  ngOnInit(): void {

    // setTimeout(() => {
    //   this.gridMetaData = {
    //     title: 'This is grid',
    //     recordPerPage: 10,
    //     totalRecords: 100,
    //     totalPageNumbers: 10,
    //     currentPageNumber: 1,
    //     paginationRequired: true
    //   };
    //   this.gridColumnsData = [{
    //     columnName: 'Column 1',
    //     mapping: 'firstColumn',
    //     filterable: true,
    //     sortable: true,
    //     datatype: 'string',
    //     allowed_values: null
    //   }, {
    //     columnName: 'Column 2',
    //     mapping: 'secondColumn',
    //     filterable: true,
    //     sortable: true,
    //     datatype: 'list',
    //     allowed_values: ['cell 1', 'cell 2']
    //   }, {
    //     columnName: 'Column 3',
    //     mapping: 'thirdColumn',
    //     filterable: true,
    //     sortable: true,
    //     datatype: 'number',
    //     allowed_values: null
    //   }];
    //   this.gridRecords = [
    //     {
    //       firstColumn: 'cell 1',
    //       secondColumn: 'cell 2',
    //       thirdColumn: 3
    //     },
    //     {
    //       firstColumn: 'cell 4',
    //       secondColumn: 'cell 5',
    //       thirdColumn: 63
    //     },
    //     {
    //       firstColumn: 'cell 1',
    //       secondColumn: 'cell 2',
    //       thirdColumn: 96
    //     }
    //   ];
    //   this.showGrid = true;
    // }, 500);

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
        eventListener.onOk();
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
      this.setUpGrid();
    }, 0);
  }

  public setUpGrid() {
    const store = new Store('G1-S', true);
    const data = [
      {name: 'Manjeet', age: 20},
      {name: 'Kumar', age: 25}
    ];
    store.setStaticData(data);
    store.convertIntoRecordData(store.getStaticData());
    const selection_column = new SelectionColumn('G1-SC');
    const action_button1 = new ActionButton('G1-AB1', 'open');
    const action_button2 = new ActionButton('G1-AB2', 'remove');
    const action_column = new ActionColumn('G1-AC', [action_button1, action_button2]);
    const paginator = new Paginator('G1-P', 20);
    paginator.init();
    const column1 = new Column('G1-C1', 'Client Name', 'string', 'name', true, true, true, false, [], null, null);
    const column2 = new Column('G1-C2', 'Client Age', 'number', 'age', true, true, true, false, [], null, null);
    // const filter1 = new Filter('G1-C1-F1', 'string', 'name', 'Client Name');
    // const filter2 = new Filter('G1-C2-F1', 'number', 'age', 'Client Age');
    // const sorter1 = new Sorter('G1-C1-S1', 'string', 'name', 'Client Name');
    // const sorter2 = new Sorter('G1-C1-S1', 'number', 'age', 'Client Age');
    this.gridObject.id = 'grid-1';
    this.gridObject.title = 'grid title';
    this.gridObject.htmlDomElementId = 'grid-1';
    this.gridObject.hasSelectionColumn = true;
    this.gridObject.selectionColumn = selection_column;
    this.gridObject.hasActionColumn = true;
    this.gridObject.actionColumn = action_column;
    this.gridObject.isPagingCapable = true;
    this.gridObject.paginator = paginator;
    this.gridObject.isSortingCapable = true;
    // this.gridObject.sorters = [sorter1, sorter2];
    this.gridObject.isFilterCapable = true;
    // this.gridObject.filters = [filter1, filter2];
    this.gridObject.columns = [column1, column2];
    this.gridObject.store = store;
    this.gridObject.init();
    this.gridObject.createGrid();
  }


  public parseMenu() {
    // will replace getBasicInfo function with ajax request
    this.utilityService.makerequest(this, this.onSuccessBasicInfo, LcpRestUrls.basicInfoUrl, 'POST');
    //   .subscribe(result => {
    //   let response = result['response'];
    //   response = this.utilityService.decodeObjectFromJSON(response);
    //   // console.log(response);
    //   if (response != null) {
    //     this.username = response['username'];
    //     this.helperService.setTitle('Welcome ' + this.username);
    //     this.menu = response['menu'];
    //     this.accessOptions = response['accessoptions'];
    //     // console.log(this.menu);
    //     this.userMenu.push(
    //       {name: 'Personalize', url: '', functioncall: false},
    //       {name: 'Profile', url: '', functioncall: false},
    //       {name: 'Complaint Box', url: '', functioncall: false},
    //       {name: 'Help & Support', url: '', functioncall: false}
    //     );
    //
    //     this.settingMenu.push({name: 'Change Password', url: '', functioncall: false});
    //     if (this.accessOptions.impersonationaccess) {
    //       this.settingMenu.push({name: 'Impersonate', url: '', functioncall: false});
    //     }
    //     this.settingMenu.push(
    //       {name: 'User Settings', url: '', functioncall: false},
    //       {name: 'Sign Out', url: '', functioncall: true});
    //   }
    // }, error => {
    // });
  }

  onSuccessBasicInfo(context: any, response: any) {
    context.username = response['username'];
    context.helperService.setTitle('Welcome ' + context.username);
    context.menu = response['menu'];
    context.accessOptions = response['accessoptions'];
    // console.log(this.menu);
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
    // console.log(itemName);
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
      onOk: () => {

      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public showEmailDialog() {
    this.helperService.showEmailDialog();
  }

  public doLogout() {
    this.utilityService.makerequest(this, this.onSuccessLogout, LcpRestUrls.logoutUrl, 'POST');
    //   .subscribe(result => {
    //   let response = result['response'];
    //   response = this.utilityService.decodeObjectFromJSON(response);
    //   if (response != null) {
    //     if (response['success'] === true) {
    //       this.router.navigateByUrl('/');
    //     } else {
    //       // console.log('show error message in dialog');
    //     }
    //   }
    // }, error => {
    //
    // });
  }

  onSuccessLogout(context: any, response: any) {

    if (response['success'] === true) {
      context.router.navigateByUrl('/');
    } else {
      // console.log('show error message in dialog');
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

export interface ConfirmationDialogEvent {

  message: string;

  onOk(): void;

  onCancel(): void;
}

export interface AlertDialogEvent {
  isSuccess: boolean;
  message: string;

  onOk(): void;
}
