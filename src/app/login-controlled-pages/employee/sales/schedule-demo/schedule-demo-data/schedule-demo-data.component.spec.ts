import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDemoDataComponent } from './schedule-demo-data.component';

describe('ScheduleDemoDataComponent', () => {
  let component: ScheduleDemoDataComponent;
  let fixture: ComponentFixture<ScheduleDemoDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleDemoDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDemoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
