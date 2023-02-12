import { of } from 'rxjs';
import { FlightProvider } from '../interfaces/flight-provider.interface';
import { MOCK_FLIGHT } from './flight.mock';

export const MOCK_FLIGHT_PROVIDER: FlightProvider = {
  getFlights: () => {
    return of([MOCK_FLIGHT]);
  },
  startPolling: () => {},
  stopPolling: () => {},
};
