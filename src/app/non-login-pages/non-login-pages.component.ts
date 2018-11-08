import {Component, OnInit} from '@angular/core';
import {HelperService} from '../utils/helper.service';
import {AppConstants} from '../utils/app-constants';
import {EnvironmentConstants} from '../utils/environment-constants';

@Component({
  selector: 'app-non-login-pages',
  templateUrl: './non-login-pages.component.html',
  styleUrls: ['./non-login-pages.component.css']
})
export class NonLoginPagesComponent implements OnInit {

  title = EnvironmentConstants.APPLICATION_NAME;
  staticPageURl = EnvironmentConstants.PUBLIC_PAGES_URL;
  logoURL = EnvironmentConstants.IMAGE_SERVER + AppConstants.LOGO_PATH;

  constructor(private helperService: HelperService) {
  }

  ngOnInit(): void {
    this.helperService.titleState.subscribe((title: string) => {
      this.title = title;
    });
  }
}
