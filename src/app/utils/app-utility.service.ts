import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConstants} from './app-constants';
import {Observable} from 'rxjs/index';
import {EnvironmentConstants} from './environment-constants';

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

  public makerequest(context: any, response_handler: any,  url: string,
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
    headers = new HttpHeaders({
      // 'Access-Control-Allow-Origin': '*',
    });
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
      // show validation error
    }
  }


  public decodeObjectFromJSON(json) {
    return null != json ? JSON.parse(json) : null;
  }

}
