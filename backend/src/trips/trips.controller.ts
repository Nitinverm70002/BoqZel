import { Controller, Get, Query } from '@nestjs/common';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get('airports')
  async searchAirports(@Query('q') q: string) {
    return this.tripsService.searchAirports(q);
  }

  @Get('search')
  async searchFlights(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('date') date: string,
  ) {
    return this.tripsService.searchFlights(from, to, date);
  }
}
