import { Module } from '@nestjs/common';
import { MoveController } from './move.controller';
import { MoveService } from './move.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [MoveController],
  providers: [MoveService],
})
export class MoveModule {}
