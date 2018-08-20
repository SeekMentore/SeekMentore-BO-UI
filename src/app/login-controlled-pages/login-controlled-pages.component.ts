import {Component, OnInit} from '@angular/core';
import {AppUtilityService} from '../utils/app-utility.service';
import {HelperService} from '../utils/helper.service';
import {AppConstants} from '../utils/app-constants';
import {Observable} from 'rxjs/index';
import {Router} from '@angular/router';


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

  constructor(private helperService: HelperService,
              private utilityService: AppUtilityService,
              public router: Router) {
    this.staticPageURl = AppConstants.PUBLIC_PAGES_URL;
    this.idleTime = 0;
    this.setActivityTimer();
  }

  ngOnInit(): void {
    this.helperService.titleState.subscribe((title: string) => {
      this.title = title;
    });
    this.parseMenu();
    // document.addEventListener('click', (event => {
    //   if (this.menu.length === 0) {
    //     return;
    //   }
    //   let menuButtonClicked = false;
    //   this.menu.forEach((item, index) => {
    //     let element: HTMLElement = null;
    //     if (item.submenu) {
    //       element = document.getElementById('menuButton' + index);
    //     }
    //
    //     if (element != null && element.id === (<any>event.target).id) {
    //       menuButtonClicked = true;
    //
    //     }
    //   });
    //   if (menuButtonClicked === false) {
    //     // hide menu by sending invalid id
    //     this.showDropMenu(-1);
    //   }
    //   // console.log(menuButtonClicked, event.target);
    // }));
    this.confirmationDialog = <HTMLDivElement>document.getElementById('confirmation-dialog');
    this.helperService.confirmationDialogState.subscribe((eventListener: ConfirmationDialogEvent) => {
      this.confirmationDialog.style.display = 'block';
      const okButton = <HTMLButtonElement>this.confirmationDialog.getElementsByClassName('ok-button')[0];
      const cancelButton = <HTMLButtonElement>this.confirmationDialog.getElementsByClassName('cancel-button')[0];
      console.log('message', eventListener.message);
      okButton.onclick = (ev: Event) => {
        console.log('ok clicked');
        eventListener.onOk();
        this.confirmationDialog.style.display = 'none';
      };
      cancelButton.onclick = (ev: Event) => {
        console.log('cancel clicked');
        eventListener.onCancel();
        this.confirmationDialog.style.display = 'none';
      };
    });
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

  // public showDropMenu(id: number) {
  //   this.menu.forEach((item, index) => {
  //     let element = null;
  //     if (item.submenu) {
  //       element = document.getElementById('menuBox' + index);
  //     }
  //     if (element != null) {
  //
  //       if (id === index) {
  //         if (element.style.display === 'block') {
  //           element.style.display = 'none';
  //         } else {
  //           element.style.display = 'block';
  //         }
  //       } else {
  //         element.style.display = 'none';
  //       }
  //     }
  //   });
  // }

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
