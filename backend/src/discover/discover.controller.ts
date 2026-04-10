import { Controller, Get, Query } from '@nestjs/common';
import { DiscoverService } from './discover.service';

@Controller('api')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get('destinations/trending')
  async getTrendingDestinations(@Query('limit') limit?: string) {
    return this.discoverService.getTrendingDestinations(
      limit ? parseInt(limit) : 8,
    );
  }

  @Get('destinations/search')
  async searchDestinations(@Query('q') query: string) {
    return this.discoverService.searchDestinations(query);
  }

  @Get('destinations/trending-this-week')
  async getTrendingThisWeek() {
    return this.discoverService.getTrendingThisWeek();
  }

  @Get('experiences')
  async getExperiences(@Query('limit') limit?: string) {
    return this.discoverService.getExperiences(limit ? parseInt(limit) : 6);
  }

  @Get('moods')
  async getMoods() {
    return this.discoverService.getMoods();
  }
}
