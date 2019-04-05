import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/utils/helper.service';
import { ActivatedRoute } from '@angular/router';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { NlpConstants } from 'src/app/utils/nlp-constants';
import { NlpRestUrls } from 'src/app/utils/nlp-rest-urls';

@Component({
  selector: 'app-forgot-password-token-reset',
  templateUrl: './forgot-password-token-reset.component.html',
  styleUrls: ['./forgot-password-token-reset.component.css']
})
export class ForgotPasswordTokenResetComponent implements OnInit {

  token: string;
  tokenSerialId: string;
  errorResponse: string;
  successMessage: string;
  errorNewPassword: string;
  errorRetypeNewPassword: string;
  newPassword: string;
  retypeNewPassword: string;
  forgotPasswordMaskLoaderHidden: boolean = true;

  constructor(private helperService: HelperService, private route: ActivatedRoute, private utilityService: AppUtilityService) {
    this.route.params.subscribe(params => {  
      this.tokenSerialId = params['tokenSerialId'];
      this.token = params['token'];
    });
  }

  ngOnInit() {
    this.helperService.setTitle('Reset Password');
    this.resetErrorMessages();
  }

  private showForgotPasswordFormLoaderMask() {
    this.forgotPasswordMaskLoaderHidden = false;
  }

  private hideForgotPasswordFormLoaderMask() {
    this.forgotPasswordMaskLoaderHidden = true;
  }

  changePassword() {
    this.showForgotPasswordFormLoaderMask();
    if (this.isValidFormData() === false) {
      this.hideForgotPasswordFormLoaderMask();
      return;
    }
    const data = {
      tokenSerialId: this.tokenSerialId,
      token: this.token,
      newPassword: this.newPassword,
      retypeNewPassword: this.retypeNewPassword
    };   
    this.utilityService.makerequest(this, this.onSuccess, NlpRestUrls.forgot_password_token_change_url, 'POST', 
      this.utilityService.urlEncodeData(data),
      'application/x-www-form-urlencoded');
  }

  onSuccess(context: any, response: any) {
    if (response['success'] === true) {
      context.successMessage = CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']);
      context.newPassword = '';
      context.retypeNewPassword = '';
    } else {
      context.errorResponse = CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']);
    }
    context.hideForgotPasswordFormLoaderMask();
  }

  isValidFormData(): boolean {
    let isValidData = true;
    this.resetErrorMessages();
    if (!CommonUtilityFunctions.checkStringAvailability(this.newPassword)) {
      this.errorNewPassword = NlpConstants.enter_new_password;
      isValidData = false;
    }
    if (!CommonUtilityFunctions.checkStringAvailability(this.retypeNewPassword)) {
      this.errorRetypeNewPassword = NlpConstants.enter_retype_new_password;
      isValidData = false;
    }
    return isValidData;
  }

  resetErrorMessages() {
    this.errorResponse = null;
    this.successMessage = null;
    this.errorNewPassword = null;
    this.errorNewPassword = null;
    this.errorRetypeNewPassword = null;
  }
}
