import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedCustomerComponent } from './subscribed-customer.component';

describe('SubscribedCustomerComponent', () => {
  let component: SubscribedCustomerComponent;
  let fixture: ComponentFixture<SubscribedCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribedCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribedCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
