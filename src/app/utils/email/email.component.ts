import { Component, OnInit } from '@angular/core';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AppUtilityService } from '../app-utility.service';
import { CkeditorConfig } from '../ckeditor-config';
import { CommonUtilityFunctions } from '../common-utility-functions';
import { HelperService } from '../helper.service';
import { LcpConstants } from '../lcp-constants';
import { LcpRestUrls } from '../lcp-rest-urls';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  title = LcpConstants.email_dialog_title;
  hideEmailPopup: boolean = true;
  hideEmailTemplateDropdownValues: boolean = true;
  emailInterface: EmailInterface = null;
  selectedEmailTemplate: EmailTemplateInterface;
  defaultEmailTemplate: EmailTemplateInterface;
  attachments: File[] = [];
  emailTemplateList: EmailTemplateInterface[];
  filteredEmailTemplateList: EmailTemplateInterface[];
  emailFormMaskLoaderHidden: boolean = true;

  emailBodyEditorId = 'email_body'; 

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  constructor(public utilityService: AppUtilityService, public helperService: HelperService) {
    this.setDefaultData();
    this.getEmailTemplates();
  }

  ngOnInit() {
    CommonUtilityFunctions.makeRichEditor(this.emailBodyEditorId, CkeditorConfig.emailConfiguration);
    CommonUtilityFunctions.setDataForRichEditor(this.emailBodyEditorId, '');
    this.helperService.emailDialogState.subscribe((emailInterface: EmailInterface) => {
      if (CommonUtilityFunctions.checkObjectAvailability(emailInterface)) {
        this.emailInterface = emailInterface;
        if (CommonUtilityFunctions.checkStringAvailability(emailInterface.body)) {
          CommonUtilityFunctions.setDataForRichEditor(this.emailBodyEditorId, emailInterface.body);
        }
        this.hideEmailPopup = false;
      }
    });
  }

  showEmailFormLoader() {
    this.emailFormMaskLoaderHidden = false;
  }

  hideEmailFormLoader() {
    this.emailFormMaskLoaderHidden = true;
  }

  setDefaultData() {
    this.attachments = [];
    this.defaultEmailTemplate = {
      label: '-Select E-mail template-',
      value: ''
    };
    this.selectedEmailTemplate = this.defaultEmailTemplate;
    this.emailInterface = {
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: ''
    };
  }

  openAttachmentSelector() {
    document.getElementById('select_attachments').click();
  }

  onAttachmentSelected(event: any) {
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
      if (this.attachments.length >= LcpConstants.email_attachments_max_number) {
        this.helperService.showAlertDialog({
          isSuccess: false,
          message: LcpConstants.email_attachments_number_error,
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

  removeAttachment(i: number) {
    this.attachments.splice(i, 1);
  }

  getEmailTemplates() {
    const formData = new URLSearchParams();
    this.utilityService.makerequest(this, this.onGetEmailTemplates, LcpRestUrls.get_email_templates_url, 
                                    'POST', formData.toString(), 'application/x-www-form-urlencoded');
  } 

  onGetEmailTemplates(context: any, response: any) {
    context.emailTemplateList = response['emailTemplates'];
    context.filteredEmailTemplateList = response['emailTemplates'];
  }

  selectedTemplateClicked(event: any) {
    event.stopPropagation(); 
    this.toggleDropDown();
  }

  toggleDropDown() {
    if (this.hideEmailTemplateDropdownValues) {
      this.hideEmailTemplateDropdownValues = false;
      window.addEventListener('click', this.hideDropDownListener);
    } else {
      this.hideEmailTemplateDropdownValues = true;
      window.removeEventListener('click', this.hideDropDownListener);
    }
  }

  hideDropDownListener = () => {
    this.toggleDropDown();
  }

  searchTemplateClicked(event: any) {
    event.stopPropagation();
  }

  searchTemplateChanged(event: any) {
    let query: string = event.target.value;
    this.filteredEmailTemplateList = [];
    for (const element of this.emailTemplateList) {
      if (element.label.toLowerCase().includes(query.toLowerCase())) {
        this.filteredEmailTemplateList.push(element);
      }
    }
  }

  selectEmailTemplate(event: any, emailTemplate: EmailTemplateInterface) {
    event.stopPropagation();
    if (CommonUtilityFunctions.checkObjectAvailability(emailTemplate)) {
      this.emailTemplateSelected(emailTemplate);
    } else {
      this.emailTemplateSelected(this.defaultEmailTemplate);
    }
  }

  isEmailFormDirty(): boolean {
    let isDataEntered: boolean = false;
    if (CommonUtilityFunctions.checkStringAvailability(this.emailInterface.to)
        || CommonUtilityFunctions.checkStringAvailability(this.emailInterface.cc)
        || CommonUtilityFunctions.checkStringAvailability(this.emailInterface.bcc)
        || CommonUtilityFunctions.checkStringAvailability(this.emailInterface.subject)
        || CommonUtilityFunctions.checkStringAvailability(this.emailInterface.body)
        || CommonUtilityFunctions.checkStringAvailability(CommonUtilityFunctions.getDataFromRichEditor(this.emailBodyEditorId))
    ) {
      isDataEntered = true;
    }
    return isDataEntered;
  }

  emailTemplateSelected(emailTemplate: EmailTemplateInterface) {
    this.toggleDropDown();
    if (this.isEmailFormDirty()) {
      this.helperService.showConfirmationDialog({
        message: LcpConstants.replace_email_data,
        onOk: () => {
          this.loadEmailTemplate(emailTemplate);
        },
        onCancel: () => {
        }
      });
    } else {
      this.loadEmailTemplate(emailTemplate);
    }
  }

  private loadEmailTemplate(emailTemplate: EmailTemplateInterface) {
    this.showEmailFormLoader();
    this.selectedEmailTemplate = emailTemplate;
    this.loadEmailTemplateData(emailTemplate.value);
  }

  loadEmailTemplateData(templateValue: string) {
    if (CommonUtilityFunctions.checkStringAvailability(templateValue)) {
      const formData = new URLSearchParams();
      formData.set('templateId', templateValue);
      this.utilityService.makerequest(this, this.onLoadEmailTemplateData, LcpRestUrls.email_template_data_url, 
                                      'POST', formData.toString(), 'application/x-www-form-urlencoded');
    } else {
      this.setDefaultData();
      CommonUtilityFunctions.setDataForRichEditor(this.emailBodyEditorId, '');
      this.hideEmailFormLoader();
    }
  }

  onLoadEmailTemplateData(context: any, response: any) {
    if (response['success']) {
      let emailTemplate = response['emailTemplate'];
      context.emailInterface['to'] = emailTemplate['to'];
      context.emailInterface['cc'] = emailTemplate['cc'];
      context.emailInterface['bcc'] = emailTemplate['bcc'];
      context.emailInterface['subject'] = emailTemplate['subject'];
      context.emailInterface['body'] = emailTemplate['body'];      
      CommonUtilityFunctions.setDataForRichEditor(context.emailBodyEditorId, context.emailInterface.body);
      context.attachments = [];
    } else {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    }
    context.hideEmailFormLoader();
  }

  sendEmail() {
    this.showEmailFormLoader();
    const formData = new FormData();
    formData.append('to', this.emailInterface['to']);
    formData.append('cc', this.emailInterface['cc']);
    formData.append('bcc', this.emailInterface['bcc']);
    formData.append('subject', this.emailInterface['subject']);
    formData.append('body', CommonUtilityFunctions.getDataFromRichEditor(this.emailBodyEditorId));
    const inputFilesNames = ['inputFile1', 'inputFile2', 'inputFile3', 'inputFile4'];
    if (CommonUtilityFunctions.checkNonEmptyList(this.attachments)) {
      for (let i = 0; i < this.attachments.length; i++) {
        if (i >= 4) {
          break;
        }
        formData.append(inputFilesNames[i], this.attachments[i]);
      }
    }
    this.utilityService.makerequest(this, this.onSendEmail, LcpRestUrls.send_email_url, 
                                    'POST', formData, 'multipart/form-data', true);
  }

  onSendEmail(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.setDefaultData();
      CommonUtilityFunctions.setDataForRichEditor(context.emailBodyEditorId, '');
    }
    context.hideEmailFormLoader();
  }

  closeEmailPopup() {
    if (this.isEmailFormDirty()) {
      this.helperService.showConfirmationDialog({
        message: LcpConstants.email_dismiss_data_exists_error,
        onOk: () => {
          this.closeEmail();
        },
        onCancel: () => {
        }
      });
    } else {
      this.closeEmail();
    }
  }

  private closeEmail() {
    this.setDefaultData();
    CommonUtilityFunctions.setDataForRichEditor(this.emailBodyEditorId, '');
    this.hideEmailPopup = true;
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
