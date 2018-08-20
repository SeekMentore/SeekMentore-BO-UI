import { Component, OnInit } from '@angular/core';
import {HelperService} from '../utils/helper.service';
import {AppConstants} from '../utils/app-constants';

@Component({
  selector: 'app-non-login-pages',
  templateUrl: './non-login-pages.component.html',
  styleUrls: ['./non-login-pages.component.css']
})
export class NonLoginPagesComponent implements OnInit {

  title = 'Welcome To Seek Mentore';
  staticPageURl = AppConstants.PUBLIC_PAGES_URL;
  logoURL = AppConstants.IMAGE_SERVER + AppConstants.LOGO_PATH;

  constructor(private helperService: HelperService) {
  }

  ngOnInit(): void {
    this.helperService.titleState.subscribe((title: string) => {
      this.title = title;
    });
  }
}
