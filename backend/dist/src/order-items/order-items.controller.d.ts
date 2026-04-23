import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
export declare class OrderItemsController {
    private readonly orderItemsService;
    constructor(orderItemsService: OrderItemsService);
    private assertAdmin;
    create(createOrderItemDto: CreateOrderItemDto, req: any): import("../../generated/prisma/models").Prisma__OrderItemsClient<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrderItemsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findAll(req: any): runtime.Types.Public.PrismaPromise<T>;
    findOne(id: string, req: any): import("../../generated/prisma/models").Prisma__OrderItemsClient<any, null, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: string, updateOrderItemDto: UpdateOrderItemDto, req: any): import("../../generated/prisma/models").Prisma__OrderItemsClient<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrderItemsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(id: string, req: any): import("../../generated/prisma/models").Prisma__OrderItemsClient<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrderItemsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
