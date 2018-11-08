import { Component, OnInit } from '@angular/core';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userType: string = ''; 

  constructor(private router: Router) {
    this.userType = localStorage.getItem(LcpConstants.user_type_key);
  }

  ngOnInit() {
    console.log('Home');
    this.userType = localStorage.getItem(LcpConstants.user_type_key);    
  }
}
