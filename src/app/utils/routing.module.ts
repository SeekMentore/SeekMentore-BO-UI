import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginControlledPagesComponent } from '../login-controlled-pages/login-controlled-pages.component';
import { ErrorComponent } from '../non-login-pages/error/error.component';
import { LoginComponent } from '../non-login-pages/login/login.component';
import { NonLoginPagesComponent } from '../non-login-pages/non-login-pages.component';
import { ResetPasswordComponent } from '../non-login-pages/reset-password/reset-password.component';
import { RoutingGuardService } from './routing-guard.service';
import { RegisteredTutorComponent } from '../login-controlled-pages/employee/admin/registered-tutor/registered-tutor.component';
import { HomeComponent } from '../login-controlled-pages/home/home.component';

const routes: Routes = [
  {
    path: 'user', component: LoginControlledPagesComponent,
    // canActivate: [RoutingGuardService],
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'registeredTutor', component: RegisteredTutorComponent},
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


