import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper.service';
import { LcpConstants } from '../lcp-constants';
import { CommonUtilityFunctions } from '../common-utility-functions';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  hideConfirmBox: boolean = true;
  confirmTitle: string = '';
  confirmMessage: string = '';
  confirmMessagesList: string[] = [];
  isMultiMessage: boolean = false;
  eventInterface: ConfirmationDialogInterface = null;

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.helperService.confirmationDialogState.subscribe((eventInterface: ConfirmationDialogInterface) => {
      this.isMultiMessage = false;
      this.confirmMessagesList = [];
      this.confirmTitle = LcpConstants.confirmation_dialog_title;
      this.confirmMessage = CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(eventInterface.message);
      if (CommonUtilityFunctions.checkStringAvailability(this.confirmMessage)) {
        if (CommonUtilityFunctions.checkNonEmptyList(this.confirmMessage.split('\n'))) {
          let messageList: string[] = this.confirmMessage.split('\n');
          messageList.forEach((message) => {
            if (CommonUtilityFunctions.checkStringAvailability(message)) {
              this.confirmMessagesList.push(message);
            }
          });
          if (CommonUtilityFunctions.checkNonEmptyList(this.confirmMessagesList)) {
            this.isMultiMessage = true;
          }
        }
      }
      this.eventInterface = eventInterface;
      this.hideConfirmBox = false;
    });
  }

  onOk() {
    this.eventInterface.onOk();
    this.hideConfirmBox = true;
  }

  onCancel() {
    this.eventInterface.onCancel();
    this.hideConfirmBox = true;
  }
}

export interface ConfirmationDialogInterface {
  message: string;
  onOk(): void;
  onCancel(): void;
}

