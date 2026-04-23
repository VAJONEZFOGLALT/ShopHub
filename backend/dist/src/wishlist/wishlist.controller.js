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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wishlist_service_1 = require("./wishlist.service");
const passport_1 = require("@nestjs/passport");
let WishlistController = class WishlistController {
    wishlistService;
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
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
    findByUser(userId, req) {
        const targetUserId = Number(userId);
        this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access this wishlist');
        return this.wishlistService.findByUser(targetUserId);
    }
    add(body, req) {
        this.assertSelfOrAdmin(req, Number(body.userId), 'You can only modify your own wishlist');
        return this.wishlistService.add(this.isAdmin(req) ? body.userId : Number(req.user.id), body.productId);
    }
    async remove(id, req) {
        const existing = await this.wishlistService.findOne(Number(id));
        if (!existing) {
            throw new common_1.NotFoundException(`Wishlist item with id ${id} not found`);
        }
        this.assertSelfOrAdmin(req, Number(existing.userId), 'You can only modify your own wishlist');
        return this.wishlistService.remove(Number(id));
    }
    removeByUserProduct(userId, productId, req) {
        const targetUserId = Number(userId);
        this.assertSelfOrAdmin(req, targetUserId, 'You can only modify your own wishlist');
        return this.wishlistService.removeByUserProduct(targetUserId, Number(productId));
    }
    isInWishlist(userId, productId, req) {
        const targetUserId = Number(userId);
        this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access this wishlist state');
        return this.wishlistService.isInWishlist(targetUserId, Number(productId));
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'List wishlist items by user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', example: 240027 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Wishlist items.' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Add an item to wishlist' }),
    (0, swagger_1.ApiBody)({ schema: { example: { userId: 240027, productId: 240154 } } }),
    (0, swagger_1.ApiOkResponse)({ description: 'Wishlist item added.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "add", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a wishlist item' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 540001 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Wishlist item removed.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('user/:userId/product/:productId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a wishlist item by user and product' }),
    (0, swagger_1.ApiParam)({ name: 'userId', example: 240027 }),
    (0, swagger_1.ApiParam)({ name: 'productId', example: 240154 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Wishlist item removed.' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "removeByUserProduct", null);
__decorate([
    (0, common_1.Get)('check/:userId/:productId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Check wishlist state' }),
    (0, swagger_1.ApiParam)({ name: 'userId', example: 240027 }),
    (0, swagger_1.ApiParam)({ name: 'productId', example: 240154 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Boolean wishlist state.' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "isInWishlist", null);
exports.WishlistController = WishlistController = __decorate([
    (0, swagger_1.ApiTags)('wishlist'),
    (0, common_1.Controller)('wishlist'),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map