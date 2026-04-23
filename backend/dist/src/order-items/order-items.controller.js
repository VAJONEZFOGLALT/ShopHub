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
exports.OrderItemsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_items_service_1 = require("./order-items.service");
const create_order_item_dto_1 = require("./dto/create-order-item.dto");
const update_order_item_dto_1 = require("./dto/update-order-item.dto");
const passport_1 = require("@nestjs/passport");
let OrderItemsController = class OrderItemsController {
    orderItemsService;
    constructor(orderItemsService) {
        this.orderItemsService = orderItemsService;
    }
    assertAdmin(req) {
        if (req?.user?.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Admin access required');
        }
    }
    create(createOrderItemDto, req) {
        this.assertAdmin(req);
        return this.orderItemsService.create(createOrderItemDto);
    }
    findAll(req) {
        this.assertAdmin(req);
        return this.orderItemsService.findAll();
    }
    findOne(id, req) {
        this.assertAdmin(req);
        return this.orderItemsService.findOne(+id);
    }
    update(id, updateOrderItemDto, req) {
        this.assertAdmin(req);
        return this.orderItemsService.update(+id, updateOrderItemDto);
    }
    remove(id, req) {
        this.assertAdmin(req);
        return this.orderItemsService.remove(+id);
    }
};
exports.OrderItemsController = OrderItemsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create an order item' }),
    (0, swagger_1.ApiBody)({ type: create_order_item_dto_1.CreateOrderItemDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order item created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_item_dto_1.CreateOrderItemDto, Object]),
    __metadata("design:returntype", void 0)
], OrderItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'List order items' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order item list.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrderItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an order item by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 690001 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order item details.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an order item' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 690001 }),
    (0, swagger_1.ApiBody)({ type: update_order_item_dto_1.UpdateOrderItemDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order item updated successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_item_dto_1.UpdateOrderItemDto, Object]),
    __metadata("design:returntype", void 0)
], OrderItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an order item' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 690001 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order item deleted successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderItemsController.prototype, "remove", null);
exports.OrderItemsController = OrderItemsController = __decorate([
    (0, swagger_1.ApiTags)('order-items'),
    (0, common_1.Controller)('order-items'),
    __metadata("design:paramtypes", [order_items_service_1.OrderItemsService])
], OrderItemsController);
//# sourceMappingURL=order-items.controller.js.map