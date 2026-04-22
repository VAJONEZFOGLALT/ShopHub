import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private isConnected = false;

  async onModuleInit() {
    try {
      if (!process.env.DATABASE_URL) {
        console.warn('DATABASE_URL not set - Prisma will not connect');
        return;
      }
      
      await this.$connect();
      this.isConnected = true;
      console.log('Prisma connected successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      this.isConnected = false;
      // Don't throw - allow app to start
      // This prevents serverless timeout issues
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }
}
