import {Component, OnInit} from '@angular/core';
import {HelperService} from '../utils/helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'Welcome To Seek Mentore';

  constructor(private helperService: HelperService) {
  }

  ngOnInit(): void {
    this.helperService.setTitle('Home');
  }
}
