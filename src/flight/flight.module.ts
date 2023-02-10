import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { flightSourceFactory } from './flight-provider-factory';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';

@Module({
  controllers: [FlightController],
  imports: [HttpModule, CacheModule.register({ ttl: 1000 })], // TODO update to 60 minutes and move to .env
  providers: [FlightService, flightSourceFactory],
})
export class FlightModule {}