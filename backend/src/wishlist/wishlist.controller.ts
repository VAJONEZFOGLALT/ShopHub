import { Controller, Get, Param, Post, Body, Delete, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('wishlist')
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
	@ApiBearerAuth('bearer-auth')
	@ApiOperation({ summary: 'List wishlist items by user' })
	@ApiParam({ name: 'userId', example: 240027 })
	@ApiOkResponse({ description: 'Wishlist items.' })
	findByUser(@Param('userId') userId: string, @Req() req: any) {
		const targetUserId = Number(userId);
		this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access this wishlist');
		return this.wishlistService.findByUser(targetUserId);
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth('bearer-auth')
	@ApiOperation({ summary: 'Add an item to wishlist' })
	@ApiBody({ schema: { example: { userId: 240027, productId: 240154 } } })
	@ApiOkResponse({ description: 'Wishlist item added.' })
	add(@Body() body: { userId: number; productId: number }, @Req() req: any) {
		this.assertSelfOrAdmin(req, Number(body.userId), 'You can only modify your own wishlist');
		return this.wishlistService.add(this.isAdmin(req) ? body.userId : Number(req.user.id), body.productId);
	}

	@Delete(':id')
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth('bearer-auth')
	@ApiOperation({ summary: 'Remove a wishlist item' })
	@ApiParam({ name: 'id', example: 540001 })
	@ApiOkResponse({ description: 'Wishlist item removed.' })
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
	@ApiBearerAuth('bearer-auth')
	@ApiOperation({ summary: 'Remove a wishlist item by user and product' })
	@ApiParam({ name: 'userId', example: 240027 })
	@ApiParam({ name: 'productId', example: 240154 })
	@ApiOkResponse({ description: 'Wishlist item removed.' })
	removeByUserProduct(@Param('userId') userId: string, @Param('productId') productId: string, @Req() req: any) {
		const targetUserId = Number(userId);
		this.assertSelfOrAdmin(req, targetUserId, 'You can only modify your own wishlist');
		return this.wishlistService.removeByUserProduct(targetUserId, Number(productId));
	}

	@Get('check/:userId/:productId')
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth('bearer-auth')
	@ApiOperation({ summary: 'Check wishlist state' })
	@ApiParam({ name: 'userId', example: 240027 })
	@ApiParam({ name: 'productId', example: 240154 })
	@ApiOkResponse({ description: 'Boolean wishlist state.' })
	isInWishlist(@Param('userId') userId: string, @Param('productId') productId: string, @Req() req: any) {
		const targetUserId = Number(userId);
		this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access this wishlist state');
		return this.wishlistService.isInWishlist(targetUserId, Number(productId));
	}
}
