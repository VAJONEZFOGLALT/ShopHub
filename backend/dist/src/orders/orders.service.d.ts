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
            productId: number;
            quantity: number;
            orderId: number;
        }[];
    } & {
        id: number;
        userId: number;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        trackingNumber: string | null;
        totalPrice: number;
        createdAt: Date;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        orderItems: {
            id: number;
            price: number;
            productId: number;
            quantity: number;
            orderId: number;
        }[];
    } & {
        id: number;
        userId: number;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        trackingNumber: string | null;
        totalPrice: number;
        createdAt: Date;
    })[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__OrdersClient<({
        orderItems: {
            id: number;
            price: number;
            productId: number;
            quantity: number;
            orderId: number;
        }[];
    } & {
        id: number;
        userId: number;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        trackingNumber: string | null;
        totalPrice: number;
        createdAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateOrderDto: UpdateOrderDto): import("@prisma/client").Prisma.Prisma__OrdersClient<{
        orderItems: {
            id: number;
            price: number;
            productId: number;
            quantity: number;
            orderId: number;
        }[];
    } & {
        id: number;
        userId: number;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        trackingNumber: string | null;
        totalPrice: number;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__OrdersClient<{
        id: number;
        userId: number;
        courier: import("@prisma/client").$Enums.CourierService;
        shippingAddress: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        trackingNumber: string | null;
        totalPrice: number;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
