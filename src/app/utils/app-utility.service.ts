import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/index';
import { CommonUtilityFunctions } from './common-utility-functions';
import { EnvironmentConstants } from './environment-constants';
import { HelperService } from './helper.service';
import { LcpRestUrls } from './lcp-rest-urls';

@Injectable({
  providedIn: 'root'
})
export class AppUtilityService {

  type: 'GET' | 'POST' | 'DELETE' | 'PUT';

  constructor(private http: HttpClient, private helperService: HelperService, private router: Router) {
  }

  public makeRequestWithoutResponseHandler (
    url: string,
    requestType: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET',
    data: any = null,
    contentType: string = 'application/x-www-form-urlencoded',
    isMultipart: boolean = false,
    params: HttpParams = null
  ) {
    url = EnvironmentConstants.SERVER_URL + EnvironmentConstants.CONTEXT_PATH + url;
    const requestOptions = {'headers': this.getRequestHeaders(isMultipart, contentType), withCredentials: true};
    if (requestType === 'GET') {
      if (CommonUtilityFunctions.checkObjectAvailability(params)) {
        requestOptions['params'] = params;
      }
    } else {
      if (CommonUtilityFunctions.checkObjectAvailability(data)) {
        requestOptions['body'] = data;
      }
    }
    return this.http.request(requestType, url, requestOptions);
  }

  public makerequest(
    context: any,
    response_handler: any,
    url: string,
    requestType: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET',
    data: any = null,
    contentType: string = 'application/x-www-form-urlencoded',
    isMultipart: boolean = false,
    params: HttpParams = null,
    extraContextProperties: Object = null
  ) {
    url = EnvironmentConstants.SERVER_URL + EnvironmentConstants.CONTEXT_PATH + url;
    const requestOptions = {'headers': this.getRequestHeaders(isMultipart, contentType), withCredentials: true};
    if (requestType === 'GET') {
      if (CommonUtilityFunctions.checkObjectAvailability(params)) {
        requestOptions['params'] = params;
      }
    } else {
      if (CommonUtilityFunctions.checkObjectAvailability(data)) {
        requestOptions['body'] = data;
      }
    }
    this.http.request(requestType, url, requestOptions).subscribe(
    result => {
      let response = result['response'];
      if (CommonUtilityFunctions.checkObjectAvailability(response)) {
        response = this.decodeObjectFromJSON(response);
        if (CommonUtilityFunctions.checkObjectAvailability(response)) {
          response_handler(context, response, extraContextProperties);
        } else {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Null response received from Server' + ' \n ' + 'Please refresh the page, if the issue persists raise a complaint with our Support Team',
            onButtonClicked: () => {
            }
          });
        }
      } else {
        this.helperService.showAlertDialog({
          isSuccess: false,
          message: 'Null response received from Server' + ' \n ' + 'Please refresh the page, if the issue persists raise a complaint with our Support Team',
          onButtonClicked: () => {
          }
        });
      }
    }, error2 => {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: 'Communication failure!! Something went wrong' + ' \n ' + 'Please refresh the page, if the issue persists raise a complaint with our Support Team',
        onButtonClicked: () => {
        }
      });
    });
  }

  private getRequestHeaders(isMultipart = false, contentType = 'application/json') {
    let headers: HttpHeaders = new HttpHeaders({});
    if (!isMultipart) {
      headers = headers.append('Content-Type', contentType);
    }
    return headers;
  }

  public submitForm(formId: string, url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET') {
    const formElement: HTMLFormElement = <HTMLFormElement>document.getElementById(formId);
    if (formElement.checkValidity()) {
      formElement.action = EnvironmentConstants.SERVER_URL + EnvironmentConstants.CONTEXT_PATH + url;
      formElement.method = method;
      formElement.submit();
    } else {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: 'Form to submit is not valid',
        onButtonClicked: () => {
        }
      });
    }
  }

  public decodeObjectFromJSON(json) {
    return null != json ? JSON.parse(json) : null;
  }

  public urlEncodeData(data: any) {
    const encodedData = new URLSearchParams();
    for (const key in data) {
      encodedData.set(key, data[key]);
    }
    return encodedData.toString();
  }

  public checkUIPathAccess(path: string): Observable<boolean> {
    const paramsData = new URLSearchParams();
    paramsData.set('urlPath', path);
    const _observable = new Observable<boolean>(observer => {
      this.makeRequestWithoutResponseHandler(LcpRestUrls.ui_access_url, 'POST', paramsData.toString(),
        'application/x-www-form-urlencoded').subscribe(
        result => {
          let response = result['response'];
          response = this.decodeObjectFromJSON(response);
          if (CommonUtilityFunctions.checkObjectAvailability(response) && CommonUtilityFunctions.checkObjectAvailability(response['success']) && response['success']) {
            observer.next(true);
          } else {
            this.router.navigateByUrl(response['redirectTo']);
            observer.next(false);
          }
        },
        error2 => {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Communication failure!! Something went wrong' + ' \n ' + 'Please refresh the page, if the issue persists raise a complaint with our Support Team',
            onButtonClicked: () => {
            }
          });
          observer.next(false);
        }
      );
    });
    return _observable;
  }
}
