import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPackagesComponent } from './subscription-packages.component';

describe('SubscriptionPackagesComponent', () => {
  let component: SubscriptionPackagesComponent;
  let fixture: ComponentFixture<SubscriptionPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
