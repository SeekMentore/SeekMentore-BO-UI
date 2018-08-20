import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginControlledPagesComponent } from './login-controlled-pages.component';

describe('LoginControlledPagesComponent', () => {
  let component: LoginControlledPagesComponent;
  let fixture: ComponentFixture<LoginControlledPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginControlledPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginControlledPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
