import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { first, firstValueFrom, Observable, of } from 'rxjs';
import { FlightService } from './flight.service';
import { Flight } from './interfaces/flight-interface';
import { SOURCE_CONFIG_MOCK } from './mocks/config.mock';
import { MOCK_DATASOURCE } from './mocks/datasource.mock';
import { MOCK_FLIGHT } from './mocks/flight.mock';
import { MOCK_FLIGHT_PROVIDER } from './mocks/fly-provider.mock';
import { MOCK_SLICE } from './mocks/slice.mock';
import { SourceFactory } from './sources-factory/source-factory';

class FakeHttpService {}
class FakeSourceFactory {
  create = () => MOCK_DATASOURCE;
}
class FakeSchedulerRegistry {
  addTimeout = () => {};
  deleteTimeout = () => {};
}

describe('FlightService', () => {
  let service: FlightService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FlightService,
        { provide: HttpService, useClass: FakeHttpService },
        { provide: SchedulerRegistry, useClass: FakeSchedulerRegistry },
        { provide: SourceFactory, useClass: FakeSourceFactory },
      ],
    }).compile();

    service = app.get<FlightService>(FlightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get FlightUniqId', () => {
    const uniqId = service['getFlightUniqId'](MOCK_SLICE);
    expect(uniqId).toEqual(
      '144-2019-08-08T04:30:00.000Z-2019-08-08T06:25:00.000Z',
    );
  });

  it('should remove Duplicates', () => {
    const uniqFlights = service['removeDuplicates']([MOCK_FLIGHT, MOCK_FLIGHT]);
    expect(uniqFlights.length).toEqual(1);
  });

  it('should return Flights Observables', () => {
    const sources = [MOCK_DATASOURCE];

    sources.forEach((source) => {
      jest.spyOn(source, 'getFlights').mockReturnValue(of([MOCK_FLIGHT]));
    });

    const observables = service['getFlightsObservables'](sources);

    expect(observables.length).toEqual(1);
    sources.forEach((source) => {
      expect(jest.spyOn(source, 'getFlights')).toHaveBeenCalled();
    });
  });

  it('should get DataSources', () => {
    const spy = jest
      .spyOn(service['sourceFactory'], 'create')
      .mockReturnValue(MOCK_FLIGHT_PROVIDER);

    const dataSources = service['getDataSources']({
      testConf: SOURCE_CONFIG_MOCK,
      testConf2: SOURCE_CONFIG_MOCK,
    });

    expect(dataSources.length).toEqual(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should get Flights Aggregated Observable', async () => {
    const spy = jest
      .spyOn(service as any, 'getFlightsObservables')
      .mockReturnValue(of([MOCK_FLIGHT, MOCK_FLIGHT]));

    const spy2 = jest.spyOn(service as any, 'removeDuplicates');

    const flights: Flight[] = await firstValueFrom(
      service['getFlightsAggregatedObservable']([MOCK_FLIGHT_PROVIDER]),
    );

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(flights.length).toEqual(1);
  });

  it('should return getFlights Observable', async () => {
    (service as any).flights$ = of([MOCK_FLIGHT]);
    const flights: Flight[] = await service['getFlights']();
    expect(flights.length).toEqual(1);
  });
});
