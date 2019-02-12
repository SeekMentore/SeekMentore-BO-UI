import { Component, OnInit } from '@angular/core';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { Router } from '@angular/router';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { BreadCrumbEvent } from '../bread-crumb/bread-crumb.component';

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

  constructor(private helperService: HelperService, private utilityService: AppUtilityService, private router: Router) {
  }

  ngOnInit() {
    this.resetErrorMessages();
    const breadCrumb: BreadCrumbEvent = {
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    };
    this.helperService.setBreadCrumb(breadCrumb);
  }

  changePassword() {
    if (this.isValidFormData() === false) {
      return;
    }
    const formData = new URLSearchParams();
    formData.set('oldPassword', this.oldPassword);
    formData.set('newPassword', this.newPassword);
    formData.set('retypeNewPassword', this.retypeNewPassword);
    this.utilityService.makerequest(this, this.onSuccess, LcpRestUrls.change_password_url, 'POST', formData.toString(),
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
