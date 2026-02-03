export declare class CreateOrderDto {
    userId: number;
    items: OrderItemInput[];
}
export declare class OrderItemInput {
    productId: number;
    quantity: number;
}
