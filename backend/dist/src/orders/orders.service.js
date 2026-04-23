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
const notifications_service_1 = require("../notifications/notifications.service");
let OrdersService = class OrdersService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    generateTrackingNumber(courier) {
        const normalized = (courier || 'UPS').toUpperCase();
        const prefixes = {
            UPS: '1Z',
            DPD: 'DPD',
            PACKETA: 'PKT',
            INPOST: 'MPL',
        };
        const prefix = prefixes[normalized] || 'TRK';
        const now = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0');
        return `${prefix}${now}${random}`;
    }
    async create(createOrderDto) {
        const { userId, items, courier, shippingAddress, language } = createOrderDto;
        const productIds = Array.from(new Set(items.map((i) => i.productId)));
        const products = await this.prisma.products.findMany({
            where: {
                id: { in: productIds },
                deletedAt: null,
            },
            select: { id: true, price: true, name: true },
        });
        const foundIds = new Set(products.map((p) => p.id));
        const unavailableIds = productIds.filter((id) => !foundIds.has(id));
        if (unavailableIds.length > 0) {
            throw new common_1.BadRequestException(`Products unavailable: ${unavailableIds.join(', ')}`);
        }
        const priceMap = new Map(products.map((p) => [p.id, Number(p.price)]));
        const nameMap = new Map(products.map((p) => [p.id, String(p.name)]));
        const orderItemsData = items.map((item) => {
            const price = priceMap.get(item.productId) ?? 0;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price,
            };
        });
        const emailItems = items.map((item) => ({
            name: nameMap.get(item.productId) || `#${item.productId}`,
            quantity: item.quantity,
            price: priceMap.get(item.productId) ?? 0,
        }));
        const totalPrice = orderItemsData.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const createdOrder = await this.prisma.orders.create({
            data: {
                userId,
                totalPrice,
                courier: courier || 'UPS',
                shippingAddress,
                trackingNumber: this.generateTrackingNumber(courier),
                orderItems: { createMany: { data: orderItemsData } },
            },
            include: { orderItems: true },
        });
        let emailStatus = {
            emailSent: false,
            reason: 'No email attempt was made',
        };
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: { email: true, name: true },
        });
        if (user?.email) {
            try {
                emailStatus = await this.notificationsService.sendMockPaymentEmail({
                    orderId: createdOrder.id,
                    recipientEmail: user.email,
                    recipientName: user.name,
                    language,
                    totalPrice,
                    itemCount: orderItemsData.reduce((sum, item) => sum + item.quantity, 0),
                    lineCount: orderItemsData.length,
                    courier: createdOrder.courier,
                    createdAt: createdOrder.createdAt,
                    trackingNumber: createdOrder.trackingNumber || undefined,
                    shippingAddress: createdOrder.shippingAddress || undefined,
                    items: emailItems,
                });
            }
            catch (error) {
                emailStatus = {
                    emailSent: false,
                    reason: error instanceof Error ? error.message : 'Failed to send order email',
                };
                console.warn(`Failed to send order email for order #${createdOrder.id}:`, error);
            }
        }
        return {
            ...createdOrder,
            emailStatus,
        };
    }
    findAll() {
        return this.prisma.orders.findMany({
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: { id: true, name: true, price: true, image: true, category: true },
                        },
                    },
                },
            },
        });
    }
    findByUser(userId) {
        return this.prisma.orders.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: { id: true, name: true, price: true, image: true, category: true },
                        },
                    },
                },
            },
            orderBy: { id: 'desc' },
        });
    }
    findOne(id) {
        return this.prisma.orders.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: { id: true, name: true, price: true, image: true, category: true },
                        },
                    },
                },
            },
        });
    }
    async update(id, updateOrderDto) {
        const { items, ...rest } = updateOrderDto;
        const existing = await this.prisma.orders.findUnique({
            where: { id },
            include: { orderItems: true },
        });
        const prevStatus = (existing?.status || '').toString().toUpperCase();
        const updated = await this.prisma.orders.update({
            where: { id },
            data: rest,
            include: { orderItems: true },
        });
        const newStatus = (updated?.status || '').toString().toUpperCase();
        if (prevStatus !== 'DELIVERED' && newStatus === 'DELIVERED') {
            try {
                const user = await this.prisma.users.findUnique({
                    where: { id: updated.userId },
                    select: { email: true, name: true },
                });
                if (user?.email) {
                    const itemsForEmail = (updated.orderItems || []).map((it) => ({
                        name: it.name || `#${it.productId}`,
                        quantity: it.quantity,
                        price: it.price,
                    }));
                    await this.notificationsService.sendDeliveryEmail({
                        orderId: updated.id,
                        recipientEmail: user.email,
                        recipientName: user.name,
                        courier: updated.courier,
                        trackingNumber: updated.trackingNumber || undefined,
                        shippingAddress: updated.shippingAddress || undefined,
                        items: itemsForEmail,
                        deliveredAt: new Date(),
                    });
                }
            }
            catch (err) {
                console.warn(`Failed to send delivery email for order #${id}:`, err);
            }
        }
        return updated;
    }
    async remove(id) {
        const existing = await this.prisma.orders.findUnique({ where: { id }, select: { id: true } });
        if (!existing) {
            throw new common_1.NotFoundException(`Order with id ${id} not found`);
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.orderItems.deleteMany({ where: { orderId: id } });
            return tx.orders.delete({ where: { id } });
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map