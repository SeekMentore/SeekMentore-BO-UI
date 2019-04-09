import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { EnvironmentConstants } from 'src/app/utils/environment-constants';
import { HelperService } from 'src/app/utils/helper.service';
import { NlpRestUrls } from 'src/app/utils/nlp-rest-urls';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorCode: string;
  errorImageSrc: string;
  errorText: string;

  constructor(private helperService: HelperService, private route: ActivatedRoute, private utilityService: AppUtilityService) {
    this.errorCode = null;
    this.errorText = null;
    this.errorImageSrc = null;
    this.route.queryParams.subscribe(params => {});
    this.route.params.subscribe(params => {      
      this.errorCode = params['code'];
    });
  }

  ngOnInit() {
    this.helperService.setTitle('Error Occurred');
    if (!CommonUtilityFunctions.checkStringAvailability(this.errorCode)) {
      this.errorCode = '';
    }
    const formData = new URLSearchParams();
    formData.set('errorCode', this.errorCode);
    this.utilityService.makerequest(this, this.onSuccess, NlpRestUrls.error_page_url,
      'POST', formData.toString(), 'application/x-www-form-urlencoded');
    this.helperService.setTitle('Error Occurred');
  }

  onSuccess(context: any, response: any) {
    context.errorImageSrc = EnvironmentConstants.IMAGE_SERVER + response['errorImageSrc'];
    context.errorText = response['errorText'];
  }
}
