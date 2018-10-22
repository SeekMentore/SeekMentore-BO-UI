import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/index';
import { EmailInterface } from '../login-controlled-pages/email/create-email.component';
import { CkeditorConfig } from './ckeditor-config';

declare var CKEDITOR: any;

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private titleSubject = new Subject();
  public titleState = this.titleSubject.asObservable();
  private confirmationDialogSubject = new Subject();
  public confirmationDialogState = this.confirmationDialogSubject.asObservable();
  private alertDialogSubject = new Subject();
  public alertDialogState = this.alertDialogSubject.asObservable();
  private emailDialogSubject = new Subject();
  public emailDialogState = this.emailDialogSubject.asObservable();

  constructor() {
  }

  public setTitle(title: string) {
    this.titleSubject.next(title);
  }

  public showConfirmationDialog(eventListener: ConfirmationDialogEvent) {
    this.confirmationDialogSubject.next(eventListener);
  }

  public showAlertDialog(eventListener: AlertDialogEvent) {
    this.alertDialogSubject.next(eventListener);
  }

  public showEmailDialog(to = '', cc = '', bcc = '', subject = '', body = '') {
    const emailData: EmailInterface = {
      to: to,
      cc: cc,
      bcc: bcc,
      subject: subject,
      body: body
    };
    this.emailDialogSubject.next(emailData);
  }

  public hideEmailDialog() {
    this.emailDialogSubject.next(null);
  }

  public getDataFromRichEditor(editorId: string): string {
    return CKEDITOR.instances[editorId].getData();
  }

  public setDataForRichEditor(editorId: string, data: string) {
    CKEDITOR.instances[editorId].setData(data);
  }

  public makeRichEditor(editorId: string) {
    CKEDITOR.replace(editorId, CkeditorConfig.emailConfiguration);
  }
}

export interface ConfirmationDialogEvent {
  message: string;
  onOk(): void;
  onCancel(): void;
}

export interface AlertDialogEvent {
  isSuccess: boolean;
  message: string;
  onButtonClicked(): void;
}
