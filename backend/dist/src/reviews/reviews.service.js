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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.reviews.findMany({
            include: { user: true, product: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    findByProduct(productId) {
        return this.prisma.reviews.findMany({
            where: { productId },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAverage(productId) {
        const agg = await this.prisma.reviews.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        return {
            average: agg._avg.rating || 0,
            count: agg._count.rating || 0,
        };
    }
    create(data) {
        return this.prisma.reviews.upsert({
            where: { userId_productId: { userId: data.userId, productId: data.productId } },
            update: { rating: data.rating, title: data.title, comment: data.comment },
            create: {
                userId: data.userId,
                productId: data.productId,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
            },
        });
    }
    update(id, data) {
        return this.prisma.reviews.update({ where: { id }, data });
    }
    remove(id) {
        return this.prisma.reviews.delete({ where: { id } });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map