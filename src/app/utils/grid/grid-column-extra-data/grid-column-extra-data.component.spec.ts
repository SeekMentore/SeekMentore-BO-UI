import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridColumnExtraDataComponent } from './grid-column-extra-data.component';

describe('GridColumnExtraDataComponent', () => {
  let component: GridColumnExtraDataComponent;
  let fixture: ComponentFixture<GridColumnExtraDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridColumnExtraDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColumnExtraDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
