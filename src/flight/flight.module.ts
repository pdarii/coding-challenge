import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { SourceFactory } from './sources-factory/source-factory';

@Module({
  controllers: [FlightController],
  imports: [HttpModule],
  providers: [FlightService, SourceFactory],
})
export class FlightModule {}
