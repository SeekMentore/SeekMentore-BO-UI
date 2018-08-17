import {Component, OnInit} from '@angular/core';
import {HelperService} from '../../utils/helper.service';
import {AppUtilityService} from '../../utils/app-utility.service';
import {AppConstants} from '../../utils/app-constants';
import {LoginConstants} from '../../utils/login-constants';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username;
  password;
  userType = 'Blank';
  error = '';

  constructor(private helperService: HelperService, private utilityService: AppUtilityService, private router: Router) {
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
    this.utilityService.makeRequest(AppConstants.loginURL, 'POST', formData.toString(),
      'application/x-www-form-urlencoded').subscribe(result => {
      let response = result['response'];
      response = this.utilityService.decodeObjectFromJSON(response);
      if (response != null) {
        if (response['success'] === true) {
          // window.location.href = result['redirectTo'];
          this.router.navigateByUrl('/lp');
        } else {
          this.error = response['message'];
        }
      }

    }, error => {
    });
  }

  isValidLoginData(): boolean {
    let errorMessage = null;
    if (!this.username || this.username === '') {
      errorMessage = LoginConstants.enter_username;
    } else if (!this.password || this.password === '') {
      errorMessage = LoginConstants.enter_password;
    } else if (!this.userType || this.userType === 'Blank' || this.userType === '') {
      errorMessage = LoginConstants.select_usertype;
    }

    if (errorMessage != null) {
      this.error = errorMessage;
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
