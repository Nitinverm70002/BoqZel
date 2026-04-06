import { Controller, Get, Param, Query } from '@nestjs/common';
import { StaysService, Stay } from './stays.service';

@Controller('stays')
export class StaysController {
  constructor(private readonly staysService: StaysService) {}

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('q') query?: string,
    @Query('sort') sort?: string,
  ): Promise<Stay[]> {
    return this.staysService.findAll(type, query, sort);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Stay | null> {
    return this.staysService.findOne(id);
  }
}
