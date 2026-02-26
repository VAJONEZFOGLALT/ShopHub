import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WishlistService {
	constructor(private readonly prisma: PrismaService) {}

	findByUser(userId: number) {
		return this.prisma.wishlist.findMany({
			where: { userId },
			include: { product: true },
			orderBy: { createdAt: 'desc' },
		});
	}

	async add(userId: number, productId: number) {
		try {
			// Verify user exists
			const user = await this.prisma.users.findUnique({ where: { id: userId } });
			if (!user) {
				throw new BadRequestException('User not found');
			}

			// Verify product exists
			const product = await this.prisma.products.findUnique({ where: { id: productId } });
			if (!product) {
				throw new BadRequestException('Product not found');
			}

			return this.prisma.wishlist.upsert({
				where: { userId_productId: { userId, productId } },
				update: {},
				create: { userId, productId },
			});
		} catch (error: any) {
			if (error.code === 'P2003') {
				throw new BadRequestException('User or product not found');
			}
			throw error;
		}
	}

	remove(id: number) {
		return this.prisma.wishlist.delete({ where: { id } });
	}

	async removeByUserProduct(userId: number, productId: number) {
		try {
			return await this.prisma.wishlist.delete({ 
				where: { userId_productId: { userId, productId } } 
			});
		} catch (error: any) {
			if (error.code === 'P2025') {
				// Record not found - this is fine, it's already removed
				return null;
			}
			throw error;
		}
	}

	async isInWishlist(userId: number, productId: number) {
		try {
			const found = await this.prisma.wishlist.findUnique({ 
				where: { userId_productId: { userId, productId } } 
			});
			return !!found;
		} catch (error) {
			return false;
		}
	}
}
