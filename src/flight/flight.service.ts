import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Flight } from './interfaces/flight-interface';
import { Source1Service } from './providers/source1.service';

@Injectable()
export class FlightService {
  protected url: string;

  constructor(private source1Service: Source1Service) {}

  getFlights(): Observable<AxiosResponse<Flight[]>> {
    return this.source1Service.getFlights();
  }
}
