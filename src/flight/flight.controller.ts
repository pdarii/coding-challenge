import { Controller, Get } from '@nestjs/common';
import { FlightService } from './flight.service';

@Controller()
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get()
  getFlights(): any {
    this.flightService.getFlights().subscribe((res) => {
      console.log(res.data);
    });

    return true;
  }
}
