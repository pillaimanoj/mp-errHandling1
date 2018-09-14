import { TestBed, inject } from '@angular/core/testing';

import { ErrorLogService } from './error-log.service';

describe('ErrorServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorLogService]
    });
  });

  it('should be created', inject([ErrorLogService], (service: ErrorLogService) => {
    expect(service).toBeTruthy();
  }));
});
