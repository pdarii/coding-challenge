import { Observable } from 'rxjs';
import { Flight } from './flight-interface';

export interface FlightProvider {
  getFlights(): Observable<Flight[]>;
  flights$: Observable<Flight[]>;
}
