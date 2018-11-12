import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTrackerDataComponent } from './demo-tracker-data.component';

describe('DemoTrackerDataComponent', () => {
  let component: DemoTrackerDataComponent;
  let fixture: ComponentFixture<DemoTrackerDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoTrackerDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTrackerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
