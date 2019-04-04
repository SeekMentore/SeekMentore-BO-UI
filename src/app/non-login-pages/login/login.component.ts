import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilityService } from '../../utils/app-utility.service';
import { HelperService } from '../../utils/helper.service';
import { LcpConstants } from '../../utils/lcp-constants';
import { NlpConstants } from '../../utils/nlp-constants';
import { NlpRestUrls } from '../../utils/nlp-rest-urls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  userType: string = '';
  errorAjaxResponse: string;
  errorUsername: string;
  errorPassword: string;
  errorUserType: string;
  loginFormMaskLoaderHidden: boolean = true;

  constructor(private helperService: HelperService, private utilityService: AppUtilityService, private router: Router) {
    this.resetErrorMessages();
  }

  ngOnInit() {
    this.helperService.setTitle('Login');
    this.userType = localStorage.getItem(LcpConstants.user_type_key);
    if ('admin' === this.userType || 'customer' === this.userType || 'tutor' === this.userType) {
      this.router.navigateByUrl('/user/home');
    } else {
      this.userType = '';
    }
  }

  private showLoginFormLoaderMask() {
    this.loginFormMaskLoaderHidden = false;
  }

  private hideLoginFormLoaderMask() {
    this.loginFormMaskLoaderHidden = true;
  }

  login() {
    this.showLoginFormLoaderMask();
    if (this.isValidLoginData() === false) {
      this.hideLoginFormLoaderMask();
      return;
    }
    const data = {
      userId: this.username,
      password: this.password,
      userType: this.userType
    };
    this.utilityService.makerequest(this, this.onSuccess, NlpRestUrls.login_url, 'POST',
      this.utilityService.urlEncodeData(data),
      'application/x-www-form-urlencoded');
  }

  isValidLoginData(): boolean {
    let isValidData = true;
    this.resetErrorMessages();
    if (!this.username || this.username === '') {
      this.errorUsername = NlpConstants.enter_username;
      isValidData = false;
    }
    if (!this.password || this.password === '') {
      this.errorPassword = NlpConstants.enter_password;
      isValidData = false;
    }
    if (!this.userType || this.userType === 'Blank' || this.userType === '') {
      this.errorUserType = NlpConstants.select_usertype;
      isValidData = false;
    }
    return isValidData;
  }

  resetErrorMessages() {
    this.errorAjaxResponse = null;
    this.errorUsername = null;
    this.errorPassword = null;
    this.errorUserType = null;
  }

  onSuccess(context: any, response: any) {
    if (response['success'] === true) {
      context.hideLoginFormLoaderMask();
      localStorage.setItem(LcpConstants.user_type_key, context.userType);
      context.router.navigateByUrl('/user/home');
    } else {
      context.errorAjaxResponse = response['message'];
      context.hideLoginFormLoaderMask();
    }
  }

  checkAlertSuccess() {
    this.helperService.showAlertDialog({
      isSuccess: true,
      message: 'This is alert success',
      onButtonClicked: () => {
        //this.checkConfirm();
      }
    });
  }

  checkAlertFailure() {
    this.helperService.showAlertDialog({
      isSuccess: false,
      message: 'This is alert failure',
      onButtonClicked: () => {
        //this.checkPrompt();
      }
    });
  }

  checkPrompt() {
    this.helperService.showPromptDialog({
      required: true,
      titleText: 'Prompt title',
      placeholderText: 'Prompt place holder',
      onOk: (message) => {
        alert(message)
        //this.checkAlertSuccess();
      },
      onCancel: () => {
        //this.checkConfirm();
      }
    });
  }

  checkConfirm() {
    this.helperService.showConfirmationDialog({
      message: 'This is confirm box',
      onOk: () => {
        this.checkAlertSuccess();
      },
      onCancel: () => {
        this.checkAlertFailure();
      }
    });
  }
}
