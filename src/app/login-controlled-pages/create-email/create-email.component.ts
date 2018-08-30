import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {AppUtilityService} from '../../utils/app-utility.service';
import {HelperService} from '../../utils/helper.service';
import {LcpConstants} from '../../utils/lcp-constants';
import {LcpRestUrls} from '../../utils/lcp-rest-urls';

@Component({
  selector: 'app-create-email',
  templateUrl: './create-email.component.html',
  styleUrls: ['./create-email.component.css']
})
export class CreateEmailComponent implements OnInit, OnChanges {

  title = LcpConstants.email_dialog_title;
  attachments: File[] = [];
  emailTemplatesArray: EmailTemplateInterface[];
  filteredTemplateArray: EmailTemplateInterface[];
  defaultValueEmailTemplate: EmailTemplateInterface;
  selectedEmailTemplate: EmailTemplateInterface;
  emailData: EmailInterface;
  allowedFileTypes = LcpConstants.email_attachment_allowed_types;

  searchableItems: { id: string, text: string }[] = [];

  @Input('emailData')
  receivedEmailData: EmailInterface = null;

  constructor(public utilityService: AppUtilityService, public helperService: HelperService) {
    this.setDefaultData();
    this.searchableItems.push({id: 'sfa', text: 'thisi si s1'});
    this.searchableItems.push({id: 'sfa2', text: 'thisi si s1s'});
  }

  ngOnInit() {
    this.utilityService.makeRequest(LcpRestUrls.emailTemplatesUrl, 'POST').subscribe(result => {
        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        if (response != null) {
          this.emailTemplatesArray = response['emailTemplates'];
          this.filteredTemplateArray = this.emailTemplatesArray;
          console.log(this.emailTemplatesArray);
        }
      },
      error => {

      });
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

  onAttachmentSelected(value) {
    // console.log(value);

    // show error if more than permitted number of files are selected

    if ((<any>value.target).files.length > LcpConstants.email_attachments_max_number) {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: LcpConstants.email_attachments_number_error,
        onOk: () => {
        }
      });
      return;
    }

    for (const attachment of (<any>value.target).files) {
      let totalSize = 0; // in KB
      const attachmentsNumber = this.attachments.length;
      let errorMessage = null;
      this.attachments.forEach((value2 => {
        totalSize = totalSize + value2.size / 1024;
      }));
      totalSize += attachment.size / 1024;
      // console.log(totalSize);
      if (totalSize > LcpConstants.email_attachemnts_max_size_MB * 1024) {
        errorMessage = LcpConstants.email_attachment_size_error;
      } else if (attachmentsNumber >= LcpConstants.email_attachments_max_number) {
        errorMessage = LcpConstants.email_attachments_number_error;
      }
      if (errorMessage !== null) {
        this.helperService.showAlertDialog({
          isSuccess: false,
          message: errorMessage,
          onOk: () => {
          }
        });
        break;
      } else {
        this.attachments.push(attachment);
      }
    }

  }

  emailTemplateSelected() {
    // this.toggleDropDown();
    // this.selectedEmailTemplate = emailTemplate;
    console.log(this.selectedEmailTemplate);
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
          this.loadEmailDataFromServer(this.selectedEmailTemplate.value);
        },
        onCancel: () => {
          this.selectedEmailTemplate = this.defaultValueEmailTemplate;
        }
      });
    } else {
      this.loadEmailDataFromServer(this.selectedEmailTemplate.value);
    }

  }

  loadEmailDataFromServer(templateValue: string) {
    if (templateValue === this.defaultValueEmailTemplate.value) {
      this.setDefaultData();
      return;
    }
    this.getDataForTemplate(templateValue).subscribe(result => {
        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        if (response != null) {
          this.emailData = response;

        }
      },
      error => {

      });
  }

  hideDialog() {
    this.helperService.hideEmailDialog();
    this.setDefaultData();
  }

  sendEmail() {
    const formData = new FormData();
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
    this.utilityService.makeRequest(LcpRestUrls.sendMailUrl, 'POST', formData,
      'multipart/form-data', true).subscribe(
      result => {
        this.helperService.showAlertDialog({
          isSuccess: true,
          message: LcpConstants.email_sent_success_message,
          onOk: () => {
            this.hideDialog();
          }
        });
      },
      error2 => {

      }
    );
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


  getDataForTemplate(value: string) {
    const formData = new URLSearchParams();
    formData.set('templateId', value);
    return this.utilityService.makeRequest(LcpRestUrls.emailTemplateDataUrl, 'POST', formData.toString(),
      'application/x-www-form-urlencoded');
  }

  hideDropDownListener = (event) => {
    this.toggleDropDown();
  };

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
