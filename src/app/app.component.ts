import {Component, OnInit} from '@angular/core';
import {AppConstants} from './utils/app-constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  staticPageURl = AppConstants.PUBLIC_PAGES_URL;

  constructor() {
  }

  ngOnInit(): void {

  }
}
