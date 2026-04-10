import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('itinerary')
  async generateItinerary(@Body('query') query: string) {
    if (!query) {
      throw new HttpException('Query is required', HttpStatus.BAD_REQUEST);
    }
    return this.aiService.generateItinerary(query);
  }

  @Post('chat')
  async chat(@Body() body: { message: string; history?: any[] }) {
    if (!body.message) {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }
    return this.aiService.chat(body.message, body.history || []);
  }
}
