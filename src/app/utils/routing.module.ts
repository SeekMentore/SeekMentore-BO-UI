import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginControlledPagesComponent } from 'src/app/login-controlled-pages/login-controlled-pages.component';
import { ErrorComponent } from 'src/app/non-login-pages/error/error.component';
import { LoginComponent } from 'src/app/non-login-pages/login/login.component';
import { NonLoginPagesComponent } from 'src/app/non-login-pages/non-login-pages.component';
import { ResetPasswordComponent } from 'src/app/non-login-pages/reset-password/reset-password.component';
import { RoutingGuardService } from 'src/app/utils/routing-guard.service';
import { RegisteredTutorComponent } from 'src/app/login-controlled-pages/employee/admin/registered-tutor/registered-tutor.component';
import { HomeComponent } from 'src/app/login-controlled-pages/home/home.component';
import { SubscribedCustomerComponent } from 'src/app/login-controlled-pages/employee/admin/subscribed-customer/subscribed-customer.component';
import { AllEnquiriesComponent } from 'src/app/login-controlled-pages/employee/sales/all-enquiries/all-enquiries.component';
import { MapTutorToEnquiryComponent } from 'src/app/login-controlled-pages/employee/sales/map-tutor-to-enquiry/map-tutor-to-enquiry.component';
import { DemoTrackerComponent } from 'src/app/login-controlled-pages/employee/sales/demo-tracker/demo-tracker.component';
import { SubscriptionPackagesComponent } from 'src/app/login-controlled-pages/employee/sales/subscription-packages/subscription-packages.component';
import { TutorRegistrationComponent } from 'src/app/login-controlled-pages/employee/support/tutor-registration/tutor-registration.component';
import { EnquiryRegistrationComponent } from 'src/app/login-controlled-pages/employee/support/enquiry-registration/enquiry-registration.component';
import { QuerySubmittedComponent } from 'src/app/login-controlled-pages/employee/support/query-submitted/query-submitted.component';
import { SubscriptionRequestedComponent } from 'src/app/login-controlled-pages/employee/support/subscription-requested/subscription-requested.component';
import { ComplaintsComponent } from 'src/app/login-controlled-pages/employee/support/complaints/complaints.component';
import { ControlPanelComponent } from 'src/app/login-controlled-pages/employee/super-admin/control-panel/control-panel.component';
import { ScheduleDemoComponent } from '../login-controlled-pages/employee/sales/schedule-demo/schedule-demo.component';

const routes: Routes = [
  {
    path: 'user', component: LoginControlledPagesComponent,
    canActivate: [RoutingGuardService],
    children: [
      {path: 'home', component: HomeComponent},
      {
        path: 'employee',
        children: [
          {
            path: 'superadmin',
            children: [
              {path: 'controlpanel', component: ControlPanelComponent}
            ]
          },
          {
            path: 'admin',
            children: [
              {path: 'registeredtutor', component: RegisteredTutorComponent},
              {path: 'subscribedcustomer', component: SubscribedCustomerComponent}
            ]
          },
          {
            path: 'sales',
            children: [
              {path: 'allenquiries', component: AllEnquiriesComponent},
              {path: 'maptutortoenquiry', component: MapTutorToEnquiryComponent},
              {path: 'scheduleDemo', component: ScheduleDemoComponent},
              {path: 'demotracker', component: DemoTrackerComponent},
              {path: 'subscriptionpackages', component: SubscriptionPackagesComponent}
            ]
          },
          {
            path: 'support',
            children: [
              {path: 'tutorregistration', component: TutorRegistrationComponent},
              {path: 'enquiryregistration', component: EnquiryRegistrationComponent},
              {path: 'querysubmitted', component: QuerySubmittedComponent},
              {path: 'subscriptionrequested', component: SubscriptionRequestedComponent},
              {path: 'complaints', component: ComplaintsComponent}
            ]
          }
        ]
      },      
      {path: '', redirectTo: '/public/error?errorCode=101', pathMatch: 'full'},
      {path: '**', redirectTo: '/public/error?errorCode=101', pathMatch: 'full'}
    ]
  },
  {
    path: 'public', component: NonLoginPagesComponent,
    children: [
      {path: 'error', component: ErrorComponent},
      {path: 'login', component: LoginComponent},
      {path: 'resetpassword', component: ResetPasswordComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '**', redirectTo: 'login', pathMatch: 'full'}
    ]
  },
  {path: '', redirectTo: '/public/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/public/login', pathMatch: 'full'}
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [RoutingGuardService],
  declarations: []
})
export class RoutingModule {
}


