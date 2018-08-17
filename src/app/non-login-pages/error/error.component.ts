import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppUtilityService} from "../../utils/app-utility.service";
import {AppConstants} from "../../utils/app-constants";


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorCode: string;
  errorImageSrc: string;
  errorText: string;

  constructor(private route: ActivatedRoute, private utilityService: AppUtilityService) {
    this.errorCode = null;
    this.errorText = null;
    this.errorImageSrc = null;
    this.route.queryParams.subscribe(params => {
      this.errorCode = params['errorcode'];
    });
  }

  ngOnInit() {
    if (this.errorCode != null) {
      this.utilityService.makeRequest(AppConstants.errorPageURL,
        'POST', {errorcode: this.errorCode}, 'application/x-www-form-urlencoded').subscribe(result => {
        this.errorImageSrc = result['errorImageSrc'];
        this.errorText = result['errorText'];
      }, error => {
      });
    }
  }

}
