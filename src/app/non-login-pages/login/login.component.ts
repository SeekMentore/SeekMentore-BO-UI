import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilityService } from '../../utils/app-utility.service';
import { HelperService } from '../../utils/helper.service';
import { LcpConstants } from '../../utils/lcp-constants';
import { NlpConstants } from '../../utils/nlp-constants';
import { NlpRestUrls } from '../../utils/nlp-rest-urls';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  userType: string = '';
  errorResponse: string;
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
    if (!CommonUtilityFunctions.checkStringAvailability(this.username)) {
      this.errorUsername = NlpConstants.enter_username;
      isValidData = false;
    }
    if (!CommonUtilityFunctions.checkStringAvailability(this.password)) {
      this.errorPassword = NlpConstants.enter_password;
      isValidData = false;
    }
    if (!CommonUtilityFunctions.checkStringAvailability(this.userType)) {
      this.errorUserType = NlpConstants.select_usertype;
      isValidData = false;
    }
    return isValidData;
  }

  resetErrorMessages() {
    this.errorResponse = null;
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
      context.errorResponse = response['message'];
      context.hideLoginFormLoaderMask();
    }
  }
}
