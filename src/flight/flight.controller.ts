import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FlightService } from './flight.service';
import { Flight } from './interfaces/flight-interface';

export const GET_FLIGHTS_CACHE_KEY = 'GET_FLIGHTS_CACHE';

@Controller()
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  getFlights(): Observable<Flight[]> {
    return this.flightService.getFlights();
  }
}
