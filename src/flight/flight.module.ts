import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { FlightBaseService } from './providers/flight-base.service';
import { Source1Service } from './providers/source1.service';
import { Source2Service } from './providers/source2.service';

// TODO Petro bulk barrel import
// import * as flightProviders from './providers';

@Module({
  controllers: [FlightController],
  imports: [HttpModule],
  providers: [FlightService, FlightBaseService, Source1Service, Source2Service],
})
export class FlightModule {}
