import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonLoginPagesComponent } from './non-login-pages.component';

describe('NonLoginPagesComponent', () => {
  let component: NonLoginPagesComponent;
  let fixture: ComponentFixture<NonLoginPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonLoginPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonLoginPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
