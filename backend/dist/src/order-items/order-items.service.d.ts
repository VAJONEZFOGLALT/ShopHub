import { PrismaService } from '../prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
export declare class OrderItemsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createOrderItemDto: CreateOrderItemDto): import("@prisma/client").Prisma.Prisma__OrderItemsClient<{
        id: number;
        price: number;
        productId: number;
        quantity: number;
        orderId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        price: number;
        productId: number;
        quantity: number;
        orderId: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__OrderItemsClient<{
        id: number;
        price: number;
        productId: number;
        quantity: number;
        orderId: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateOrderItemDto: UpdateOrderItemDto): import("@prisma/client").Prisma.Prisma__OrderItemsClient<{
        id: number;
        price: number;
        productId: number;
        quantity: number;
        orderId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__OrderItemsClient<{
        id: number;
        price: number;
        productId: number;
        quantity: number;
        orderId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
