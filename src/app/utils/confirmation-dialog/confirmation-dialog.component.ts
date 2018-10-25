import { Component, OnInit } from '@angular/core';
import { HelperService, ConfirmationDialogEvent } from '../helper.service';
import { LcpConstants } from '../lcp-constants';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  confirmationDialog: HTMLDivElement;

  constructor(private helperService: HelperService) { }

  ngOnInit() {
    this.confirmationDialog = <HTMLDivElement>document.getElementById('confirmation-dialog');
    this.helperService.confirmationDialogState.subscribe((eventListener: ConfirmationDialogEvent) => {
      const okButton = <HTMLButtonElement>this.confirmationDialog.getElementsByClassName('ok-button')[0];
      const cancelButton = <HTMLButtonElement>this.confirmationDialog.getElementsByClassName('cancel-button')[0];
      const messageElement = <HTMLSpanElement>this.confirmationDialog.getElementsByClassName('message')[0];
      const titleElement = <HTMLSpanElement>this.confirmationDialog.getElementsByClassName('title')[0];
      titleElement.innerText = LcpConstants.confirmation_dialog_title;
      messageElement.innerText = eventListener.message;
      okButton.onclick = (ev: Event) => {
        eventListener.onOk();
        this.confirmationDialog.style.display = 'none';
      };
      cancelButton.onclick = (ev: Event) => {
        eventListener.onCancel();
        this.confirmationDialog.style.display = 'none';
      };
      this.confirmationDialog.style.display = 'flex';
    });
  }

}
