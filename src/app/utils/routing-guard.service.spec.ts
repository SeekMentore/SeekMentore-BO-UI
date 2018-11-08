import { TestBed, inject } from '@angular/core/testing';

import { RoutingGuardService } from './routing-guard.service';

describe('RoutingGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutingGuardService]
    });
  });

  it('should be created', inject([RoutingGuardService], (service: RoutingGuardService) => {
    expect(service).toBeTruthy();
  }));
});
