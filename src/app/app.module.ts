import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './non-login-pages/login/login.component';
import {AppUtilityService} from './utils/app-utility.service';
import {HelperService} from './utils/helper.service';
import {HttpClientModule} from '@angular/common/http';
import {ErrorComponent} from './non-login-pages/error/error.component';
import {RoutingModule} from './utils/routing.module';
import {FormsModule} from '@angular/forms';
import {ResetPasswordComponent} from './non-login-pages/reset-password/reset-password.component';
import {NonLoginPagesComponent} from './non-login-pages/non-login-pages.component';
import {LoginControlledPagesComponent} from './login-controlled-pages/login-controlled-pages.component';
import {CreateEmailComponent} from './login-controlled-pages/create-email/create-email.component';
import {CreateGridComponent} from './login-controlled-pages/create-grid/create-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    ResetPasswordComponent,
    NonLoginPagesComponent,
    LoginControlledPagesComponent,
    CreateEmailComponent,
    CreateGridComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    FormsModule,
  ],
  providers: [AppUtilityService, HelperService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
