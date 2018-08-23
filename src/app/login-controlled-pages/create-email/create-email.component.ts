import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {Observable} from 'rxjs/index';
import {AppUtilityService} from '../../utils/app-utility.service';
import {HelperService} from '../../utils/helper.service';
import {LcpConstants} from '../../utils/lcp-constants';

@Component({
  selector: 'app-create-email',
  templateUrl: './create-email.component.html',
  styleUrls: ['./create-email.component.css']
})
export class CreateEmailComponent implements OnInit, OnChanges {

  attachments: File[] = [];

  emailTemplatesArray: EmailTemplateInterface[];
  defaultValueEmailTemplate: EmailTemplateInterface;
  selectedEmailTemplate: EmailTemplateInterface;
  emailData: EmailInterface;
  allowedFileTypes = LcpConstants.email_attachment_allowed_types;

  @Input('emailData')
  receivedEmailData: EmailInterface = null;

  constructor(public utilityService: AppUtilityService, public helperService: HelperService) {
    this.emailTemplatesArray = [];
    this.defaultValueEmailTemplate = {
      label: 'Select E-mail template',
      value: '00'
    };
    this.emailData = {
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: ''
    };
  }

  ngOnInit() {
    this.selectedEmailTemplate = this.defaultValueEmailTemplate;
    this.getEmailTemplates().subscribe(result => {
        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        if (response != null) {
          this.emailTemplatesArray = response['emailTemplates'];
          console.log(this.emailTemplatesArray);
        }
      },
      error => {

      });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      if(propName === 'receivedEmailData' && changedProp.currentValue !== null) {
        this.emailData = changedProp.currentValue;
      }
    }
  }

  removeAttachment(i: number) {
    console.log('lasd');
    this.attachments.splice(i, 1);
  }

  onAttachmentSelected(value) {
    console.log(value);
    let totalSize = 0; // in KB
    const attachmentsNumber = this.attachments.length;
    let errorMessage = null;
    this.attachments.forEach((value2 => {
      totalSize = totalSize + value2.size / 1024;
    }));
    const attachment = (<any>value.target).files[0];
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
    } else {
      this.attachments.push(attachment);
    }

  }

  emailTemplateSelected() {
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
  }

  getEmailTemplates() {
    const observable = new Observable((observer) => {
      observer.next(
        {response: '{"emailTemplates": [{"label": "Rejection Template","value": "01"},{"label": "Selection Template","value": "02"}]}'}
      );
    });
    return observable;
  }

  getDataForTemplate(value: string) {
    const observable = new Observable((observer) => {
      observer.next(
        {response: '{"to": "TO VALUE","cc": "CC VALUE","bcc": "BCC VALUE","subject": "SUBJECT VALUE","body": "BODY VALUE"}'}
      );
    });
    return observable;
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
