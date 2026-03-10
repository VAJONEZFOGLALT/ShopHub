import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async upsert(data: CreateRecentlyViewedDto) {
    try {
      return await this.prisma.recentlyViewed.create({
        data: { userId: data.userId, productId: data.productId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return this.prisma.recentlyViewed.update({
          where: { userId_productId: { userId: data.userId, productId: data.productId } },
          data: { viewedAt: new Date() },
        });
      }
      throw error;
    }
  }

  clear(userId: number) {
    return this.prisma.recentlyViewed.deleteMany({ where: { userId } });
  }
}
