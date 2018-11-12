import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppComponent } from './app.component';
import { CustomerHomeComponent } from './login-controlled-pages/customer/customer-home/customer-home.component';
import { RegisteredTutorDataComponent } from './login-controlled-pages/employee/admin/registered-tutor/registered-tutor-data/registered-tutor-data.component';
import { RegisteredTutorComponent } from './login-controlled-pages/employee/admin/registered-tutor/registered-tutor.component';
import { SubscribedCustomerDataComponent } from './login-controlled-pages/employee/admin/subscribed-customer/subscribed-customer-data/subscribed-customer-data.component';
import { SubscribedCustomerComponent } from './login-controlled-pages/employee/admin/subscribed-customer/subscribed-customer.component';
import { EmployeeHomeComponent } from './login-controlled-pages/employee/employee-home/employee-home.component';
import { AllEnquiriesComponent } from './login-controlled-pages/employee/sales/all-enquiries/all-enquiries.component';
import { EnquiriesDataComponent } from './login-controlled-pages/employee/sales/all-enquiries/enquiries-data/enquiries-data.component';
import { DemoTrackerComponent } from './login-controlled-pages/employee/sales/demo-tracker/demo-tracker.component';
import { MapTutorToEnquiryComponent } from './login-controlled-pages/employee/sales/map-tutor-to-enquiry/map-tutor-to-enquiry.component';
import { SubscriptionPackagesComponent } from './login-controlled-pages/employee/sales/subscription-packages/subscription-packages.component';
import { ControlPanelComponent } from './login-controlled-pages/employee/super-admin/control-panel/control-panel.component';
import { ComplaintDataComponent } from './login-controlled-pages/employee/support/complaints/complaint-data/complaint-data.component';
import { ComplaintsComponent } from './login-controlled-pages/employee/support/complaints/complaints.component';
import { EnquiryDataComponent } from './login-controlled-pages/employee/support/enquiry-registration/enquiry-data/enquiry-data.component';
import { EnquiryRegistrationComponent } from './login-controlled-pages/employee/support/enquiry-registration/enquiry-registration.component';
import { QueryDataComponent } from './login-controlled-pages/employee/support/query-submitted/query-data/query-data.component';
import { QuerySubmittedComponent } from './login-controlled-pages/employee/support/query-submitted/query-submitted.component';
import { SubscriptionDataComponent } from './login-controlled-pages/employee/support/subscription-requested/subscription-data/subscription-data.component';
import { SubscriptionRequestedComponent } from './login-controlled-pages/employee/support/subscription-requested/subscription-requested.component';
import { BecomeTutorDataComponent } from './login-controlled-pages/employee/support/tutor-registration/become-tutor-data/become-tutor-data.component';
import { TutorRegistrationComponent } from './login-controlled-pages/employee/support/tutor-registration/tutor-registration.component';
import { HomeComponent } from './login-controlled-pages/home/home.component';
import { LoginControlledPagesComponent } from './login-controlled-pages/login-controlled-pages.component';
import { TutorHomeComponent } from './login-controlled-pages/tutor/tutor-home/tutor-home.component';
import { ErrorComponent } from './non-login-pages/error/error.component';
import { LoginComponent } from './non-login-pages/login/login.component';
import { NonLoginPagesComponent } from './non-login-pages/non-login-pages.component';
import { ResetPasswordComponent } from './non-login-pages/reset-password/reset-password.component';
import { AlertDialogComponent } from './utils/alert-dialog/alert-dialog.component';
import { AppUtilityService } from './utils/app-utility.service';
import { ConfirmationDialogComponent } from './utils/confirmation-dialog/confirmation-dialog.component';
import { EmailComponent } from './utils/email/email.component';
import { GridColumnExtraDataComponent } from './utils/grid/grid-column-extra-data/grid-column-extra-data.component';
import { GridRecordPopUpComponent } from './utils/grid/grid-record-pop-up/grid-record-pop-up.component';
import { GridComponent } from './utils/grid/grid.component';
import { HelperService } from './utils/helper.service';
import { MultiSelectInputComponent } from './utils/multi-select-input/multi-select-input.component';
import { RoutingModule } from './utils/routing.module';
import { MapTutorToEnquiryDataComponent } from './login-controlled-pages/employee/sales/map-tutor-to-enquiry/map-tutor-to-enquiry-data/map-tutor-to-enquiry-data.component';
import { MappedTutorDataComponent } from './login-controlled-pages/employee/sales/map-tutor-to-enquiry/map-tutor-to-enquiry-data/mapped-tutor-data/mapped-tutor-data.component';
import { ScheduleDemoComponent } from './login-controlled-pages/employee/sales/schedule-demo/schedule-demo.component';
import { ScheduleDemoDataComponent } from './login-controlled-pages/employee/sales/schedule-demo/schedule-demo-data/schedule-demo-data.component';
import { PromptDialogComponent } from './utils/prompt-dialog/prompt-dialog.component';

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
    ControlPanelComponent,
    GridRecordPopUpComponent,
    GridColumnExtraDataComponent,
    BecomeTutorDataComponent,
    EnquiryDataComponent,
    SubscriptionDataComponent,
    QueryDataComponent,
    ComplaintDataComponent,
    EnquiriesDataComponent,
    MapTutorToEnquiryDataComponent,
    MappedTutorDataComponent,
    ScheduleDemoComponent,
    ScheduleDemoDataComponent,
    PromptDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    FormsModule,
    NgbDatepickerModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [AppUtilityService, HelperService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
