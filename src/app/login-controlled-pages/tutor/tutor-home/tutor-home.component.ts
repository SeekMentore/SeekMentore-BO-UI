import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/utils/helper.service';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { Router } from '@angular/router';
import { BreadCrumbEvent } from '../../bread-crumb/bread-crumb.component';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';

@Component({
  selector: 'app-tutor-home',
  templateUrl: './tutor-home.component.html',
  styleUrls: ['./tutor-home.component.css']
})
export class TutorHomeComponent implements OnInit {

  constructor(private helperService: HelperService, private utilityService: AppUtilityService, private router: Router) {
  }

  ngOnInit() {
    const breadCrumb: BreadCrumbEvent = {
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    };
    this.helperService.setBreadCrumb(breadCrumb);   
  }

}
