import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRecentlyViewedDto } from './dto/create-recently-viewed.dto';

@Injectable()
export class RecentlyViewedService {
  constructor(private readonly prisma: PrismaService) {}

  findByUser(userId: number) {
    return this.prisma.recentlyViewed.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { viewedAt: 'desc' },
      take: 12,
    });
  }

  upsert(data: CreateRecentlyViewedDto) {
    return this.prisma.recentlyViewed.upsert({
      where: { userId_productId: { userId: data.userId, productId: data.productId } },
      update: { viewedAt: new Date() },
      create: { userId: data.userId, productId: data.productId },
    });
  }

  clear(userId: number) {
    return this.prisma.recentlyViewed.deleteMany({ where: { userId } });
  }
}
