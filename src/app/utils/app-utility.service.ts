import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { EnvironmentConstants } from './environment-constants';
import { HelperService } from './helper.service';
import { LcpConstants } from './lcp-constants';
import { LcpRestUrls } from './lcp-rest-urls';
import { AlertDialogEvent } from './alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AppUtilityService {

  type: 'GET' | 'POST' | 'DELETE' | 'PUT';

  constructor(private http: HttpClient, private helperService: HelperService) {
  }

  public makeRequestWithoutResponseHandler(url: string,
                                           requestType: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET',
                                           data: any = null,
                                           contentType: string = 'application/json',
                                           isMultipart: boolean = false,
                                           params: HttpParams = null) {
    if (!url.includes('http')) {
      url = EnvironmentConstants.SERVER_URL + EnvironmentConstants.CONTEXT_PATH + url;
    }
    const requestOptions = {'headers': this.getRequestHeaders(isMultipart, contentType)};
    if (requestType === 'GET') {
      if (params != null) {
        requestOptions['params'] = params;
      }
    } else {
      if (data != null) {
        requestOptions['body'] = data;
      }
    }
    return this.http.request(requestType, url, requestOptions);
  }

  public makerequest(context: any,
                     response_handler: any,
                     url: string,
                     requestType: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET',
                     data: any = null,
                     contentType: string = 'application/json',
                     isMultipart: boolean = false,
                     params: HttpParams = null) {
    if (!url.includes('http')) {
      url = EnvironmentConstants.SERVER_URL + EnvironmentConstants.CONTEXT_PATH + url;
    }
    const requestOptions = {'headers': this.getRequestHeaders(isMultipart, contentType)};
    if (requestType === 'GET') {
      if (params != null) {
        requestOptions['params'] = params;
      }
    } else {
      if (data != null) {
        requestOptions['body'] = data;
      }
    }

    this.http.request(requestType, url, requestOptions).subscribe(result => {

      let response = result['response'];
      response = this.decodeObjectFromJSON(response);
      if (response != null) {
        response_handler(context, response);
      }
    }, error2 => {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Communication failure!! Something went wrong',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
    });
  }

  private getRequestHeaders(isMultipart = false, contentType = 'application/json') {
    let headers: HttpHeaders;
    const token = localStorage.getItem(LcpConstants.auth_token_key);
    headers = new HttpHeaders({});
    if (!isMultipart) {
      headers = headers.append('Content-Type', contentType);
    }
    return headers;
  }

  public submitForm(formId: string, url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET') {
    const formElement: HTMLFormElement = <HTMLFormElement>document.getElementById(formId);
    if (formElement.checkValidity()) {
      formElement.action = url;
      formElement.method = method;
      formElement.submit();
    } else {
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
          if (response != null && response['success']) {
            observer.next(true);
          } else {
            observer.next(false);
          }
        },
        error2 => {
          const myListener: AlertDialogEvent = {
            isSuccess: false,
            message: 'Communication failure!! Error in route checking',
            onButtonClicked: () => {
            }
          };
          this.helperService.showAlertDialog(myListener);
          observer.next(false);
        }
      );
    });
    return _observable;
  }

}
