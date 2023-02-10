import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Flight } from '../interfaces/flight-interface';

// TODO interface

export abstract class SourceBase {
  protected url: string;
  protected readonly logger = new Logger();
  abstract getFlights(): Observable<Flight[]>;
}
