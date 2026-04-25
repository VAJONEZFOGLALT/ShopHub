import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

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

	@Get()
	findAll() {
		return this.reviewsService.findAll();
	}

	@Get('product/:productId')
	findByProduct(@Param('productId') productId: string) {
		return this.reviewsService.findByProduct(Number(productId));
	}

	@Get('product/:productId/average')
	getAverage(@Param('productId') productId: string) {
		return this.reviewsService.getAverage(Number(productId));
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	create(@Body() body: CreateReviewDto, @Req() req: any) {
		this.assertSelfOrAdmin(req, Number(body.userId), 'You can only create or update your own review');
		return this.reviewsService.create({
			...body,
			userId: this.isAdmin(req) ? body.userId : Number(req.user.id),
		});
	}

	@Put(':id')
	@UseGuards(AuthGuard('jwt'))
	async update(@Param('id') id: string, @Body() body: UpdateReviewDto, @Req() req: any) {
		const review = await this.reviewsService.findOne(Number(id));
		if (!review) {
			throw new NotFoundException(`Review with id ${id} not found`);
		}
		this.assertSelfOrAdmin(req, Number(review.userId), 'You can only update your own review');
		return this.reviewsService.update(Number(id), body);
	}

	@Delete(':id')
	@UseGuards(AuthGuard('jwt'))
	async remove(@Param('id') id: string, @Req() req: any) {
		const review = await this.reviewsService.findOne(Number(id));
		if (!review) {
			throw new NotFoundException(`Review with id ${id} not found`);
		}
		this.assertSelfOrAdmin(req, Number(review.userId), 'You can only delete your own review');
		return this.reviewsService.remove(Number(id));
	}
}
