import { TestBed, inject } from '@angular/core/testing';

import { AppUtilityService } from './app-utility.service';

describe('AppUtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppUtilityService]
    });
  });

  it('should be created', inject([AppUtilityService], (service: AppUtilityService) => {
    expect(service).toBeTruthy();
  }));
});
