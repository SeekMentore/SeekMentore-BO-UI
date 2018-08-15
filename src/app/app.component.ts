import {Component, OnInit} from '@angular/core';
import {AppConstants} from './utils/app-constants';
import {HelperService} from './utils/helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Welcome To Seek Mentore';
  staticPageURl = AppConstants.PUBLIC_PAGES_URL;

  constructor(private helperService: HelperService) {
  }

  ngOnInit(): void {
    this.helperService.titleState.subscribe((title: string) => {
      this.title = title;
    });
  }
}
