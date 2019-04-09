import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/utils/app-constants';
import { EnvironmentConstants } from 'src/app/utils/environment-constants';
import { HelperService } from 'src/app/utils/helper.service';

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
