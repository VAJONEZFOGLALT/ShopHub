import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('reviews')
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
	@ApiOperation({ summary: 'List all reviews' })
	@ApiOkResponse({ description: 'Review list.' })
	findAll() {
		return this.reviewsService.findAll();
	}

	@Get('product/:productId')
	@ApiOperation({ summary: 'List reviews for a product' })
	@ApiParam({ name: 'productId', example: 240154 })
	@ApiOkResponse({ description: 'Product review list.' })
	findByProduct(@Param('productId') productId: string) {
		return this.reviewsService.findByProduct(Number(productId));
	}

	@Get('product/:productId/average')
	@ApiOperation({ summary: 'Get product review summary' })
	@ApiParam({ name: 'productId', example: 240154 })
	@ApiOkResponse({ description: 'Average rating and review count.' })
	getAverage(@Param('productId') productId: string) {
		return this.reviewsService.getAverage(Number(productId));
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth('bearer-auth')
	@ApiOperation({ summary: 'Create a review' })
	@ApiBody({ type: CreateReviewDto })
	@ApiOkResponse({ description: 'Review created successfully.' })
	create(@Body() body: CreateReviewDto, @Req() req: any) {
		this.assertSelfOrAdmin(req, Number(body.userId), 'You can only create or update your own review');
		return this.reviewsService.create({
			...body,
			userId: this.isAdmin(req) ? body.userId : Number(req.user.id),
		});
	}

	@Put(':id')
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth('bearer-auth')
	@ApiOperation({ summary: 'Update a review' })
	@ApiParam({ name: 'id', example: 270001 })
	@ApiBody({ type: UpdateReviewDto })
	@ApiOkResponse({ description: 'Review updated successfully.' })
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
	@ApiBearerAuth('bearer-auth')
	@ApiOperation({ summary: 'Delete a review' })
	@ApiParam({ name: 'id', example: 270001 })
	@ApiOkResponse({ description: 'Review deleted successfully.' })
	async remove(@Param('id') id: string, @Req() req: any) {
		const review = await this.reviewsService.findOne(Number(id));
		if (!review) {
			throw new NotFoundException(`Review with id ${id} not found`);
		}
		this.assertSelfOrAdmin(req, Number(review.userId), 'You can only delete your own review');
		return this.reviewsService.remove(Number(id));
	}
}
