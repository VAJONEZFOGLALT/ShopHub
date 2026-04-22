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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto) {
        const { userId, items } = createOrderDto;
        const productIds = Array.from(new Set(items.map((i) => i.productId)));
        const products = await this.prisma.products.findMany({
            where: { id: { in: productIds } },
            select: { id: true, price: true },
        });
        const priceMap = new Map(products.map((p) => [p.id, p.price]));
        const orderItemsData = items.map((item) => {
            const price = priceMap.get(item.productId) ?? 0;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price,
            };
        });
        const totalPrice = orderItemsData.reduce((sum, i) => sum + i.price * i.quantity, 0);
        return this.prisma.orders.create({
            data: {
                userId,
                totalPrice,
                orderItems: { create: orderItemsData },
            },
            include: { orderItems: true },
        });
    }
    findAll() {
        return this.prisma.orders.findMany({ include: { orderItems: true } });
    }
    findOne(id) {
        return this.prisma.orders.findUnique({ where: { id }, include: { orderItems: true } });
    }
    update(id, updateOrderDto) {
        const { items, ...rest } = updateOrderDto;
        return this.prisma.orders.update({ where: { id }, data: rest, include: { orderItems: true } });
    }
    remove(id) {
        return this.prisma.orders.delete({ where: { id } });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map