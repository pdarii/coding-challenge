import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';

@Module({
  controllers: [FlightController],
  imports: [HttpModule],
  providers: [FlightService],
})
export class FlightModule {}
