import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppConstants } from "src/app/utils/app-constants";
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { EnvironmentConstants } from "src/app/utils/environment-constants";
import { HelperService } from "src/app/utils/helper.service";
import { LcpConstants } from "src/app/utils/lcp-constants";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { AlertDialogEvent } from "../utils/alert-dialog/alert-dialog.component";
import { EmailInterface } from "../utils/email/email.component";

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
  userType: string = ''; 

  // Modal properties for Server Config values
  serverName: string = null;
  dbName: string = null;
  fileSystemLinked: string = null;
  supportEmail: string = null;
  isEmailSendingActive: string = null;
  divertedEmailId: string = null;
  lastDeployedVersionAndDate: string = null;

  constructor(private helperService: HelperService,
              private utilityService: AppUtilityService,
              public router: Router) {
    this.userType = localStorage.getItem(LcpConstants.user_type_key);
    this.staticPageURl = EnvironmentConstants.PUBLIC_PAGES_URL;
    this.idleTime = 0;
    this.setActivityTimer();
    this.emailData = null; 
    this.parseMenu(); 
    this.getServerConfiguration();  
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem(LcpConstants.user_type_key);      
    if (!('Employee' === this.userType || 'Customer' === this.userType || 'Tutor' === this.userType)) {
      this.router.navigateByUrl('/public/login');
    }

    this.helperService.titleState.subscribe((title: string) => {
      this.title = title;
    }); 
  }

  ngAfterViewInit() {
  }

  public getServerConfiguration() {
    const formData = new URLSearchParams();
    this.utilityService.makerequest(this, this.onSuccessServerInfo, LcpRestUrls.server_info_url, 'POST', formData.toString(), 'application/x-www-form-urlencoded');
  }

  onSuccessServerInfo(context: any, response: any) {
    if (response['success']) {
      context.serverName = response['serverName'];
      context.dbName = response['dbName'];
      context.fileSystemLinked = response['fileSystemLinked'];
      context.supportEmail = response['supportEmail'];
      context.isEmailSendingActive = response['isEmailSendingActive'];
      context.divertedEmailId = response['divertedEmailId'];
      context.lastDeployedVersionAndDate = response['lastDeployedVersionAndDate'];
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: response['message'],
        onButtonClicked: () => {
        }
      };
      context.helperService.showAlertDialog(myListener);
    }
  }

  public parseMenu() {
    const formData = new URLSearchParams();
    this.utilityService.makerequest(this, this.onSuccessBasicInfo, LcpRestUrls.basic_info_url, 'POST', formData.toString(), 'application/x-www-form-urlencoded');
  }

  onSuccessBasicInfo(context: any, response: any) {
    if (response['success']) {
      context.username = response['username'];
      context.helperService.setTitle('Welcome ' + context.username);
      context.menu = response['menu'];
      context.accessOptions = response['accessoptions'];
      context.userMenu.push(
        {name: 'Personalize', url: '', functioncall: true},
        {name: 'Profile', url: '', functioncall: true},
        {name: 'Complaint Box', url: '', functioncall: true},
        {name: 'Help & Support', url: '', functioncall: true}
      );
  
      context.settingMenu.push({name: 'Change Password', url: '/user/changepassword', functioncall: false});
      if (context.accessOptions.impersonationaccess) {
        context.settingMenu.push({name: 'Impersonate', url: '', functioncall: true});
      }
      context.settingMenu.push(
        {name: 'User Settings', url: '', functioncall: true},
        {name: 'Sign Out', url: '', functioncall: true});
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: response['message'],
        onButtonClicked: () => {
        }
      };
      context.helperService.showAlertDialog(myListener);
    }
  }

  public functionCallMenuItem(itemName: string) {
    switch (itemName) {
      case 'Sign Out': {
        this.doLogout();
        break;
      }
      default : {
        const myListener: AlertDialogEvent = {
          isSuccess: false,
          message: itemName + ' - Does not have any action configured',
          onButtonClicked: () => {
          }
        };
        this.helperService.showAlertDialog(myListener);
      }
    }
  } 

  public showEmailDialog() {
    this.helperService.showEmailDialog();
  }

  public doLogout() {
    const formData = new URLSearchParams();
    this.utilityService.makerequest(this, this.onSuccessLogout, LcpRestUrls.logout_url, 'POST', formData.toString(), 'application/x-www-form-urlencoded');
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
