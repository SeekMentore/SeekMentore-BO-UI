import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper.service';
import { LcpConstants } from '../lcp-constants';
import { CommonUtilityFunctions } from '../common-utility-functions';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {

  hideAlertBox: boolean = true;
  isSuccess: boolean = true;
  alertTitle: string = '';
  alertMessage: string = '';
  alertMessagesList: string[] = [];
  isMultiMessage: boolean = false;
  eventInterface: AlertDialogInterface = null;

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.helperService.alertDialogState.subscribe((eventInterface: AlertDialogInterface) => {
      CommonUtilityFunctions.logOnConsole(eventInterface);
      this.isMultiMessage = false;
      this.alertMessagesList = [];
      if (eventInterface.isSuccess) {
        this.isSuccess = true;
        this.alertTitle = LcpConstants.success_alert_title;
      } else {
        this.isSuccess = false;
        this.alertTitle = LcpConstants.failure_alert_title;
      }
      this.alertMessage = CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(eventInterface.message);
      if (CommonUtilityFunctions.checkStringAvailability(this.alertMessage)) {
        if (CommonUtilityFunctions.checkNonEmptyList(this.alertMessage.split('\n'))) {
          let messageList: string[] = this.alertMessage.split('\n');
          messageList.forEach((message) => {
            if (CommonUtilityFunctions.checkStringAvailability(message)) {
              this.alertMessagesList.push(message);
            }
          });
          if (CommonUtilityFunctions.checkNonEmptyList(this.alertMessagesList)) {
            this.isMultiMessage = true;
          }
        }
      }
      this.eventInterface = eventInterface;
      this.hideAlertBox = false;
    });
  }

  onButtonClicked() {
    this.eventInterface.onButtonClicked();
    this.hideAlertBox = true;
  }
}

export interface AlertDialogInterface {
  isSuccess: boolean;
  message: string;
  onButtonClicked(): void;
}
