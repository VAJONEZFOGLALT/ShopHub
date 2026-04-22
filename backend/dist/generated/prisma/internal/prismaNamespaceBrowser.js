"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressOrderByRelevanceFieldEnum = exports.OrdersOrderByRelevanceFieldEnum = exports.ReviewsOrderByRelevanceFieldEnum = exports.ProductsOrderByRelevanceFieldEnum = exports.UsersOrderByRelevanceFieldEnum = exports.NullsOrder = exports.SortOrder = exports.AddressScalarFieldEnum = exports.OrderItemsScalarFieldEnum = exports.OrdersScalarFieldEnum = exports.CompareItemsScalarFieldEnum = exports.RecentlyViewedScalarFieldEnum = exports.WishlistScalarFieldEnum = exports.ReviewsScalarFieldEnum = exports.ProductsScalarFieldEnum = exports.UsersScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.objectEnumValues.classes.DbNull,
    JsonNull: runtime.objectEnumValues.classes.JsonNull,
    AnyNull: runtime.objectEnumValues.classes.AnyNull,
};
exports.DbNull = runtime.objectEnumValues.instances.DbNull;
exports.JsonNull = runtime.objectEnumValues.instances.JsonNull;
exports.AnyNull = runtime.objectEnumValues.instances.AnyNull;
exports.ModelName = {
    Users: 'Users',
    Products: 'Products',
    Reviews: 'Reviews',
    Wishlist: 'Wishlist',
    RecentlyViewed: 'RecentlyViewed',
    CompareItems: 'CompareItems',
    Orders: 'Orders',
    OrderItems: 'OrderItems',
    Address: 'Address'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UsersScalarFieldEnum = {
    id: 'id',
    username: 'username',
    email: 'email',
    password_hash: 'password_hash',
    name: 'name',
    avatar: 'avatar',
    role: 'role'
};
exports.ProductsScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    category: 'category',
    price: 'price',
    stock: 'stock',
    image: 'image'
};
exports.ReviewsScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    rating: 'rating',
    title: 'title',
    comment: 'comment',
    createdAt: 'createdAt'
};
exports.WishlistScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    createdAt: 'createdAt'
};
exports.RecentlyViewedScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    viewedAt: 'viewedAt'
};
exports.CompareItemsScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    createdAt: 'createdAt'
};
exports.OrdersScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    totalPrice: 'totalPrice',
    createdAt: 'createdAt',
    status: 'status',
    courier: 'courier',
    shippingAddress: 'shippingAddress',
    trackingNumber: 'trackingNumber'
};
exports.OrderItemsScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    productId: 'productId',
    quantity: 'quantity',
    price: 'price'
};
exports.AddressScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    label: 'label',
    fullName: 'fullName',
    street: 'street',
    city: 'city',
    state: 'state',
    zipCode: 'zipCode',
    country: 'country',
    isDefault: 'isDefault',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.UsersOrderByRelevanceFieldEnum = {
    username: 'username',
    email: 'email',
    password_hash: 'password_hash',
    name: 'name',
    avatar: 'avatar',
    role: 'role'
};
exports.ProductsOrderByRelevanceFieldEnum = {
    name: 'name',
    description: 'description',
    category: 'category',
    image: 'image'
};
exports.ReviewsOrderByRelevanceFieldEnum = {
    title: 'title',
    comment: 'comment'
};
exports.OrdersOrderByRelevanceFieldEnum = {
    shippingAddress: 'shippingAddress',
    trackingNumber: 'trackingNumber'
};
exports.AddressOrderByRelevanceFieldEnum = {
    label: 'label',
    fullName: 'fullName',
    street: 'street',
    city: 'city',
    state: 'state',
    zipCode: 'zipCode',
    country: 'country'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map