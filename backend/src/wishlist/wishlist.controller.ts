import { Controller, Get, Param, Post, Body, Delete, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishlist')
export class WishlistController {
	constructor(private readonly wishlistService: WishlistService) {}

	private isAdmin(req: any) {
		return req?.user?.role === 'ADMIN';
	}

	private assertSelfOrAdmin(req: any, targetUserId: number, message = 'Forbidden') {
		if (this.isAdmin(req)) {
			return;
		}
		if (Number(req?.user?.id) !== Number(targetUserId)) {
			throw new ForbiddenException(message);
		}
	}

	@Get('user/:userId')
	@UseGuards(AuthGuard('jwt'))
	findByUser(@Param('userId') userId: string, @Req() req: any) {
		const targetUserId = Number(userId);
		this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access this wishlist');
		return this.wishlistService.findByUser(targetUserId);
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	add(@Body() body: { userId: number; productId: number }, @Req() req: any) {
		this.assertSelfOrAdmin(req, Number(body.userId), 'You can only modify your own wishlist');
		return this.wishlistService.add(this.isAdmin(req) ? body.userId : Number(req.user.id), body.productId);
	}

	@Delete(':id')
	@UseGuards(AuthGuard('jwt'))
	async remove(@Param('id') id: string, @Req() req: any) {
		const existing = await this.wishlistService.findOne(Number(id));
		if (!existing) {
			throw new NotFoundException(`Wishlist item with id ${id} not found`);
		}
		this.assertSelfOrAdmin(req, Number(existing.userId), 'You can only modify your own wishlist');
		return this.wishlistService.remove(Number(id));
	}

	@Delete('user/:userId/product/:productId')
	@UseGuards(AuthGuard('jwt'))
	removeByUserProduct(@Param('userId') userId: string, @Param('productId') productId: string, @Req() req: any) {
		const targetUserId = Number(userId);
		this.assertSelfOrAdmin(req, targetUserId, 'You can only modify your own wishlist');
		return this.wishlistService.removeByUserProduct(targetUserId, Number(productId));
	}

	@Get('check/:userId/:productId')
	@UseGuards(AuthGuard('jwt'))
	isInWishlist(@Param('userId') userId: string, @Param('productId') productId: string, @Req() req: any) {
		const targetUserId = Number(userId);
		this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access this wishlist state');
		return this.wishlistService.isInWishlist(targetUserId, Number(productId));
	}
}
