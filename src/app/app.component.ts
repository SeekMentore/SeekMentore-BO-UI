import { Component, OnInit } from '@angular/core';
import { EnvironmentConstants } from './utils/environment-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  staticPageURl = EnvironmentConstants.PUBLIC_PAGES_URL;

  constructor() {
  }

  ngOnInit(): void {
  }
}
