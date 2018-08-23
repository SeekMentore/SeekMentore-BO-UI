import {Component, OnInit} from '@angular/core';
import {AppUtilityService} from '../utils/app-utility.service';
import {HelperService} from '../utils/helper.service';
import {AppConstants} from '../utils/app-constants';
import {Observable} from 'rxjs/index';
import {Router} from '@angular/router';
import {LcpConstants} from "../utils/lcp-constants";
import {EmailInterface} from "./create-email/create-email.component";


@Component({
  selector: 'app-login-controlled-pages',
  templateUrl: './login-controlled-pages.component.html',
  styleUrls: ['./login-controlled-pages.component.css']
})
export class LoginControlledPagesComponent implements OnInit {
  title = 'Welcome To Seek Mentore';
  staticPageURl = '';
  username = '';
  menu: MenuItem[] = [];

  settingMenu: SubMenuItem[] = [];
  userMenu: SubMenuItem[] = [];

  accessOptions: AccessOptions;
  logoURL = AppConstants.IMAGE_SERVER + AppConstants.LOGO_PATH;
  idleTime: number;

  confirmationDialog: HTMLDivElement;
  alertDialog: HTMLDivElement;

  emailData: EmailInterface;
  emailDialog: HTMLDivElement;

  constructor(private helperService: HelperService,
              private utilityService: AppUtilityService,
              public router: Router) {
    this.staticPageURl = AppConstants.PUBLIC_PAGES_URL;
    this.idleTime = 0;
    this.setActivityTimer();
    this.emailData = null;
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

    //set event handler for email
    this.emailDialog = <HTMLDivElement>document.getElementById('email-dialog');
    this.helperService.emailDialogState.subscribe((data: EmailInterface) => {
      if(data === null){
        this.emailDialog.style.display = 'none';
      }else {
        this.emailData = data;
        this.emailDialog.style.display = 'flex';
      }
    })
  }

  public parseMenu() {
    // will replace getBasicInfo function with ajax request
    this.getBasicInfo().subscribe(result => {
      let response = result['response'];
      response = this.utilityService.decodeObjectFromJSON(response);
      if (response != null) {
        this.username = response['username'];
        this.helperService.setTitle('Welcome ' + this.username);
        this.menu = response['menu'];
        this.accessOptions = response['accessoptions'];

        this.userMenu.push(
          {name: 'Personalize', url: '', functioncall: false},
          {name: 'Profile', url: '', functioncall: false},
          {name: 'Complaint Box', url: '', functioncall: false},
          {name: 'Help & Support', url: '', functioncall: false}
        );

        this.settingMenu.push({name: 'Change Password', url: '', functioncall: false});
        if (this.accessOptions.impersonationaccess) {
          this.settingMenu.push({name: 'Impersonate', url: '', functioncall: false});
        }
        this.settingMenu.push(
          {name: 'User Settings', url: '', functioncall: false},
          {name: 'Sign Out', url: '', functioncall: true});
      }
    }, error => {
    });
  }

  public functionCallMenuItem(itemName: string) {
    console.log(itemName);
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
        console.log('ok button clicked');
      },
      onCancel: () => {
        console.log('cancel button clicked');
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
    this.logoutRequest().subscribe(result => {
      let response = result['response'];
      response = this.utilityService.decodeObjectFromJSON(response);
      if (response != null) {
        if (response['success'] === true) {
          this.router.navigateByUrl('/');
        } else {
          console.log('show error message in dialog');
        }
      }
    }, error => {

    });
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

  public getBasicInfo() {
    // return this.makeRequest(AppConstants.basicInfoURL, 'GET');
    const observable = new Observable((observer) => {
      observer.next({
        response: '{"username": "Random Name", "menu": [{"name": "Admin", "submenu": true, "submenuitems": [{"name": "Registered Tutors", "url": "/registeredtutor"}, {"name": "Subscribed Customers", "url": "/registeredtutor"}]}, {"name": "Sales", "submenu": true, "submenuitems": [{"name": "Tutor Enquiry", "url": "/tutorenquiry"}]}], "accessoptions": {"impersonationaccess": true, "emailformaccess": true}}'
      });
      observer.complete();
    });
    return observable;
  }

  public logoutRequest() {
    const observable = new Observable((observer) => {
      observer.next({
        response: '{ "success": true,"message": "This is a message"}'
      });
      observer.complete();
    });
    return observable;
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
  submenuitems: SubMenuItem[];
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