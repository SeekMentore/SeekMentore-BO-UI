import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { SubscriptionPackageDataAccess } from '../subscription-packages.component';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';

@Component({
  selector: 'app-subscription-package-data',
  templateUrl: './subscription-package-data.component.html',
  styleUrls: ['./subscription-package-data.component.css']
})
export class SubscriptionPackageDataComponent implements OnInit {

  @Input()
  subscriptionPackageRecord: GridRecord = null;

  @Input()
  subscriptionPackageDataAccess: SubscriptionPackageDataAccess = null;

  @Input()
  selectedRecordGridType: string = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { }

  ngOnInit() {
  }

}
