import {Component, OnInit} from '@angular/core';
import {HelperService} from '../../utils/helper.service';
import {AppUtilityService} from '../../utils/app-utility.service';
import {AppConstants} from '../../utils/app-constants';
import {LoginConstants} from '../../utils/login-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  username;
  userType = 'Blank';
  errorMessage = '';
  successMessage = '';

  constructor(private helperService: HelperService, private utilityService: AppUtilityService) {
  }

  ngOnInit() {
  }

  resetPassword() {
    if (this.isValidFormData() === false) {
      return;
    }
    const formData = new URLSearchParams();
    formData.set('userId', this.username);
    formData.set('userType', this.userType);

    this.utilityService.makeRequest(AppConstants.resetPasswordURL, 'POST', formData.toString(),
      'application/x-www-form-urlencoded').subscribe(result => {


      let response = result['response'];
      response = this.utilityService.decodeObjectFromJSON(response);
      if (response != null) {
        if (response['success'] === true) {
          this.successMessage = response['message'];
        } else {
          this.errorMessage = response['message'];
        }
      }
    }, error => {

    });
  }

  isValidFormData(): boolean {
    let errorMessage = null;
    if (!this.username || this.username === '') {
      errorMessage = LoginConstants.enter_username;
    } else if (!this.userType || this.userType === 'Blank' || this.userType === '') {
      errorMessage = LoginConstants.select_usertype;
    }

    if (errorMessage != null) {
      this.errorMessage = errorMessage;
      return false;
    } else {
      this.errorMessage = '';
      return true;
    }
  }

}
