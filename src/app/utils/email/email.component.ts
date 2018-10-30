import { Component, OnInit, OnChanges, Input, SimpleChange } from '@angular/core';
import { LcpConstants } from '../lcp-constants';
import { AppUtilityService } from '../app-utility.service';
import { HelperService } from '../helper.service';
import { LcpRestUrls } from '../lcp-rest-urls';
import { CkeditorConfig } from '../ckeditor-config';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit, OnChanges {

  title = LcpConstants.email_dialog_title;
  attachments: File[] = [];
  emailTemplatesArray: EmailTemplateInterface[];
  filteredTemplateArray: EmailTemplateInterface[];
  defaultValueEmailTemplate: EmailTemplateInterface;
  selectedEmailTemplate: EmailTemplateInterface;
  emailData: EmailInterface;
  allowedFileTypes = LcpConstants.email_attachment_allowed_types;

  emailBodyEditorId = 'email_body';

  @Input('emailData')
  receivedEmailData: EmailInterface = null;

  constructor(public utilityService: AppUtilityService, public helperService: HelperService) {
    this.setDefaultData();
  }

  ngOnInit() {
    this.helperService.makeRichEditor(this.emailBodyEditorId, CkeditorConfig.emailConfiguration);
    this.helperService.setDataForRichEditor(this.emailBodyEditorId, '');
    this.utilityService.makerequest(this, this.onSuccessEmailTemplates, LcpRestUrls.emailTemplatesUrl, 'POST');
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      if (propName === 'receivedEmailData' && changedProp.currentValue !== null) {
        this.emailData = changedProp.currentValue;
      }
    }
  }

  removeAttachment(i: number) {
    this.attachments.splice(i, 1);
  }

  onSuccessEmailTemplates(context: any, response: any) {
    context.emailTemplatesArray = response['emailTemplates'];
    context.filteredTemplateArray = context.emailTemplatesArray;
  }

  onAttachmentSelected(event) {
    if ((<any>event.target).files.length > LcpConstants.email_attachments_max_number) {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: LcpConstants.email_attachments_number_error,
        onButtonClicked: () => {
        }
      });
      return;
    }

    for (const attachment of (<any>event.target).files) {
      let totalSize = 0; // in KB
      const attachmentsNumber = this.attachments.length;
      let errorMessage = null;
      this.attachments.forEach((value2 => {
        totalSize = totalSize + value2.size / 1024;
      }));
      totalSize += attachment.size / 1024;
      if (totalSize > LcpConstants.email_attachemnts_max_size_MB * 1024) {
        errorMessage = LcpConstants.email_attachment_size_error;
      } else if (attachmentsNumber >= LcpConstants.email_attachments_max_number) {
        errorMessage = LcpConstants.email_attachments_number_error;
      }
      if (errorMessage !== null) {
        this.helperService.showAlertDialog({
          isSuccess: false,
          message: errorMessage,
          onButtonClicked: () => {
          }
        });
        break;
      } else {
        this.attachments.push(attachment);
      }
    }
    (<any>event.target).value = '';
  }

  emailTemplateSelected(emailTemplate: EmailTemplateInterface) {
    this.toggleDropDown();
    let dataExists = false;
    for (const key in this.emailData) {
      const value = this.emailData[key];
      if (key === 'to') {
        continue;
      }
      if (value !== '' && value !== null) {
        dataExists = true;
        break;
      }
    }
    if (dataExists) {
      this.helperService.showConfirmationDialog({
        message: LcpConstants.replace_email_data,
        onOk: () => {
          this.selectedEmailTemplate = emailTemplate;
          this.loadEmailDataFromServer(this.selectedEmailTemplate.value);
        },
        onCancel: () => {
        }
      });
    } else {
      this.selectedEmailTemplate = emailTemplate;
      this.loadEmailDataFromServer(this.selectedEmailTemplate.value);
    }

  }

  loadEmailDataFromServer(templateValue: string) {
    if (templateValue === this.defaultValueEmailTemplate.value) {
      this.setDefaultData();
      this.helperService.setDataForRichEditor(this.emailBodyEditorId, '');
      return;
    }
    const formData = new URLSearchParams();
    formData.set('templateId', templateValue);
    this.utilityService.makerequest(this, this.onSuccessTemplateData, LcpRestUrls.emailTemplateDataUrl, 'POST', formData.toString(),
      'application/x-www-form-urlencoded');
  }

  onSuccessTemplateData(context: any, response: any) {
    context.emailData = response;
    context.helperService.setDataForRichEditor(context.emailBodyEditorId, context.emailData.body);
  }

  hideDialog() {
    if (this.isFormDirty()) {
      this.helperService.showConfirmationDialog({
        message: LcpConstants.email_dismiss_data_exists_error,
        onOk: () => {
          this.setDefaultData();
          this.helperService.setDataForRichEditor(this.emailBodyEditorId, '');
          this.helperService.hideEmailDialog();
        },
        onCancel: () => {
        }
      });
    } else {
      this.setDefaultData();
      this.helperService.setDataForRichEditor(this.emailBodyEditorId, '');
      this.helperService.hideEmailDialog();

    }
  }

  isFormDirty(): boolean {
    let isDataEntered = false;
    for (const key in this.emailData) {
      if (this.emailData[key].trim() !== '') {
        isDataEntered = true;
      }
    }
    if (!isDataEntered && this.helperService.getDataFromRichEditor(this.emailBodyEditorId) !== '') {
      isDataEntered = true;
    }
    return isDataEntered;
  }

  sendEmail() {
    const formData = new FormData();
    this.emailData.body = this.helperService.getDataFromRichEditor(this.emailBodyEditorId);
    this.emailData.body.trim();

    for (const key in this.emailData) {
      formData.append(key, this.emailData[key]);
    }
    const inputFilesNames = ['inputFile1', 'inputFile2', 'inputFile3', 'inputFile4'];

    for (let i = 0; i < this.attachments.length; i++) {
      if (i >= 4) {
        break;
      }
      formData.append(inputFilesNames[i], this.attachments[i]);
    }
    this.utilityService.makerequest(this, this.onSuccessEmailSent, LcpRestUrls.sendMailUrl, 'POST', formData,
      'multipart/form-data', true);
  }

  onSuccessEmailSent(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
        context.setDefaultData();
        context.helperService.setDataForRichEditor(context.emailBodyEditorId, '');
      }
    });
  }

  setDefaultData() {
    this.attachments = [];
    this.defaultValueEmailTemplate = {
      label: 'Select E-mail template',
      value: '-1'
    };
    this.selectedEmailTemplate = this.defaultValueEmailTemplate;
    this.emailData = {
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: ''
    };
  }

  getDataForTemplate(response_handler: any, value: string) {
    const formData = new URLSearchParams();
    formData.set('templateId', value);
    return this.utilityService.makerequest(this, response_handler, LcpRestUrls.emailTemplateDataUrl, 'POST', formData.toString(),
      'application/x-www-form-urlencoded');
  }

  hideDropDownListener = (event) => {
    this.toggleDropDown();
  }

  toggleDropDown() {
    const element = document.getElementById('email_template_dropdown');
    element.classList.toggle('show');
    if (element.classList.contains('show')) {
      window.addEventListener('click', this.hideDropDownListener);
    } else {
      window.removeEventListener('click', this.hideDropDownListener);
    }
  }

  searchTemplate(query) {
    console.log(query, event);
    this.filteredTemplateArray = [];
    for (const element of this.emailTemplatesArray) {
      if (element.label.toLowerCase().includes(query.toLowerCase())) {
        this.filteredTemplateArray.push(element);
      }
    }
  }
}

export interface EmailTemplateInterface {
  label: string;
  value: string;
}

export interface EmailInterface {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
}
