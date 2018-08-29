import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGridComponent } from './create-grid.component';

describe('CreateGridComponent', () => {
  let component: CreateGridComponent;
  let fixture: ComponentFixture<CreateGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
