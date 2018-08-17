import {Component, OnInit} from '@angular/core';

import {AppUtilityService} from '../utils/app-utility.service';
import {HelperService} from "../utils/helper.service";
import {AppConstants} from "../utils/app-constants";


@Component({
  selector: 'app-login-pages',
  templateUrl: './login-pages.component.html',
  styleUrls: ['./login-pages.component.css']
})
export class LoginPagesComponent implements OnInit {
  title = 'Welcome To Seek Mentore';
  staticPageURl = '';
  username = '';
  menu: MenuItem[] = [];

  constructor(private helperService: HelperService, private utilityService: AppUtilityService) {
    this.staticPageURl = AppConstants.PUBLIC_PAGES_URL;
  }

  ngOnInit(): void {
    this.helperService.titleState.subscribe((title: string) => {
      this.title = title;
    });
    this.parseMenu();
    document.addEventListener('click', (event => {
      if (this.menu.length === 0) {
        return;
      }
      let menuButtonClicked = false;
      this.menu.forEach((item, index) => {
        let element: HTMLElement = null;
        if (item.submenu) {
          element = document.getElementById('menuButton' + index);
        }

        if (element != null && element.id === (<any>event.target).id) {
          menuButtonClicked = true;

        }
      });
      if (menuButtonClicked === false) {
        // hide menu by sending invalid id
        this.showDropMenu(-1);
      }
      // console.log(menuButtonClicked, event.target);
    }));
  }

  public parseMenu() {
    this.utilityService.getBasicInfo().subscribe(result => {
      let response = result['response'];
      response = this.utilityService.decodeObjectFromJSON(response);
      if (response != null) {
        this.username = response['username'];
        this.helperService.setTitle('Welcome ' + this.username);
        this.menu = response['menu'];
        console.log(this.username, this.menu);
      }
    }, error => {
    });
  }

  public showDropMenu(id: number) {
    this.menu.forEach((item, index) => {
      let element = null;
      if (item.submenu) {
        element = document.getElementById('menuBox' + index);
      }
      if (element != null) {

        if (id === index) {
          if (element.style.display === 'block') {
            element.style.display = 'none';
          } else {
            element.style.display = 'block';
          }
        } else {
          element.style.display = 'none';
        }
      }
    });
  }

}

interface SubMenuItem {
  name: string;
  url: string;
}

interface MenuItem {
  name: string;
  submenu: boolean;
  submenuitems: SubMenuItem[];
}
