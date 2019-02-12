import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { BreadCrumbEvent } from '../bread-crumb/bread-crumb.component';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userType: string = ''; 

  constructor(private helperService: HelperService, private utilityService: AppUtilityService, private router: Router) {
    this.userType = localStorage.getItem(LcpConstants.user_type_key);
  }

  ngOnInit() {
    this.userType = localStorage.getItem(LcpConstants.user_type_key); 
    const breadCrumb: BreadCrumbEvent = {
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    };
    this.helperService.setBreadCrumb(breadCrumb);   
  }
}
