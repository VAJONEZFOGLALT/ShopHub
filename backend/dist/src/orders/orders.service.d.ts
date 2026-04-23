import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class OrdersService {
    private readonly prisma;
    private readonly notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    private generateTrackingNumber;
    create(createOrderDto: CreateOrderDto): Promise<any>;
    findAll(): runtime.Types.Public.PrismaPromise<T>;
    findByUser(userId: number): runtime.Types.Public.PrismaPromise<T>;
    findOne(id: number): import("../../generated/prisma/models").Prisma__OrdersClient<any, null, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrdersPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    remove(id: number): Promise<runtime.Types.Utils.JsPromise<R>>;
}
