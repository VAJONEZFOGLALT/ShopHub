import { PrismaService } from '../prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
export declare class OrderItemsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createOrderItemDto: CreateOrderItemDto): import("../../generated/prisma/models").Prisma__OrderItemsClient<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrderItemsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findAll(): runtime.Types.Public.PrismaPromise<T>;
    findOne(id: number): import("../../generated/prisma/models").Prisma__OrderItemsClient<any, null, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: number, updateOrderItemDto: UpdateOrderItemDto): import("../../generated/prisma/models").Prisma__OrderItemsClient<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrderItemsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(id: number): import("../../generated/prisma/models").Prisma__OrderItemsClient<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrderItemsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
