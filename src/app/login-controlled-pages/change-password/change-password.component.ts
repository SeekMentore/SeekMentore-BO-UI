import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  errorAjaxResponse: string;
  successMessage: string;
  errorOldPassword: string;
  errorNewPassword: string;
  errorRetypeNewPassword: string;
  oldPassword: string;
  newPassword: string;
  retypeNewPassword: string;
  changePasswordMaskLoaderHidden: boolean = true;

  constructor(private helperService: HelperService, private utilityService: AppUtilityService, private router: Router) {
    this.resetErrorMessages();
  }

  ngOnInit() {
    this.resetErrorMessages();
    this.helperService.setBreadCrumb({
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    });
  }

  private showResetPasswordFormLoaderMask() {
    this.changePasswordMaskLoaderHidden = false;
  }

  private hideResetPasswordFormLoaderMask() {
    this.changePasswordMaskLoaderHidden = true;
  }

  changePassword() {
    this.showResetPasswordFormLoaderMask();
    if (this.isValidFormData() === false) {
      this.hideResetPasswordFormLoaderMask();
      return;
    }
    const data = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      retypeNewPassword: this.retypeNewPassword
    };
    this.utilityService.makerequest(this, this.onSuccess, LcpRestUrls.change_password_url, 'POST', this.utilityService.urlEncodeData(data),
      'application/x-www-form-urlencoded');
  }

  isValidFormData(): boolean {
    let isValidData = true;
    this.resetErrorMessages();
    if (!CommonUtilityFunctions.checkStringAvailability(this.oldPassword)) {
      this.errorOldPassword = LcpConstants.enter_old_password;
      isValidData = false;
    }
    if (!CommonUtilityFunctions.checkStringAvailability(this.newPassword)) {
      this.errorNewPassword = LcpConstants.enter_new_password;
      isValidData = false;
    }
    if (!CommonUtilityFunctions.checkStringAvailability(this.retypeNewPassword)) {
      this.errorRetypeNewPassword = LcpConstants.enter_retype_new_password;
      isValidData = false;
    }
    return isValidData;
  }

  onSuccess(context: any, response: any) {
    if (response['success'] === true) {
      context.successMessage = CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']);
      context.oldPassword = '';
      context.newPassword = '';
      context.retypeNewPassword = '';
    } else {
      context.errorAjaxResponse = CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']);
    }
    context.hideResetPasswordFormLoaderMask();
  }

  resetErrorMessages() {
    this.errorAjaxResponse = null;
    this.successMessage = null;
    this.errorOldPassword = null;
    this.errorNewPassword = null;
    this.errorNewPassword = null;
    this.errorRetypeNewPassword = null;
  }
}
