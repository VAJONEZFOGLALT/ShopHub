import { Module } from '@nestjs/common';
import { CompareController } from './compare.controller';
import { CompareService } from './compare.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CompareController],
  providers: [CompareService, PrismaService],
})
export class CompareModule {}
