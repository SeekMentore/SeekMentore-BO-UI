import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/index';
import { BreadCrumbInterface } from '../login-controlled-pages/bread-crumb/bread-crumb.component';
import { AlertDialogInterface } from './alert-dialog/alert-dialog.component';
import { ConfirmationDialogInterface } from './confirmation-dialog/confirmation-dialog.component';
import { EmailInterface } from './email/email.component';
import { PromptDialogInterface } from "./prompt-dialog/prompt-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private titleSubject = new Subject();
  public titleState = this.titleSubject.asObservable();
  private breadCrumbSubject = new Subject();
  public breadCrumbState = this.breadCrumbSubject.asObservable();
  private confirmationDialogSubject = new Subject();
  public confirmationDialogState = this.confirmationDialogSubject.asObservable();
  private alertDialogSubject = new Subject();
  public alertDialogState = this.alertDialogSubject.asObservable();
  private emailDialogSubject = new Subject();
  public emailDialogState = this.emailDialogSubject.asObservable();
  private promptDialogSubject = new Subject();
  public promptDialogState = this.promptDialogSubject.asObservable();

  constructor() {}

  public setTitle(title: string) {
    this.titleSubject.next(title);
  }

  public setBreadCrumb(eventInterface: BreadCrumbInterface) {
    this.breadCrumbSubject.next(eventInterface);
  }

  public showConfirmationDialog(eventInterface: ConfirmationDialogInterface) {
    this.confirmationDialogSubject.next(eventInterface);
  }

  public showAlertDialog(eventInterface: AlertDialogInterface) {
    this.alertDialogSubject.next(eventInterface);
  }

  public showPromptDialog(eventInterface: PromptDialogInterface) {
    this.promptDialogSubject.next(eventInterface);
  }  

  public showEmailDialog(
    to: string = '', 
    cc: string = '', 
    bcc: string = '', 
    subject: string = '', 
    body: string = ''
  ) {
    const eventInterface: EmailInterface = {
      to: to,
      cc: cc,
      bcc: bcc,
      subject: subject,
      body: body
    };
    this.emailDialogSubject.next(eventInterface);
  }
}
