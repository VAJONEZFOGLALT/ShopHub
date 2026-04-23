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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const passport_1 = require("@nestjs/passport");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
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
    create(createOrderDto, req) {
        this.assertSelfOrAdmin(req, Number(createOrderDto.userId), 'You can only create orders for your own account');
        return this.ordersService.create({
            ...createOrderDto,
            userId: this.isAdmin(req) ? createOrderDto.userId : Number(req.user.id),
        });
    }
    findAll(req) {
        if (!this.isAdmin(req)) {
            return this.ordersService.findByUser(Number(req.user.id));
        }
        return this.ordersService.findAll();
    }
    findByUser(userId, req) {
        const targetUserId = Number(userId);
        this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access these orders');
        return this.ordersService.findByUser(targetUserId);
    }
    async findOne(id, req) {
        const order = await this.ordersService.findOne(+id);
        if (!order) {
            throw new common_1.NotFoundException(`Order with id ${id} not found`);
        }
        const currentUser = req.user;
        const isAdmin = currentUser?.role === 'ADMIN';
        if (!isAdmin && Number(order.userId) !== Number(currentUser?.id)) {
            throw new common_1.ForbiddenException('You are not allowed to view this order');
        }
        return order;
    }
    update(id, updateOrderDto, req) {
        if (!this.isAdmin(req)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        return this.ordersService.update(+id, updateOrderDto);
    }
    updateStatus(id, body, req) {
        if (!this.isAdmin(req)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        return this.ordersService.update(+id, { status: body.status });
    }
    fulfillOrder(id, body, req) {
        if (!this.isAdmin(req)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        return this.ordersService.update(+id, { teljesitve: typeof body.teljesitve === 'boolean' ? body.teljesitve : true });
    }
    remove(id, req) {
        if (!this.isAdmin(req)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        return this.ordersService.remove(+id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create an order' }),
    (0, swagger_1.ApiBody)({ type: create_order_dto_1.CreateOrderDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order created successfully.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'You can only create orders for your own account.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'List orders' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order list.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'List orders by user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', example: 240027 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order list for one user.' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an order by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 690001 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order details.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Order not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an order' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 690001 }),
    (0, swagger_1.ApiBody)({ type: update_order_dto_1.UpdateOrderDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order updated successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 690001 }),
    (0, swagger_1.ApiBody)({ schema: { example: { status: 'SHIPPED' } } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/fulfill'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark order fulfilled' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 690001 }),
    (0, swagger_1.ApiBody)({ schema: { example: { teljesitve: true } } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "fulfillOrder", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an order' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 690001 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order deleted successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map