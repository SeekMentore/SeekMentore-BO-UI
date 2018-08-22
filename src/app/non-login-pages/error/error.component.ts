import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppUtilityService} from '../../utils/app-utility.service';
import {AppConstants} from '../../utils/app-constants';
import {NlpRestUrls} from '../../utils/nlp-rest-urls';
import {HelperService} from '../../utils/helper.service';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorCode: string;
  errorImageSrc: string;
  errorText: string;

  constructor(private route: ActivatedRoute, private utilityService: AppUtilityService, private helperService: HelperService) {
    this.errorCode = null;
    this.errorText = null;
    this.errorImageSrc = null;
    this.route.queryParams.subscribe(params => {
      this.errorCode = params['errorCode'];
    });
  }

  ngOnInit() {
    if (this.errorCode != null) {
      this.utilityService.makeRequest(NlpRestUrls.errorPageURL,
        'POST', {errorcode: this.errorCode}, 'application/x-www-form-urlencoded').subscribe(result => {
        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        if (response !== null) {
          this.errorImageSrc = AppConstants.IMAGE_SERVER + response['errorImageSrc'];
          this.errorText = response['errorText'];
        }
      }, error => {
      });
    }
    this.helperService.setTitle('Error Occurred');
  }
}
