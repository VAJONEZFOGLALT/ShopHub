import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, NotificationsService],
})
export class OrdersModule {}
