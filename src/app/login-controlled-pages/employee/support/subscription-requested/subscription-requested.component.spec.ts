import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionRequestedComponent } from './subscription-requested.component';

describe('SubscriptionRequestedComponent', () => {
  let component: SubscriptionRequestedComponent;
  let fixture: ComponentFixture<SubscriptionRequestedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionRequestedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
