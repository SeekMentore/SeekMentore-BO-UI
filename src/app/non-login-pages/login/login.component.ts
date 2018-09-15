import {Component, OnInit} from '@angular/core';
import {HelperService} from '../../utils/helper.service';
import {AppUtilityService} from '../../utils/app-utility.service';
import {NlpConstants} from '../../utils/nlp-constants';
import {Router} from '@angular/router';
import {NlpRestUrls} from '../../utils/nlp-rest-urls';
import {LcpConstants} from "../../utils/lcp-constants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username;
  password;
  userType = 'Blank';
  errorAjaxResponse: string;
  errorUsername: string;
  errorPassword: string;
  errorUserType: string;

  constructor(private helperService: HelperService, private utilityService: AppUtilityService, private router: Router) {
    this.resetErrorMessages();
  }

  ngOnInit() {
    this.helperService.setTitle('Login');
  }

  login() {
    if (this.isValidLoginData() === false) {
      return;
    }
    const formData = new URLSearchParams();
    formData.set('userId', this.username);
    formData.set('password', this.password);
    formData.set('userType', this.userType);
    this.utilityService.makerequest(this, this.onSuccess, NlpRestUrls.loginURL, 'POST', formData.toString(),
      'application/x-www-form-urlencoded');
    //   .subscribe(result => {
    //   let response = result['response'];
    //   response = this.utilityService.decodeObjectFromJSON(response);
    //   if (response != null) {
    //     if (response['success'] === true) {
    //       // window.location.href = result['redirectTo'];
    //       this.router.navigateByUrl('/lp');
    //     } else {
    //       this.errorAjaxResponse = response['message'];
    //     }
    //   }
    //
    // }, error => {
    // });
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
      // window.location.href = result['redirectTo'];
      const authToken = response['clientAuthToken'];
      localStorage.setItem(LcpConstants.auth_token_key, authToken);
      context.router.navigateByUrl('/lp');
    } else {
      context.errorAjaxResponse = response['message'];
    }
  }
}
