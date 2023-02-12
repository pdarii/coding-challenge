import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { FlightService } from './flight.service';

class FakeHttpService {}

describe('FlightService', () => {
  let service: FlightService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FlightService,
        { provide: HttpService, useClass: FakeHttpService },
      ],
    }).compile();

    service = app.get<FlightService>(FlightService);
    jest.spyOn(service as any, 'getDataSources').mockReturnValue([]);
    jest
      .spyOn(service as any, 'getFlightsAggregatedObservable')
      .mockReturnValue(of([]));
  });

  // this.dataSources = this.getDataSources(configs);
  // this.flights$ = this.getFlightsAggregatedObservable(this.dataSources);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// TODO Petro
