import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/index';
import {ConfirmationDialogEvent, AlertDialogEvent} from '../login-controlled-pages/login-controlled-pages.component';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private titleSubject = new Subject();
  public titleState = this.titleSubject.asObservable();
  private confirmationDialogSubject = new Subject();
  public confirmationDialogState = this.confirmationDialogSubject.asObservable();
  private alertDialogSubject = new Subject();
  public alertDialogState = this.alertDialogState.asObservable();

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
}



