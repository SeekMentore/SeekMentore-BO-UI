import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  crumbs: {
    label: string,
    url: string,
    isLast: boolean,
    isActivated: boolean
  }[] = [];

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.helperService.breadCrumbState.subscribe((eventInterface: BreadCrumbInterface) => {
      if (eventInterface.resetCrumbList) {
        this.crumbs = [];
      }
      if (CommonUtilityFunctions.checkObjectAvailability(eventInterface.newCrumbList)) {
        this.crumbs = this.crumbs.concat(eventInterface.newCrumbList);
      }
    });
  }
}

export interface BreadCrumbInterface {
  newCrumbList: {
    label: string,
    url: string,
    isLast: boolean,
    isActivated: boolean
  }[];
  resetCrumbList: boolean;
}
