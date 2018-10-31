import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { SubscriptionDataAccess } from '../subscription-requested.component';

@Component({
  selector: 'app-subscription-data',
  templateUrl: './subscription-data.component.html',
  styleUrls: ['./subscription-data.component.css']
})
export class SubscriptionDataComponent implements OnInit {

  @Input()
  subscriptionRecord: GridRecord = null;

  @Input()
  subscriptionDataAccess: SubscriptionDataAccess = null;

  constructor() { }

  ngOnInit() {
  }

}
