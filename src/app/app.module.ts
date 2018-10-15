import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { CreateEmailComponent } from './login-controlled-pages/create-email/create-email.component';
import { CreateGridComponent } from './login-controlled-pages/create-grid/create-grid.component';
import { GridComponent } from './login-controlled-pages/grid/grid.component';
import { LoginControlledPagesComponent } from './login-controlled-pages/login-controlled-pages.component';
import { ErrorComponent } from './non-login-pages/error/error.component';
import { LoginComponent } from './non-login-pages/login/login.component';
import { NonLoginPagesComponent } from './non-login-pages/non-login-pages.component';
import { ResetPasswordComponent } from './non-login-pages/reset-password/reset-password.component';
import { AppUtilityService } from './utils/app-utility.service';
import { HelperService } from './utils/helper.service';
import { MultiSelectInputComponent } from './utils/multi-select-input/multi-select-input.component';
import { RoutingModule } from './utils/routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    ResetPasswordComponent,
    NonLoginPagesComponent,
    LoginControlledPagesComponent,
    CreateEmailComponent,
    CreateGridComponent,
    GridComponent,
    MultiSelectInputComponent
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
