import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedCustomerDataComponent } from './subscribed-customer-data.component';

describe('SubscribedCustomerDataComponent', () => {
  let component: SubscribedCustomerDataComponent;
  let fixture: ComponentFixture<SubscribedCustomerDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribedCustomerDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribedCustomerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
