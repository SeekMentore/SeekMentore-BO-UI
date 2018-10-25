import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { EmailComponent } from './login-controlled-pages/email/create-email.component';
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
import { EmployeeHomeComponent } from './login-controlled-pages/employee-home/employee-home.component';
import { TutorHomeComponent } from './login-controlled-pages/tutor-home/tutor-home.component';
import { CustomerHomeComponent } from './login-controlled-pages/customer-home/customer-home.component';
import { RegisteredTutorComponent } from './login-controlled-pages/employee/admin/registered-tutor/registered-tutor.component';
import { HomeComponent } from './login-controlled-pages/home/home.component';

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
    HomeComponent
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
