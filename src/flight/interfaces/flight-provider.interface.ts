import { Observable } from 'rxjs';
import { Flight } from './flight-interface';

export interface FlightProvider {
  getFlights(): Observable<Flight[]>;
  startPolling(): void;
  stopPolling(): void;
}
