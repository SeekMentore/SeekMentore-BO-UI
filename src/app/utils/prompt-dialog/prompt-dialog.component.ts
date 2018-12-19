import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/utils/helper.service';
import {LcpConstants} from 'src/app/utils/lcp-constants';
import { CommonUtilityFunctions } from '../common-utility-functions';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.css']
})
export class PromptDialogComponent implements OnInit {

  promptDialog: HTMLDivElement;
  showErrorMessage: boolean;

  constructor(private helperService: HelperService) {
  }

  ngOnInit() {
    this.promptDialog = <HTMLDivElement>document.getElementById('prompt-dialog');
    this.showErrorMessage = false;
    this.helperService.promptDialogState.subscribe((eventListener: PromptDialogInterface) => {
      this.showErrorMessage = false;
      const okButton = <HTMLButtonElement>this.promptDialog.getElementsByClassName('ok-button')[0];
      const cancelButton = <HTMLButtonElement>this.promptDialog.getElementsByClassName('cancel-button')[0];
      const inputElement = <HTMLInputElement>this.promptDialog.getElementsByClassName('textarea_field')[0];
      const titleElement = <HTMLSpanElement>this.promptDialog.getElementsByClassName('title')[0];
      inputElement.value = '';
      titleElement.innerText = CommonUtilityFunctions.checkStringAvailability(eventListener.titleText) ? eventListener.titleText : LcpConstants.prompt_dialog_title;
      inputElement.placeholder = CommonUtilityFunctions.checkStringAvailability(eventListener.placeholderText) ? eventListener.placeholderText : LcpConstants.prompt_dialog_title;
      inputElement.required = eventListener.required;
      okButton.onclick = (ev: Event) => {
        if (eventListener.required && inputElement.value.trim() === '') {
          this.showErrorMessage = true;
        } else {
          eventListener.onOk(inputElement.value);
          this.promptDialog.style.display = 'none';
        }
      };
      cancelButton.onclick = (ev: Event) => {
        eventListener.onCancel();
        this.promptDialog.style.display = 'none';
      };
      this.promptDialog.style.display = 'flex';
    });
  }

}

export interface PromptDialogInterface {
  required: boolean;
  titleText: string;
  placeholderText: string;

  onOk(message: string): void;

  onCancel(): void;
}
