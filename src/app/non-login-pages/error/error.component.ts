import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppUtilityService } from '../../utils/app-utility.service';
import { EnvironmentConstants } from '../../utils/environment-constants';
import { HelperService } from '../../utils/helper.service';
import { NlpRestUrls } from '../../utils/nlp-rest-urls';

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
    this.route.queryParams.subscribe(params => {
      this.errorCode = params['errorCode'];
    });
  }

  ngOnInit() {
    this.helperService.setTitle('Error Occurred');
    if (this.errorCode != null) {
      const formData = new URLSearchParams();
      formData.set('errorCode', this.errorCode);
      this.utilityService.makerequest(this, this.onSuccess, NlpRestUrls.errorPageURL,
        'POST', formData.toString(), 'application/x-www-form-urlencoded');      
    }
    this.helperService.setTitle('Error Occurred');
  }

  onSuccess(context: any, response: any) {
    context.errorImageSrc = EnvironmentConstants.IMAGE_SERVER + response['errorImageSrc'];
    context.errorText = response['errorText'];
  }
}
