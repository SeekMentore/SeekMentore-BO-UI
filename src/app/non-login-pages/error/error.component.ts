import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HelperService} from '../../utils/helper.service';
import {AppUtilityService} from '../../utils/app-utility.service';
import {EnvironmentConstants} from '../../utils/environment-constants';
import {NlpRestUrls} from '../../utils/nlp-rest-urls';


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
      this.utilityService.makeRequest(NlpRestUrls.errorPageURL,
        'POST', formData.toString(), 'application/x-www-form-urlencoded').subscribe(result => {
        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        if (response !== null) {
          this.errorImageSrc = EnvironmentConstants.IMAGE_SERVER + response['errorImageSrc'];
          this.errorText = response['errorText'];
        }
      }, error => {
      });
    }
    this.helperService.setTitle('Error Occurred');
  }
}
