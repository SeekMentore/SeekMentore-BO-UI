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
  tokenId: string;
  errorAjaxResponse: string;
  successMessage: string;
  errorNewPassword: string;
  errorRetypeNewPassword: string;
  newPassword: string;
  retypeNewPassword: string;

  constructor(private helperService: HelperService, private route: ActivatedRoute, private utilityService: AppUtilityService) {
    this.route.params.subscribe(params => {  
      this.tokenId = params['tokenId'];
      this.token = params['token'];
    });
  }

  ngOnInit() {
    this.helperService.setTitle('Reset Password');
    this.resetErrorMessages();
  }

  changePassword() {
    if (this.isValidFormData() === false) {
      return;
    }
    const formData = new URLSearchParams();
    formData.set('tokenId', this.tokenId);
    formData.set('token', this.token);
    formData.set('newPassword', this.newPassword);
    formData.set('retypeNewPassword', this.retypeNewPassword);
    this.utilityService.makerequest(this, this.onSuccess, NlpRestUrls.forgot_password_token_change_url, 'POST', formData.toString(),
      'application/x-www-form-urlencoded');
  }

  onSuccess(context: any, response: any) {
    if (response['success'] === true) {
      context.successMessage = CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']);
      context.newPassword = '';
      context.retypeNewPassword = '';
    } else {
      context.errorAjaxResponse = CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']);
    }
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
    this.errorAjaxResponse = null;
    this.successMessage = null;
    this.errorNewPassword = null;
    this.errorNewPassword = null;
    this.errorRetypeNewPassword = null;
  }

}
