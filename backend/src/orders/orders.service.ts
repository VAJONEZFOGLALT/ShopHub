import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, courier, shippingAddress } = createOrderDto;

    // fetch product prices for items
    const productIds = Array.from(new Set(items.map((i) => i.productId)));
    const products = await this.prisma.products.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
      select: { id: true, price: true },
    });

    const foundIds = new Set(products.map((p) => p.id));
    const unavailableIds = productIds.filter((id) => !foundIds.has(id));
    if (unavailableIds.length > 0) {
      throw new BadRequestException(`Products unavailable: ${unavailableIds.join(', ')}`);
    }

    const priceMap = new Map(products.map((p) => [p.id, p.price]));

    const orderItemsData = items.map((item) => {
      const price = priceMap.get(item.productId) ?? 0;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      };
    });

    const totalPrice = orderItemsData.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    return this.prisma.orders.create({
      data: {
        userId,
        totalPrice,
        courier: courier || 'UPS',
        shippingAddress,
        orderItems: { create: orderItemsData },
      },
      include: { orderItems: true },
    });
  }

  findAll() {
    return this.prisma.orders.findMany({ include: { orderItems: true } });
  }

  findByUser(userId: number) {
    return this.prisma.orders.findMany({
      where: { userId },
      include: { orderItems: true },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.orders.findUnique({ where: { id }, include: { orderItems: true } });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    const { items, ...rest } = updateOrderDto;
    // Simple update excludes altering items; extend as needed for item updates
    return this.prisma.orders.update({ where: { id }, data: rest, include: { orderItems: true } });
  }

  async remove(id: number) {
    const existing = await this.prisma.orders.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.orderItems.deleteMany({ where: { orderId: id } });
      return tx.orders.delete({ where: { id } });
    });
  }
}
