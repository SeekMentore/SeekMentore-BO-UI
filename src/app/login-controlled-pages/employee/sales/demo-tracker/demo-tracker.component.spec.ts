import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTrackerComponent } from './demo-tracker.component';

describe('DemoTrackerComponent', () => {
  let component: DemoTrackerComponent;
  let fixture: ComponentFixture<DemoTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
