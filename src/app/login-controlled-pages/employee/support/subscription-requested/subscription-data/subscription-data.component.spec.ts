import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDataComponent } from './subscription-data.component';

describe('SubscriptionDataComponent', () => {
  let component: SubscriptionDataComponent;
  let fixture: ComponentFixture<SubscriptionDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
