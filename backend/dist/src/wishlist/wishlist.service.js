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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let WishlistService = class WishlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findByUser(userId) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async add(userId, productId) {
        try {
            const user = await this.prisma.users.findUnique({ where: { id: userId } });
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            const product = await this.prisma.products.findUnique({ where: { id: productId } });
            if (!product) {
                throw new common_1.BadRequestException('Product not found');
            }
            return this.prisma.wishlist.upsert({
                where: { userId_productId: { userId, productId } },
                update: {},
                create: { userId, productId },
            });
        }
        catch (error) {
            if (error.code === 'P2003') {
                throw new common_1.BadRequestException('User or product not found');
            }
            throw error;
        }
    }
    remove(id) {
        return this.prisma.wishlist.delete({ where: { id } });
    }
    async removeByUserProduct(userId, productId) {
        try {
            return await this.prisma.wishlist.delete({
                where: { userId_productId: { userId, productId } }
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async isInWishlist(userId, productId) {
        try {
            const found = await this.prisma.wishlist.findUnique({
                where: { userId_productId: { userId, productId } }
            });
            return !!found;
        }
        catch (error) {
            return false;
        }
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map