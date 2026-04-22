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
        totalPrice: number;
        createdAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        teljesitve: boolean;
        id: number;
        userId: number;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        orderItems: {
            id: number;
            price: number;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        totalPrice: number;
        createdAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        teljesitve: boolean;
        id: number;
        userId: number;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__OrdersClient<({
        orderItems: {
            id: number;
            price: number;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        totalPrice: number;
        createdAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        teljesitve: boolean;
        id: number;
        userId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateOrderDto: UpdateOrderDto): import("@prisma/client").Prisma.Prisma__OrdersClient<{
        orderItems: {
            id: number;
            price: number;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        totalPrice: number;
        createdAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        teljesitve: boolean;
        id: number;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateStatus(id: string, body: {
        status: string;
    }): import("@prisma/client").Prisma.Prisma__OrdersClient<{
        orderItems: {
            id: number;
            price: number;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        totalPrice: number;
        createdAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        teljesitve: boolean;
        id: number;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    fulfillOrder(id: string, body: {
        teljesitve?: boolean;
    }): import("@prisma/client").Prisma.Prisma__OrdersClient<{
        orderItems: {
            id: number;
            price: number;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        totalPrice: number;
        createdAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        teljesitve: boolean;
        id: number;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): Promise<{
        totalPrice: number;
        createdAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        teljesitve: boolean;
        id: number;
        userId: number;
    }>;
}
