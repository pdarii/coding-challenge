import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FlightModule } from './flight/flight.module';

@Module({
  imports: [FlightModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}

// TODO Petro add server tests
