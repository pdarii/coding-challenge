import { Module } from '@nestjs/common';
import { FlightModule } from './flight/flight.module';

@Module({
  imports: [FlightModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

// TODO Petro add server tests
// TODO logger
