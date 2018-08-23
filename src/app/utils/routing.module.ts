import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ErrorComponent} from '../non-login-pages/error/error.component';
import {LoginComponent} from '../non-login-pages/login/login.component';
import {ResetPasswordComponent} from '../non-login-pages/reset-password/reset-password.component';
import {NonLoginPagesComponent} from '../non-login-pages/non-login-pages.component';
import {LoginControlledPagesComponent} from '../login-controlled-pages/login-controlled-pages.component';
import {CreateEmailComponent} from '../login-controlled-pages/create-email/create-email.component';


const routes: Routes = [
  {
    path: 'lp', component: LoginControlledPagesComponent,
    children: [
      {path: 'email', component: CreateEmailComponent}
    ]
  },
  {
    path: 'nlp', component: NonLoginPagesComponent,
    children: [
      {path: 'error', component: ErrorComponent},
      {path: 'login', component: LoginComponent},
      {path: 'resetpassword', component: ResetPasswordComponent},
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
  providers: [],
  declarations: []
})
export class RoutingModule {
}


