import { SourcesTypeEnum } from './../../enums/sources-enum';
import { Source1 } from '../source1';
import { FlightsResilienceService } from './../../flights-resilience/flights-resilience.service';
import { AxiosResponse } from 'axios';
import { MOCK_FLIGHT } from './../../mocks/flight.mock';
import { firstValueFrom, of } from 'rxjs';
import { Flight } from './../../interfaces/flight-interface';

class FakeFlightsResilienceService {
  startPolling = () => {};
  stopPolling = () => {};
  getFlights = () => of([]);
}

describe('Source1', () => {
  let service: Source1;

  beforeEach(async () => {
    service = new Source1(
      'testUrl',
      SourcesTypeEnum.source1,
      new FakeFlightsResilienceService() as unknown as FlightsResilienceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should mapResponseData', () => {
    const axiosResponse = {
      data: { flights: [MOCK_FLIGHT, MOCK_FLIGHT] },
    } as AxiosResponse;

    const flights = service['mapResponseData'](axiosResponse);
    expect(flights.length).toEqual(2);
  });

  it('should startPolling', () => {
    const spy = jest.spyOn(service['flightsResilienceService'], 'startPolling');
    service.startPolling();
    expect(spy).toHaveBeenCalled();
  });

  it('should stopPolling', () => {
    const spy = jest.spyOn(service['flightsResilienceService'], 'stopPolling');
    service.stopPolling();
    expect(spy).toHaveBeenCalled();
  });

  it('should get Flights Observable', async () => {
    const axiosResponse = {
      data: { flights: [MOCK_FLIGHT, MOCK_FLIGHT] },
    } as AxiosResponse;

    const spy = jest
      .spyOn(service['flightsResilienceService'], 'getFlights')
      .mockReturnValue(of(axiosResponse));

    const flights: Flight[] = await firstValueFrom(service.getFlights());

    expect(spy).toHaveBeenCalled();
    expect(flights.length).toEqual(2);
  });
});
