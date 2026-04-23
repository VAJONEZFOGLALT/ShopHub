import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    private isAdmin;
    private assertSelfOrAdmin;
    create(createOrderDto: CreateOrderDto, req: any): Promise<any>;
    findAll(req: any): runtime.Types.Public.PrismaPromise<T>;
    findByUser(userId: string, req: any): runtime.Types.Public.PrismaPromise<T>;
    findOne(id: string, req: any): Promise<any>;
    update(id: string, updateOrderDto: UpdateOrderDto, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrdersPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    updateStatus(id: string, body: {
        status: string;
    }, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrdersPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    fulfillOrder(id: string, body: {
        teljesitve?: boolean;
    }, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$OrdersPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    remove(id: string, req: any): Promise<runtime.Types.Utils.JsPromise<R>>;
}
