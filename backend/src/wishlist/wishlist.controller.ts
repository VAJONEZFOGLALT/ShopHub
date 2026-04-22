import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
	constructor(private readonly wishlistService: WishlistService) {}

	@Get('user/:userId')
	findByUser(@Param('userId') userId: string) {
		return this.wishlistService.findByUser(Number(userId));
	}

	@Post()
	add(@Body() body: { userId: number; productId: number }) {
		return this.wishlistService.add(body.userId, body.productId);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.wishlistService.remove(Number(id));
	}

	@Delete('user/:userId/product/:productId')
	removeByUserProduct(@Param('userId') userId: string, @Param('productId') productId: string) {
		return this.wishlistService.removeByUserProduct(Number(userId), Number(productId));
	}

	@Get('check/:userId/:productId')
	isInWishlist(@Param('userId') userId: string, @Param('productId') productId: string) {
		return this.wishlistService.isInWishlist(Number(userId), Number(productId));
	}
}
