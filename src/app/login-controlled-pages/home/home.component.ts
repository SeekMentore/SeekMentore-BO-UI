import { Component, OnInit } from '@angular/core';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/utils/helper.service';
import { AppUtilityService } from 'src/app/utils/app-utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userType: string = ''; 

  constructor(private helperService: HelperService, private utilityService: AppUtilityService, private router: Router) {
    this.userType = localStorage.getItem(LcpConstants.user_type_key);
  }

  ngOnInit() {
    console.log('Home');
    this.userType = localStorage.getItem(LcpConstants.user_type_key);    
  }

  /*
  commonTestFunction(context: any, response: any) {
    console.log('Successfull call');
  }

  uwhxue() {
    const data = {
      filters: "Filters for uwhxue"
    };
    this.utilityService.makerequest(this, this.commonTestFunction, '/rest/login/uwhxue', 'POST',
      this.utilityService.urlEncodeData(data),
      'application/x-www-form-urlencoded');
  }

  uwhaj() {
    const data = {
      filters: "Filters for uwhaj"
    };
    this.utilityService.makerequest(this, this.commonTestFunction, '/rest/login/uwhaj', 'POST',
      JSON.stringify(data));
  }

  uwohxue() {
    const data = {      
      filters: "JSON Component Filters for uwohxue"
    };
    this.utilityService.makeRequestWithoutResponseHandler('/rest/login/uwohxue', 'POST',
    this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded').subscribe(
      result => {
        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        console.log('Successfull call without handler');
      },
      error2 => {
        console.log('Un-Successfull call without handler');
      }
    );
  }

  uwohaj() {
    const data = {      
      filters: "JSON Component Filters for uwohaj"
    };
    this.utilityService.makeRequestWithoutResponseHandler('/rest/login/uwohaj', 'POST',
    JSON.stringify(data)).subscribe(
      result => {
        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        console.log('Successfull call without handler');
      },
      error2 => {
        console.log('Un-Successfull call without handler');
      }
    );
  }

  swhxue() {
    const data = {
      filters: "Filters for swhxue"
    };
    this.utilityService.makerequest(this, this.commonTestFunction, '/rest/login/swhxue', 'POST',
      this.utilityService.urlEncodeData(data),
      'application/x-www-form-urlencoded');
  }

  swhaj() {
    const data = {
      filters: "Filters for swhaj"
    };
    this.utilityService.makerequest(this, this.commonTestFunction, '/rest/login/swhaj', 'POST',
      JSON.stringify(data));
  }

  swohxue() {
    const data = {      
      filters: "JSON Component Filters for swohxue"
    };
    this.utilityService.makeRequestWithoutResponseHandler('/rest/login/swohxue', 'POST',
    this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded').subscribe(
      result => {
        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        console.log('Successfull call without handler');
      },
      error2 => {
        console.log('Un-Successfull call without handler');
      }
    );
  }

  swohaj() {
    const data = {      
      filters: "JSON Component Filters for swohaj"
    };
    this.utilityService.makeRequestWithoutResponseHandler('/rest/login/swohaj', 'POST',
    JSON.stringify(data)).subscribe(
      result => {
        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        console.log('Successfull call without handler');
      },
      error2 => {
        console.log('Un-Successfull call without handler');
      }
    );
  }
  */
}
