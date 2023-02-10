import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FlightBaseService } from './flight-base.service';

const url = 'https://coding-challenge.powerus.de/flight/source2';

@Injectable()
export class Source2Service extends FlightBaseService {
  constructor() {
    super(new HttpService());
    this.url = url;
  }
}
