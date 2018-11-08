import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridRecordPopUpComponent } from './grid-record-pop-up.component';

describe('GridRecordPopUpComponent', () => {
  let component: GridRecordPopUpComponent;
  let fixture: ComponentFixture<GridRecordPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridRecordPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridRecordPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
