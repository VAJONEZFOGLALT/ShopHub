import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCompareDto } from './dto/create-compare.dto';

@Injectable()
export class CompareService {
  constructor(private readonly prisma: PrismaService) {}

  findByUser(userId: number) {
    return this.prisma.compareItems.findMany({
      where: {
        userId,
        product: {
          deletedAt: null,
        },
      },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(data: CreateCompareDto) {
    const product = await this.prisma.products.findFirst({
      where: {
        id: data.productId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const existing = await this.prisma.compareItems.findUnique({
      where: { userId_productId: { userId: data.userId, productId: data.productId } },
    });
    if (existing) {
      return existing;
    }

    const count = await this.prisma.compareItems.count({ where: { userId: data.userId } });
    if (count >= 5) {
      throw new BadRequestException('You can compare up to 5 products.');
    }

    return this.prisma.compareItems.create({ data: { userId: data.userId, productId: data.productId } });
  }

  removeByUserProduct(userId: number, productId: number) {
    return this.prisma.compareItems.delete({ where: { userId_productId: { userId, productId } } });
  }

  clear(userId: number) {
    return this.prisma.compareItems.deleteMany({ where: { userId } });
  }
}
