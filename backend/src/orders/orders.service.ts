import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, items } = createOrderDto;

    // fetch product prices for items
    const productIds = Array.from(new Set(items.map((i) => i.productId)));
    const products = await this.prisma.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });
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
        orderItems: { create: orderItemsData },
      },
      include: { orderItems: true },
    });
  }

  findAll() {
    return this.prisma.orders.findMany({ include: { orderItems: true } });
  }

  findOne(id: number) {
    return this.prisma.orders.findUnique({ where: { id }, include: { orderItems: true } });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    const { items, ...rest } = updateOrderDto;
    // Simple update excludes altering items; extend as needed for item updates
    return this.prisma.orders.update({ where: { id }, data: rest, include: { orderItems: true } });
  }

  remove(id: number) {
    return this.prisma.orders.delete({ where: { id } });
  }
}
