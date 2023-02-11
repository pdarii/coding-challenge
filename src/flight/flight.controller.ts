import { Controller, Get } from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight } from './interfaces/flight-interface';

@Controller()
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get()
  getFlights(): Promise<Flight[]> {
    return this.flightService.getFlights();
  }
}
