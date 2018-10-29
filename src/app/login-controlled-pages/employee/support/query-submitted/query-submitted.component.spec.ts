import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySubmittedComponent } from './query-submitted.component';

describe('QuerySubmittedComponent', () => {
  let component: QuerySubmittedComponent;
  let fixture: ComponentFixture<QuerySubmittedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerySubmittedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
