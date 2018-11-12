import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/index';
import {AlertDialogEvent} from './alert-dialog/alert-dialog.component';
import {CkeditorConfig} from './ckeditor-config';
import {EmailInterface} from './email/email.component';
import {ConfirmationDialogEvent} from './confirmation-dialog/confirmation-dialog.component';
import {PromptDialogInterface} from "./prompt-dialog/prompt-dialog.component";

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
  private promptDialogSubject = new Subject();
  public promptDialogState = this.promptDialogSubject.asObservable();

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

  public showPromptDialog(eventListener: PromptDialogInterface) {
    this.promptDialogSubject.next(eventListener);
  }

  public getDataFromRichEditor(editorId: string): string {
    return CKEDITOR.instances[editorId].getData();
  }

  public setDataForRichEditor(editorId: string, data: string) {
    CKEDITOR.instances[editorId].setData(data);
  }

  public makeRichEditor(editorId: string, configuration: any) {
    CKEDITOR.replace(editorId, configuration);
  }

  public makeRichEditorWithDefaultConfiguration(editorId: string) {
    CKEDITOR.replace(editorId, CkeditorConfig.defaultConfiguration);
  }

  public encodedGridFormData(updatedValues: any, parentId: any) {
    const formData = new FormData();
    formData.append('completeUpdatedRecord', JSON.stringify(updatedValues));
    formData.append('parentId', parentId);
    return formData;
  }
}
