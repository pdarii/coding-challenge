import { BreakerState } from '../enums/breaker-states.enum';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Logger } from '@nestjs/common';
import { Flight } from '../interfaces/flight-interface';

// In real life constants should be moved somewhere / .env / db / etc
const FAILURE_TIMEOUT = 5000; // milliseconds
const SUCCESS_TIMEOUT = 10000; // milliseconds

export class CircuitBreaker {
  private url: string;
  private state: BreakerState = BreakerState.GREEN;
  private nextAttempt: number = Date.now();
  private failureTimeout: number = FAILURE_TIMEOUT;
  private successTimeout: number = SUCCESS_TIMEOUT;
  private readonly logger = new Logger();

  constructor(private readonly httpService: HttpService, url: string) {
    this.url = url;
  }

  public async exec(): Promise<AxiosResponse | Error> {
    if (this.nextAttempt <= Date.now()) {
      this.state = BreakerState.YELLOW;
    } else {
      throw new Error(`Suspended call to ${this.url}`);
    }

    try {
      const response: AxiosResponse<Flight[]> =
        await this.httpService.axiosRef.get(this.url);
      return response.status === 200 ? this.success(response) : this.failure();
    } catch (err) {
      return this.failure();
    }
  }

  private success(res: AxiosResponse<Flight[]>): AxiosResponse<Flight[]> {
    if (this.state === BreakerState.YELLOW) {
      this.state = BreakerState.GREEN;
      this.nextAttempt = Date.now() + this.successTimeout;
    }

    this.logger.log(
      `Success call to ${this.url}, next call on ${new Date(
        this.nextAttempt,
      ).toISOString()}`,
    );

    return res;
  }

  private failure(): Error {
    this.state = BreakerState.RED;
    this.nextAttempt = Date.now() + this.failureTimeout;

    this.logger.warn(
      `Failed call to ${this.url}, next call on ${new Date(
        this.nextAttempt,
      ).toISOString()} `,
    );
    throw new Error(`Failed call to ${this.url}`);
  }
}
