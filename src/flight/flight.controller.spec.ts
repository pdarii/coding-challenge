import { Test, TestingModule } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { MOCK_FLIGHT } from './mocks/flight.mock';

class FakeFlightService {
  getFlights = () => of();
}

describe('FlightController', () => {
  let flightController: FlightController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FlightController],
      providers: [{ provide: FlightService, useClass: FakeFlightService }],
    }).compile();

    flightController = app.get<FlightController>(FlightController);
  });

  it('should be defined', () => {
    expect(flightController).toBeDefined();
  });

  describe('root', () => {
    it('should call service and return Observable', async () => {
      const spy = jest
        .spyOn(flightController['flightService'], 'getFlights')
        .mockReturnValue(firstValueFrom(of([MOCK_FLIGHT])));

      const flights = await flightController.getFlights();

      expect(spy).toHaveBeenCalled();
      expect(flights.length).toBe(1);
    });
  });
});
