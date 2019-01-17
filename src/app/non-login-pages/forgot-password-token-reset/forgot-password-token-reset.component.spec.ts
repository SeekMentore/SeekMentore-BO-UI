import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordTokenResetComponent } from './forgot-password-token-reset.component';

describe('ForgotPasswordTokenResetComponent', () => {
  let component: ForgotPasswordTokenResetComponent;
  let fixture: ComponentFixture<ForgotPasswordTokenResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordTokenResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordTokenResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
