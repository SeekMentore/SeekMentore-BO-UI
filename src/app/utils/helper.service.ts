import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/index';
import {ConfirmationDialogEvent, AlertDialogEvent} from '../login-controlled-pages/login-controlled-pages.component';
import {EmailInterface} from '../login-controlled-pages/create-email/create-email.component';

declare var DecoupledEditor: any;

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

  public makeRichEditor(editorId: string, toolbarId: string, handler: any) {

    DecoupledEditor
      .create(document.querySelector(editorId))
      .then(editor => {
        const toolbarContainer = document.querySelector(toolbarId);

        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        handler(editor);
      })
      .catch(error => {
        console.error(error);
      });
  }

}



