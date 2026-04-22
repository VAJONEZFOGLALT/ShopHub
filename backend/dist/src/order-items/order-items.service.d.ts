import { PrismaService } from '../prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
export declare class OrderItemsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createOrderItemDto: CreateOrderItemDto): import("../../generated/prisma/models").Prisma__OrderItemsClient<{
        id: number;
        price: number;
        quantity: number;
        productId: number;
        orderId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findAll(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        price: number;
        quantity: number;
        productId: number;
        orderId: number;
    }[]>;
    findOne(id: number): import("../../generated/prisma/models").Prisma__OrderItemsClient<{
        id: number;
        price: number;
        quantity: number;
        productId: number;
        orderId: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: number, updateOrderItemDto: UpdateOrderItemDto): import("../../generated/prisma/models").Prisma__OrderItemsClient<{
        id: number;
        price: number;
        quantity: number;
        productId: number;
        orderId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(id: number): import("../../generated/prisma/models").Prisma__OrderItemsClient<{
        id: number;
        price: number;
        quantity: number;
        productId: number;
        orderId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
