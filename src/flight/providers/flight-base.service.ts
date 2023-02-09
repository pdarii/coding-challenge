import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Flight } from '../interfaces/flight-interface';

@Injectable()
export class FlightBaseService {
  protected url: string;

  constructor(protected readonly httpService: HttpService) {}

  getFlights(): Observable<AxiosResponse<Flight[]>> {
    return this.httpService.get(this.url);
  }
}
