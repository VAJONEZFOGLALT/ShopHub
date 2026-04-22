import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
        orderItems: {
            id: number;
            price: number;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        id: number;
        totalPrice: number;
        createdAt: Date;
        status: boolean;
        userId: number;
    }>;
    findAll(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        orderItems: {
            id: number;
            price: number;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        id: number;
        totalPrice: number;
        createdAt: Date;
        status: boolean;
        userId: number;
    })[]>;
    findOne(id: string): import("../../generated/prisma/models").Prisma__OrdersClient<({
        orderItems: {
            id: number;
            price: number;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        id: number;
        totalPrice: number;
        createdAt: Date;
        status: boolean;
        userId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): import("../../generated/prisma/models").Prisma__OrdersClient<{
        orderItems: {
            id: number;
            price: number;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        id: number;
        totalPrice: number;
        createdAt: Date;
        status: boolean;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(id: string): import("../../generated/prisma/models").Prisma__OrdersClient<{
        id: number;
        totalPrice: number;
        createdAt: Date;
        status: boolean;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
