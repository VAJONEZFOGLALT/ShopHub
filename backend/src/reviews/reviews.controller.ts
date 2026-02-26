import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

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
	create(@Body() body: CreateReviewDto) {
		return this.reviewsService.create(body);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() body: UpdateReviewDto) {
		return this.reviewsService.update(Number(id), body);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.reviewsService.remove(Number(id));
	}
}
