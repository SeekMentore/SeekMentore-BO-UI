import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { EmailComponent } from './login-controlled-pages/email/create-email.component';
import { LoginControlledPagesComponent } from './login-controlled-pages/login-controlled-pages.component';
import { ErrorComponent } from './non-login-pages/error/error.component';
import { LoginComponent } from './non-login-pages/login/login.component';
import { NonLoginPagesComponent } from './non-login-pages/non-login-pages.component';
import { ResetPasswordComponent } from './non-login-pages/reset-password/reset-password.component';
import { AppUtilityService } from './utils/app-utility.service';
import { HelperService } from './utils/helper.service';
import { MultiSelectInputComponent } from './utils/multi-select-input/multi-select-input.component';
import { RoutingModule } from './utils/routing.module';
import { RegisteredTutorComponent } from './login-controlled-pages/employee/admin/registered-tutor/registered-tutor.component';
import { HomeComponent } from './login-controlled-pages/home/home.component';
import { AlertDialogComponent } from './utils/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from './utils/confirmation-dialog/confirmation-dialog.component';
import { CustomerHomeComponent } from './login-controlled-pages/customer/customer-home/customer-home.component';
import { EmployeeHomeComponent } from './login-controlled-pages/employee/employee-home/employee-home.component';
import { TutorHomeComponent } from './login-controlled-pages/tutor/tutor-home/tutor-home.component';
import { RegisteredTutorDataComponent } from './login-controlled-pages/employee/admin/registered-tutor/registered-tutor-data/registered-tutor-data.component';
import { SubscribedCustomerComponent } from './login-controlled-pages/employee/admin/subscribed-customer/subscribed-customer.component';
import { SubscribedCustomerDataComponent } from './login-controlled-pages/employee/admin/subscribed-customer/subscribed-customer-data/subscribed-customer-data.component';
import { TutorRegistrationComponent } from './login-controlled-pages/employee/support/tutor-registration/tutor-registration.component';
import { EnquiryRegistrationComponent } from './login-controlled-pages/employee/support/enquiry-registration/enquiry-registration.component';
import { QuerySubmittedComponent } from './login-controlled-pages/employee/support/query-submitted/query-submitted.component';
import { SubscriptionRequestedComponent } from './login-controlled-pages/employee/support/subscription-requested/subscription-requested.component';
import { ComplaintsComponent } from './login-controlled-pages/employee/support/complaints/complaints.component';
import { AllEnquiriesComponent } from './login-controlled-pages/employee/sales/all-enquiries/all-enquiries.component';
import { MapTutorToEnquiryComponent } from './login-controlled-pages/employee/sales/map-tutor-to-enquiry/map-tutor-to-enquiry.component';
import { DemoTrackerComponent } from './login-controlled-pages/employee/sales/demo-tracker/demo-tracker.component';
import { SubscriptionPackagesComponent } from './login-controlled-pages/employee/sales/subscription-packages/subscription-packages.component';
import { ControlPanelComponent } from './login-controlled-pages/employee/super-admin/control-panel/control-panel.component';
import { GridComponent } from './utils/grid/grid.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    ResetPasswordComponent,
    NonLoginPagesComponent,
    LoginControlledPagesComponent,
    EmailComponent,
    GridComponent,
    MultiSelectInputComponent,
    EmployeeHomeComponent,
    TutorHomeComponent,
    CustomerHomeComponent,
    RegisteredTutorComponent,
    HomeComponent,
    AlertDialogComponent,
    ConfirmationDialogComponent,
    RegisteredTutorDataComponent,
    SubscribedCustomerComponent,
    SubscribedCustomerDataComponent,
    TutorRegistrationComponent,
    EnquiryRegistrationComponent,
    QuerySubmittedComponent,
    SubscriptionRequestedComponent,
    ComplaintsComponent,
    AllEnquiriesComponent,
    MapTutorToEnquiryComponent,
    DemoTrackerComponent,
    SubscriptionPackagesComponent,
    ControlPanelComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    FormsModule,
    NgbDatepickerModule
  ],
  providers: [AppUtilityService, HelperService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
