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
import { ScheduleDemoComponent } from 'src/app/login-controlled-pages/employee/sales/schedule-demo/schedule-demo.component';

const routes: Routes = [
  {
    path: 'user', component: LoginControlledPagesComponent,
    canActivate: [RoutingGuardService],
    children: [
      {path: 'home', component: HomeComponent, canActivate: [RoutingGuardService]},
      {
        path: 'employee',
        canActivate: [RoutingGuardService],
        children: [
          {
            path: 'superadmin',
            canActivate: [RoutingGuardService],
            children: [
              {path: 'controlpanel', component: ControlPanelComponent, canActivate: [RoutingGuardService]}
            ]
          },
          {
            path: 'admin',
            canActivate: [RoutingGuardService],
            children: [
              {path: 'registeredtutor', component: RegisteredTutorComponent, canActivate: [RoutingGuardService]},
              {path: 'subscribedcustomer', component: SubscribedCustomerComponent, canActivate: [RoutingGuardService]}
            ]
          },
          {
            path: 'sales',
            canActivate: [RoutingGuardService],
            children: [
              {path: 'allenquiries', component: AllEnquiriesComponent, canActivate: [RoutingGuardService]},
              {path: 'maptutortoenquiry', component: MapTutorToEnquiryComponent, canActivate: [RoutingGuardService]},
              {path: 'scheduledemo', component: ScheduleDemoComponent, canActivate: [RoutingGuardService]},
              {path: 'demotracker', component: DemoTrackerComponent, canActivate: [RoutingGuardService]},
              {path: 'subscriptionpackages', component: SubscriptionPackagesComponent, canActivate: [RoutingGuardService]}
            ]
          },
          {
            path: 'support',
            canActivate: [RoutingGuardService],
            children: [
              {path: 'tutorregistration', component: TutorRegistrationComponent, canActivate: [RoutingGuardService]},
              {path: 'enquiryregistration', component: EnquiryRegistrationComponent, canActivate: [RoutingGuardService]},
              {path: 'querysubmitted', component: QuerySubmittedComponent, canActivate: [RoutingGuardService]},
              {path: 'subscriptionrequested', component: SubscriptionRequestedComponent, canActivate: [RoutingGuardService]},
              {path: 'complaints', component: ComplaintsComponent, canActivate: [RoutingGuardService]}
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


