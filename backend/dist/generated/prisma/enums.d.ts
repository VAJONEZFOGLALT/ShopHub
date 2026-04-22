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
export declare const SupportedLanguage: {
    readonly HU: "HU";
    readonly EN: "EN";
    readonly DE: "DE";
    readonly FR: "FR";
    readonly ES: "ES";
    readonly PL: "PL";
    readonly CZ: "CZ";
    readonly IT: "IT";
};
export type SupportedLanguage = (typeof SupportedLanguage)[keyof typeof SupportedLanguage];
