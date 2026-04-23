"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reviews_service_1 = require("./reviews.service");
const create_review_dto_1 = require("./dto/create-review.dto");
const update_review_dto_1 = require("./dto/update-review.dto");
const passport_1 = require("@nestjs/passport");
let ReviewsController = class ReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    isAdmin(req) {
        return req?.user?.role === 'ADMIN';
    }
    assertSelfOrAdmin(req, targetUserId, message = 'Forbidden') {
        if (this.isAdmin(req)) {
            return;
        }
        if (Number(req?.user?.id) !== Number(targetUserId)) {
            throw new common_1.ForbiddenException(message);
        }
    }
    findAll() {
        return this.reviewsService.findAll();
    }
    findByProduct(productId) {
        return this.reviewsService.findByProduct(Number(productId));
    }
    getAverage(productId) {
        return this.reviewsService.getAverage(Number(productId));
    }
    create(body, req) {
        this.assertSelfOrAdmin(req, Number(body.userId), 'You can only create or update your own review');
        return this.reviewsService.create({
            ...body,
            userId: this.isAdmin(req) ? body.userId : Number(req.user.id),
        });
    }
    async update(id, body, req) {
        const review = await this.reviewsService.findOne(Number(id));
        if (!review) {
            throw new common_1.NotFoundException(`Review with id ${id} not found`);
        }
        this.assertSelfOrAdmin(req, Number(review.userId), 'You can only update your own review');
        return this.reviewsService.update(Number(id), body);
    }
    async remove(id, req) {
        const review = await this.reviewsService.findOne(Number(id));
        if (!review) {
            throw new common_1.NotFoundException(`Review with id ${id} not found`);
        }
        this.assertSelfOrAdmin(req, Number(review.userId), 'You can only delete your own review');
        return this.reviewsService.remove(Number(id));
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all reviews' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Review list.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'List reviews for a product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', example: 240154 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Product review list.' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findByProduct", null);
__decorate([
    (0, common_1.Get)('product/:productId/average'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product review summary' }),
    (0, swagger_1.ApiParam)({ name: 'productId', example: 240154 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Average rating and review count.' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "getAverage", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a review' }),
    (0, swagger_1.ApiBody)({ type: create_review_dto_1.CreateReviewDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Review created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_review_dto_1.CreateReviewDto, Object]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a review' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 270001 }),
    (0, swagger_1.ApiBody)({ type: update_review_dto_1.UpdateReviewDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Review updated successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_review_dto_1.UpdateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a review' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 270001 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Review deleted successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "remove", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('reviews'),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map