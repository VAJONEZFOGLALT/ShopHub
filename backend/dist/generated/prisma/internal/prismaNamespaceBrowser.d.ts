import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
export declare const DbNull: {
    #private: any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const JsonNull: {
    #private: any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const AnyNull: {
    #private: any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const ModelName: {
    readonly Users: "Users";
    readonly Products: "Products";
    readonly Reviews: "Reviews";
    readonly Wishlist: "Wishlist";
    readonly RecentlyViewed: "RecentlyViewed";
    readonly CompareItems: "CompareItems";
    readonly Orders: "Orders";
    readonly OrderItems: "OrderItems";
    readonly Address: "Address";
    readonly Translation: "Translation";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UsersScalarFieldEnum: {
    readonly id: "id";
    readonly username: "username";
    readonly email: "email";
    readonly password_hash: "password_hash";
    readonly name: "name";
    readonly avatar: "avatar";
    readonly role: "role";
};
export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum];
export declare const ProductsScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly category: "category";
    readonly price: "price";
    readonly stock: "stock";
    readonly image: "image";
};
export type ProductsScalarFieldEnum = (typeof ProductsScalarFieldEnum)[keyof typeof ProductsScalarFieldEnum];
export declare const ReviewsScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly productId: "productId";
    readonly rating: "rating";
    readonly title: "title";
    readonly comment: "comment";
    readonly createdAt: "createdAt";
};
export type ReviewsScalarFieldEnum = (typeof ReviewsScalarFieldEnum)[keyof typeof ReviewsScalarFieldEnum];
export declare const WishlistScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly productId: "productId";
    readonly createdAt: "createdAt";
};
export type WishlistScalarFieldEnum = (typeof WishlistScalarFieldEnum)[keyof typeof WishlistScalarFieldEnum];
export declare const RecentlyViewedScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly productId: "productId";
    readonly viewedAt: "viewedAt";
};
export type RecentlyViewedScalarFieldEnum = (typeof RecentlyViewedScalarFieldEnum)[keyof typeof RecentlyViewedScalarFieldEnum];
export declare const CompareItemsScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly productId: "productId";
    readonly createdAt: "createdAt";
};
export type CompareItemsScalarFieldEnum = (typeof CompareItemsScalarFieldEnum)[keyof typeof CompareItemsScalarFieldEnum];
export declare const OrdersScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly totalPrice: "totalPrice";
    readonly createdAt: "createdAt";
    readonly status: "status";
    readonly courier: "courier";
    readonly shippingAddress: "shippingAddress";
    readonly trackingNumber: "trackingNumber";
};
export type OrdersScalarFieldEnum = (typeof OrdersScalarFieldEnum)[keyof typeof OrdersScalarFieldEnum];
export declare const OrderItemsScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly productId: "productId";
    readonly quantity: "quantity";
    readonly price: "price";
};
export type OrderItemsScalarFieldEnum = (typeof OrderItemsScalarFieldEnum)[keyof typeof OrderItemsScalarFieldEnum];
export declare const AddressScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly label: "label";
    readonly fullName: "fullName";
    readonly street: "street";
    readonly city: "city";
    readonly state: "state";
    readonly zipCode: "zipCode";
    readonly country: "country";
    readonly isDefault: "isDefault";
    readonly createdAt: "createdAt";
};
export type AddressScalarFieldEnum = (typeof AddressScalarFieldEnum)[keyof typeof AddressScalarFieldEnum];
export declare const TranslationScalarFieldEnum: {
    readonly id: "id";
    readonly key: "key";
    readonly language: "language";
    readonly value: "value";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TranslationScalarFieldEnum = (typeof TranslationScalarFieldEnum)[keyof typeof TranslationScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const UsersOrderByRelevanceFieldEnum: {
    readonly username: "username";
    readonly email: "email";
    readonly password_hash: "password_hash";
    readonly name: "name";
    readonly avatar: "avatar";
    readonly role: "role";
};
export type UsersOrderByRelevanceFieldEnum = (typeof UsersOrderByRelevanceFieldEnum)[keyof typeof UsersOrderByRelevanceFieldEnum];
export declare const ProductsOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly description: "description";
    readonly category: "category";
    readonly image: "image";
};
export type ProductsOrderByRelevanceFieldEnum = (typeof ProductsOrderByRelevanceFieldEnum)[keyof typeof ProductsOrderByRelevanceFieldEnum];
export declare const ReviewsOrderByRelevanceFieldEnum: {
    readonly title: "title";
    readonly comment: "comment";
};
export type ReviewsOrderByRelevanceFieldEnum = (typeof ReviewsOrderByRelevanceFieldEnum)[keyof typeof ReviewsOrderByRelevanceFieldEnum];
export declare const OrdersOrderByRelevanceFieldEnum: {
    readonly shippingAddress: "shippingAddress";
    readonly trackingNumber: "trackingNumber";
};
export type OrdersOrderByRelevanceFieldEnum = (typeof OrdersOrderByRelevanceFieldEnum)[keyof typeof OrdersOrderByRelevanceFieldEnum];
export declare const AddressOrderByRelevanceFieldEnum: {
    readonly label: "label";
    readonly fullName: "fullName";
    readonly street: "street";
    readonly city: "city";
    readonly state: "state";
    readonly zipCode: "zipCode";
    readonly country: "country";
};
export type AddressOrderByRelevanceFieldEnum = (typeof AddressOrderByRelevanceFieldEnum)[keyof typeof AddressOrderByRelevanceFieldEnum];
export declare const TranslationOrderByRelevanceFieldEnum: {
    readonly key: "key";
    readonly value: "value";
};
export type TranslationOrderByRelevanceFieldEnum = (typeof TranslationOrderByRelevanceFieldEnum)[keyof typeof TranslationOrderByRelevanceFieldEnum];
