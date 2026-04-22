import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrderItemDto: CreateOrderItemDto) {
    return this.prisma.orderItems.create({ data: createOrderItemDto });
  }

  findAll() {
    return this.prisma.orderItems.findMany();
  }

  findOne(id: number) {
    return this.prisma.orderItems.findUnique({ where: { id } });
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return this.prisma.orderItems.update({ where: { id }, data: updateOrderItemDto });
  }

  remove(id: number) {
    return this.prisma.orderItems.delete({ where: { id } });
  }
}
