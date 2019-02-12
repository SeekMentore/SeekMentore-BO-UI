import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPackageDataComponent } from './subscription-package-data.component';

describe('SubscriptionPackageDataComponent', () => {
  let component: SubscriptionPackageDataComponent;
  let fixture: ComponentFixture<SubscriptionPackageDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionPackageDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPackageDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
