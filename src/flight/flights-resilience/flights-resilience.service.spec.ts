import { Test, TestingModule } from '@nestjs/testing';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { FlightsResilienceService } from './flights-resilience.service';
import { AxiosResponse } from 'axios';
import { MOCK_FLIGHT } from '../mocks/flight.mock';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FakeSchedulerRegistry } from '../mocks/fake-scheduler-registry.mock';

class FakeHttpService {
  axiosRef = {
    get: () => {},
  };
}

describe('FlightsResilienceService', () => {
  let service: FlightsResilienceService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [FlightsResilienceService],
    }).compile();

    service = app.get<FlightsResilienceService>(FlightsResilienceService);
    service['schedulerRegistry'] = new FakeSchedulerRegistry() as any;
    service['httpService'] = new FakeHttpService() as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return private flights Observable', async () => {
    const axiosResponse = { data: [MOCK_FLIGHT] } as AxiosResponse;
    (service as any).flights$ = of(axiosResponse);
    const flights = await firstValueFrom(service['getFlights']());
    expect(flights.data.length).toEqual(1);
  });

  it('should stop Polling', () => {
    const spy = jest.spyOn(service['schedulerRegistry'], 'deleteTimeout');

    service.stopPolling();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle success', async () => {
    const spy = jest.spyOn(service, 'startPolling');
    const axiosResponse = { data: [] } as AxiosResponse;

    (service as any).failedAttempts = 5;
    (service as any).flights$ = new BehaviorSubject(axiosResponse);

    service['success']({ data: [MOCK_FLIGHT, MOCK_FLIGHT] } as AxiosResponse);

    expect((service as any).failedAttempts).toEqual(0);
    expect(spy).toHaveBeenCalledWith((service as any).successTimeout);

    const flights = await firstValueFrom(service['getFlights']());
    expect(flights.data.length).toEqual(2);
  });

  it('should handle failure', () => {
    const spy = jest.spyOn(service, 'startPolling');

    (service as any).failedAttempts = 5;

    service['failure']();

    expect((service as any).failedAttempts).toEqual(6);

    const newInterval = (service as any).getNewFailedInterval();
    expect(spy).toHaveBeenCalledWith(newInterval);
  });

  it('should get New Failed Interval', () => {
    (service as any).failedAttempts = 2;
    const newInterval = (service as any).getNewFailedInterval();
    expect(newInterval).toEqual(20000);
  });

  it('should start Polling', () => {
    const spy = jest.spyOn(service['schedulerRegistry'], 'addTimeout');
    service.startPolling();
    expect(spy).toHaveBeenCalled();
  });

  it('should execute Http Call with success', async () => {
    const axiosResponse = { data: [], status: 200 } as AxiosResponse;
    const spy = jest
      .spyOn(service['httpService'].axiosRef, 'get')
      .mockReturnValue(firstValueFrom(of(axiosResponse)));

    const spy2 = jest.spyOn(service as any, 'success');
    const spy3 = jest.spyOn(service as any, 'failure');

    await service['executeHttpCall']();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('should execute Http Call with fail', async () => {
    const axiosResponse = { data: [], status: 500 } as AxiosResponse;
    const spy = jest
      .spyOn(service['httpService'].axiosRef, 'get')
      .mockReturnValue(firstValueFrom(of(axiosResponse)));

    const spy2 = jest.spyOn(service as any, 'success');
    const spy3 = jest.spyOn(service as any, 'failure');

    await service['executeHttpCall']();

    expect(spy).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should execute Http Call with Error', async () => {
    const spy = jest
      .spyOn(service['httpService'].axiosRef, 'get')
      .mockReturnValue(
        firstValueFrom(of(new HttpException('Test', HttpStatus.BAD_REQUEST))),
      );

    const spy2 = jest.spyOn(service as any, 'success');
    const spy3 = jest.spyOn(service as any, 'failure');

    await service['executeHttpCall']();

    expect(spy).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });
});
