import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
        status: import("../../generated/prisma/enums").OrderStatus;
        courier: import("../../generated/prisma/enums").CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
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
        status: import("../../generated/prisma/enums").OrderStatus;
        courier: import("../../generated/prisma/enums").CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        userId: number;
    })[]>;
    findOne(id: number): import("../../generated/prisma/models").Prisma__OrdersClient<({
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
        status: import("../../generated/prisma/enums").OrderStatus;
        courier: import("../../generated/prisma/enums").CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        userId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: number, updateOrderDto: UpdateOrderDto): import("../../generated/prisma/models").Prisma__OrdersClient<{
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
        status: import("../../generated/prisma/enums").OrderStatus;
        courier: import("../../generated/prisma/enums").CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(id: number): import("../../generated/prisma/models").Prisma__OrdersClient<{
        id: number;
        totalPrice: number;
        createdAt: Date;
        status: import("../../generated/prisma/enums").OrderStatus;
        courier: import("../../generated/prisma/enums").CourierService;
        shippingAddress: string | null;
        trackingNumber: string | null;
        userId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
