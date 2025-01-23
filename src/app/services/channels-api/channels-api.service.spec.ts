import { TestBed } from '@angular/core/testing';

import { ChannelsApiService } from './channels-api.service';

describe('ChannelsApiService', () => {
  let service: ChannelsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
