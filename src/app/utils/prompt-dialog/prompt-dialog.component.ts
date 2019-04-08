import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { CommonUtilityFunctions } from '../common-utility-functions';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.css']
})
export class PromptDialogComponent implements OnInit {

  showErrorMessage: boolean = false;
  hidePromptBox: boolean = true;
  promptTitle: string = '';
  placeHolderText: string = '';
  textSectionValue: string = '';
  isTextRequired: boolean = false;
  eventInterface: PromptDialogInterface = null;

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.helperService.promptDialogState.subscribe((eventInterface: PromptDialogInterface) => {
      CommonUtilityFunctions.logOnConsole(eventInterface);
      this.showErrorMessage = false;
      this.textSectionValue = '';
      this.promptTitle = CommonUtilityFunctions.checkStringAvailability(eventInterface.titleText) ? eventInterface.titleText : LcpConstants.prompt_dialog_title;
      this.placeHolderText = CommonUtilityFunctions.checkStringAvailability(eventInterface.placeholderText) ? eventInterface.placeholderText : LcpConstants.prompt_dialog_title;
      this.isTextRequired = eventInterface.required;
      this.eventInterface = eventInterface;
      this.hidePromptBox = false;
    });
  }

  onOk() {
    if (this.isTextRequired && !CommonUtilityFunctions.checkStringAvailability(this.textSectionValue)) {
      this.showErrorMessage = true;
    } else {
      this.eventInterface.onOk(this.textSectionValue);
      this.hidePromptBox = true;
    }
  }

  onCancel() {
    this.eventInterface.onCancel();
    this.hidePromptBox = true;
  }
}

export interface PromptDialogInterface {
  required: boolean;
  titleText: string;
  placeholderText: string;
  onOk(message: string): void;
  onCancel(): void;
}
