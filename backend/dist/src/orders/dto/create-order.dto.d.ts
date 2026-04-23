export declare enum CourierService {
    UPS = "UPS",
    PACKETA = "PACKETA",
    DPD = "DPD",
    INPOST = "INPOST"
}
export declare class CreateOrderDto {
    userId: number;
    items: OrderItemInput[];
    courier?: CourierService;
    shippingAddress?: string;
    language?: 'hu' | 'en';
}
export declare class OrderItemInput {
    productId: number;
    quantity: number;
}
