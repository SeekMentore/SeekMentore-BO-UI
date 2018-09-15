import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AppUtilityService} from './app-utility.service';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class RoutingGuardService implements CanActivate {

  constructor(private utilityService: AppUtilityService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;
    // console.log(url);
    return this.utilityService.checkUIPathAccess(url);
  }
}
