import { Component, OnInit } from '@angular/core';
import { AppUtilityService } from '../../utils/app-utility.service';
import { HelperService } from '../../utils/helper.service';
import { NlpConstants } from '../../utils/nlp-constants';
import { NlpRestUrls } from '../../utils/nlp-rest-urls';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  username: string;
  userType: string = '';
  errorResponse: string;
  errorUsername: string;
  errorUserType: string;
  successMessage: string;
  resetPasswordMaskLoaderHidden: boolean = true;

  constructor(private helperService: HelperService, private utilityService: AppUtilityService) {
    this.resetErrorMessages();
  }

  ngOnInit() {
    this.helperService.setTitle('Reset Password');
  }

  private showResetPasswordFormLoaderMask() {
    this.resetPasswordMaskLoaderHidden = false;
  }

  private hideResetPasswordFormLoaderMask() {
    this.resetPasswordMaskLoaderHidden = true;
  }

  resetPassword() {
    this.showResetPasswordFormLoaderMask();
    if (this.isValidFormData() === false) {
      this.hideResetPasswordFormLoaderMask();
      return;
    }
    const data = {
      userId: this.username,
      userType: this.userType
    };
    this.utilityService.makerequest(this, this.onSuccess, NlpRestUrls.reset_password_url, 'POST', 
      this.utilityService.urlEncodeData(data),
      'application/x-www-form-urlencoded');
  }

  onSuccess(context: any, response: any) {
    if (response['success'] === true) {
      context.successMessage = response['message'];
    } else {
      context.errorResponse = response['message'];
    }
    context.hideResetPasswordFormLoaderMask();
  }

  isValidFormData(): boolean {
    let isValidData = true;
    this.resetErrorMessages();
    if (!CommonUtilityFunctions.checkStringAvailability(this.username)) {
      this.errorUsername = NlpConstants.enter_username;
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
    this.errorUserType = null;
    this.successMessage = null;
  }
}
