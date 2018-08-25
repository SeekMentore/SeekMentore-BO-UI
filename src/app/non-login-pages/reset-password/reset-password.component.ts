import {Component, OnInit} from '@angular/core';
import {HelperService} from '../../utils/helper.service';
import {AppUtilityService} from '../../utils/app-utility.service';
import {NlpConstants} from '../../utils/nlp-constants';
import {NlpRestUrls} from '../../utils/nlp-rest-urls';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  username;
  userType = 'Blank';
  errorAjaxResponse: string;
  errorUsername: string;
  errorUserType: string;
  successMessage: string;

  constructor(private helperService: HelperService, private utilityService: AppUtilityService) {
    this.resetErrorMessages();
  }

  ngOnInit() {
    this.helperService.setTitle('Reset Password');
  }

  resetPassword() {
    if (this.isValidFormData() === false) {
      return;
    }
    const formData = new URLSearchParams();
    formData.set('userId', this.username);
    formData.set('userType', this.userType);

    this.utilityService.makeRequest(NlpRestUrls.resetPasswordURL, 'POST', formData.toString(),
      'application/x-www-form-urlencoded').subscribe(result => {


      let response = result['response'];
      response = this.utilityService.decodeObjectFromJSON(response);
      if (response != null) {
        if (response['success'] === true) {
          this.successMessage = response['message'];
        } else {
          this.errorAjaxResponse = response['message'];
        }
      }
    }, error => {

    });
  }

  isValidFormData(): boolean {
    let isValidData = true;
    this.resetErrorMessages();

    if (!this.username || this.username === '') {
      this.errorUsername = NlpConstants.enter_username;
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
    this.errorUserType = null;
    this.successMessage = null;
  }

}
