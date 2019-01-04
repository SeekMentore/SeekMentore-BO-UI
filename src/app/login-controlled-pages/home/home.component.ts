import { Component, OnInit } from '@angular/core';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/utils/helper.service';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { BreadCrumbEvent } from '../bread-crumb/bread-crumb.component';

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
    const breadCrumb: BreadCrumbEvent = {
      newCrumb: {
        label: 'Home',
        url: '/user/home',
        isLast: false,
        isActivated: true
      },
      newCrumbList: null,    
      resetCrumbList: false
    };
    this.helperService.setBreadCrumb(breadCrumb); 
    this.userType = localStorage.getItem(LcpConstants.user_type_key);    
  }
}
