import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  breadCrumbDiv: HTMLDivElement;
  crumbs: {
    label: string,
    url: string,
    isLast: boolean,
    isActivated: boolean
  }[] = [];

  constructor(private helperService: HelperService) { }

  ngOnInit() {
    this.breadCrumbDiv = <HTMLDivElement>document.getElementById('bread-crumb-main-div');
    this.helperService.breadCrumbState.subscribe((eventListener: BreadCrumbEvent) => {
      if (eventListener.resetCrumbList) {
        this.crumbs = [];
      }
      if (CommonUtilityFunctions.checkObjectAvailability(eventListener.newCrumbList)) {
        this.crumbs = this.crumbs.concat(eventListener.newCrumbList);
      }
      console.log(eventListener)
    });
  }

}

export interface BreadCrumbEvent {
  newCrumbList: {
    label: string,
    url: string,
    isLast: boolean,
    isActivated: boolean
  }[];
  resetCrumbList: boolean;
}
