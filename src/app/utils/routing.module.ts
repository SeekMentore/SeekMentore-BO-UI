import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailComponent } from '../login-controlled-pages/email/create-email.component';
import { LoginControlledPagesComponent } from '../login-controlled-pages/login-controlled-pages.component';
import { ErrorComponent } from '../non-login-pages/error/error.component';
import { LoginComponent } from '../non-login-pages/login/login.component';
import { NonLoginPagesComponent } from '../non-login-pages/non-login-pages.component';
import { ResetPasswordComponent } from '../non-login-pages/reset-password/reset-password.component';
import { RoutingGuardService } from './routing-guard.service';
import { RegisteredTutorComponent } from '../login-controlled-pages/employee/admin/registered-tutor/registered-tutor.component';


const routes: Routes = [
  {
    path: 'lp', component: LoginControlledPagesComponent,
    // canActivate: [RoutingGuardService],
    children: [
      {path: 'email', component: EmailComponent},
      {path: 'registeredTutor', component: RegisteredTutorComponent}
    ]
  },
  {
    path: 'nlp', component: NonLoginPagesComponent,
    children: [
      {path: 'error', component: ErrorComponent},
      {path: 'login', component: LoginComponent},
      {path: 'resetpassword', component: ResetPasswordComponent, canActivate: [RoutingGuardService]},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '**', redirectTo: 'login', pathMatch: 'full'}
    ]
  },
  {path: '', redirectTo: 'nlp', pathMatch: 'full'},
  {path: '**', redirectTo: 'nlp', pathMatch: 'full'}
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


