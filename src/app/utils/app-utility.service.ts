import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConstants} from './app-constants';
import {Observable} from 'rxjs/index';
import {EnvironmentConstants} from './environment-constants';
import {LcpRestUrls} from './lcp-rest-urls';
import {LcpConstants} from "./lcp-constants";

@Injectable({
  providedIn: 'root'
})
export class AppUtilityService {

  type: 'GET' | 'POST' | 'DELETE' | 'PUT';

  constructor(private http: HttpClient) {
  }

  public makeRequest(url: string,
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

  public makerequest(context: any, response_handler: any, url: string,
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
    });
  }

  private getRequestHeaders(isMultipart = false, contentType = 'application/json') {
    let headers: HttpHeaders;
    const token = localStorage.getItem(LcpConstants.auth_token_key);
    // console.log(token);
    headers = new HttpHeaders({
      // // 'Access-Control-Allow-Origin': '*',
    });
    // headers = headers.append('origin-client', AppConstants.ORIGIN_CLIENT);
    if (!isMultipart) {
      headers = headers.append('Content-Type', contentType);
    }
    // if (token) {
    //   headers = headers.append('client-auth-token', token);
    // }
    return headers;
  }

  public submitForm(formId: string, url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET') {
    const formElement: HTMLFormElement = <HTMLFormElement>document.getElementById(formId);
    if (formElement.checkValidity()) {
      formElement.action = url;
      formElement.method = method;
      formElement.submit();
    } else {
      // show validation error
    }
  }


  public decodeObjectFromJSON(json) {
    return null != json ? JSON.parse(json) : null;
  }

  public checkUIPathAccess(path: string): Observable<boolean> {
    const params = {
      urlPath: path
    };
    const _observable = new Observable<boolean>(observer => {
      this.makeRequest(LcpRestUrls.uiAccessUrl, 'POST', JSON.stringify(params)).subscribe(
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
          observer.next(false);
        }
      );
    });
    return _observable;
  }

}
