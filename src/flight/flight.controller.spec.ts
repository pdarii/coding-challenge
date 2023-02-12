import { Test, TestingModule } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { Flight } from './interfaces/flight-interface';

const MOCK_FLIGHT: Flight = {
  slices: [
    {
      origin_name: 'Schonefeld',
      destination_name: 'Stansted',
      departure_date_time_utc: '2019-08-08T04:30:00.000Z',
      arrival_date_time_utc: '2019-08-08T06:25:00.000Z',
      flight_number: '144',
      duration: 115,
    },
    {
      origin_name: 'Stansted',
      destination_name: 'Schonefeld',
      departure_date_time_utc: '2019-08-10T05:35:00.000Z',
      arrival_date_time_utc: '2019-08-10T07:35:00.000Z',
      flight_number: '8542',
      duration: 120,
    },
  ],
  price: 129,
};

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
