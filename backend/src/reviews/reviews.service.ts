import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
	constructor(private readonly prisma: PrismaService) {}

	findAll() {
		return this.prisma.reviews.findMany({
			include: { user: true, product: true },
			orderBy: { createdAt: 'desc' },
		});
	}

	findByProduct(productId: number) {
		return this.prisma.reviews.findMany({
			where: { productId },
			include: { user: true },
			orderBy: { createdAt: 'desc' },
		});
	}

	async getAverage(productId: number) {
		const agg = await this.prisma.reviews.aggregate({
			where: { productId },
			_avg: { rating: true },
			_count: { rating: true },
		});
		return {
			average: agg._avg.rating || 0,
			count: agg._count.rating || 0,
		};
	}

	create(data: CreateReviewDto) {
		return this.prisma.reviews.upsert({
			where: { userId_productId: { userId: data.userId, productId: data.productId } },
			update: { rating: data.rating, title: data.title, comment: data.comment },
			create: {
				userId: data.userId,
				productId: data.productId,
				rating: data.rating,
				title: data.title,
				comment: data.comment,
			},
		});
	}

	update(id: number, data: UpdateReviewDto) {
		return this.prisma.reviews.update({ where: { id }, data });
	}

	remove(id: number) {
		return this.prisma.reviews.delete({ where: { id } });
	}
}
