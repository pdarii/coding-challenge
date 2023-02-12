import { of } from 'rxjs';
import { MOCK_FLIGHT } from './flight.mock';

class MockDatasource {
  getFlights = () => {
    return of([MOCK_FLIGHT]);
  };
  startPolling = () => {};
  stopPolling = () => {};
}

export const MOCK_DATASOURCE = new MockDatasource();
