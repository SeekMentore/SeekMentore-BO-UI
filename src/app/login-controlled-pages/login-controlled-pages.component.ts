import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppConstants } from "src/app/utils/app-constants";
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { EnvironmentConstants } from "src/app/utils/environment-constants";
import { AlertDialogEvent, ConfirmationDialogEvent, HelperService } from "src/app/utils/helper.service";
import { LcpConstants } from "src/app/utils/lcp-constants";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { EmailInterface } from "src/app/login-controlled-pages/email/create-email.component";

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
  emailData: EmailInterface;
  emailDialog: HTMLDivElement; 
  userType: string = ''; 

  constructor(private helperService: HelperService,
              private utilityService: AppUtilityService,
              public router: Router) {
    this.userType = localStorage.getItem(LcpConstants.user_type_key);
    this.staticPageURl = EnvironmentConstants.PUBLIC_PAGES_URL;
    this.idleTime = 0;
    this.setActivityTimer();
    this.emailData = null;    
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem(LcpConstants.user_type_key);      
    if (!('admin' === this.userType || 'customer' === this.userType || 'tutor' === this.userType)) {
      this.router.navigateByUrl('/public/login');
    }

    this.helperService.titleState.subscribe((title: string) => {
      this.title = title;
    });
    this.parseMenu(); 
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

  public showEmailDialog() {
    this.helperService.showEmailDialog();
  }

  public doLogout() {
    this.utilityService.makerequest(this, this.onSuccessLogout, LcpRestUrls.logoutUrl, 'POST');
  }

  onSuccessLogout(context: any, response: any) {
    if (response['success'] === true) {
      context.clearLocalStorageSession();
      context.router.navigateByUrl('/public/login');
    } else {
    }
  }

  public clearLocalStorageSession() {
    localStorage.setItem(LcpConstants.auth_token_key, null);
    localStorage.setItem(LcpConstants.user_type_key, null);
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
