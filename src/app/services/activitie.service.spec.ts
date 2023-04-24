import { TestBed } from '@angular/core/testing';

import { ActivitieService } from './activitie.service';

describe('ActivitieService', () => {
  let service: ActivitieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
