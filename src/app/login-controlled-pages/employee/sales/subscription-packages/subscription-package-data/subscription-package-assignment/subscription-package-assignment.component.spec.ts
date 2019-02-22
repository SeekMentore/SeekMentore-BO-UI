import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPackageAssignmentComponent } from './subscription-package-assignment.component';

describe('SubscriptionPackageAssignmentComponent', () => {
  let component: SubscriptionPackageAssignmentComponent;
  let fixture: ComponentFixture<SubscriptionPackageAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionPackageAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPackageAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
