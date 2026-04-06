import { Controller, Get, Query } from '@nestjs/common';
import { MoveService } from './move.service';

@Controller('move')
export class MoveController {
  constructor(private readonly moveService: MoveService) {}

  @Get()
  async getVehicles(@Query('q') query: string) {
    return this.moveService.findAll(query);
  }
}
