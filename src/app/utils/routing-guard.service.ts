import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/index';
import { AppUtilityService } from './app-utility.service';
import { BreadCrumbEvent } from '../login-controlled-pages/bread-crumb/bread-crumb.component';
import { HelperService } from './helper.service';
import { ApplicationBreadCrumbConfig } from './application-bread-crumb-config';

@Injectable({
  providedIn: 'root'
})
export class RoutingGuardService implements CanActivate {

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;
    return this.utilityService.checkUIPathAccess(url);
  }  
}
