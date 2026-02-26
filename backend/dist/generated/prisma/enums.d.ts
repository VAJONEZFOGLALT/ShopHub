export declare const OrderStatus: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const CourierService: {
    readonly UPS: "UPS";
    readonly PACKETA: "PACKETA";
    readonly DPD: "DPD";
    readonly INPOST: "INPOST";
};
export type CourierService = (typeof CourierService)[keyof typeof CourierService];
