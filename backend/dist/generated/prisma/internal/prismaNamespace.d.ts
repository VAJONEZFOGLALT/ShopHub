import * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Metrics = runtime.Metrics;
export type Metric<T> = runtime.Metric<T>;
export type MetricHistogram = runtime.MetricHistogram;
export type MetricHistogramBucket = runtime.MetricHistogramBucket;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
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
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "users" | "products" | "reviews" | "wishlist" | "recentlyViewed" | "compareItems" | "orders" | "orderItems" | "address" | "translation";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Users: {
            payload: Prisma.$UsersPayload<ExtArgs>;
            fields: Prisma.UsersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UsersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UsersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UsersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UsersPayload>;
                };
                findFirst: {
                    args: Prisma.UsersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UsersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UsersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UsersPayload>;
                };
                findMany: {
                    args: Prisma.UsersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UsersPayload>[];
                };
                create: {
                    args: Prisma.UsersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UsersPayload>;
                };
                createMany: {
                    args: Prisma.UsersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.UsersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UsersPayload>;
                };
                update: {
                    args: Prisma.UsersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UsersPayload>;
                };
                deleteMany: {
                    args: Prisma.UsersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UsersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.UsersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UsersPayload>;
                };
                aggregate: {
                    args: Prisma.UsersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUsers>;
                };
                groupBy: {
                    args: Prisma.UsersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UsersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UsersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UsersCountAggregateOutputType> | number;
                };
            };
        };
        Products: {
            payload: Prisma.$ProductsPayload<ExtArgs>;
            fields: Prisma.ProductsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProductsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProductsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductsPayload>;
                };
                findFirst: {
                    args: Prisma.ProductsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProductsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductsPayload>;
                };
                findMany: {
                    args: Prisma.ProductsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductsPayload>[];
                };
                create: {
                    args: Prisma.ProductsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductsPayload>;
                };
                createMany: {
                    args: Prisma.ProductsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ProductsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductsPayload>;
                };
                update: {
                    args: Prisma.ProductsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductsPayload>;
                };
                deleteMany: {
                    args: Prisma.ProductsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProductsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ProductsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductsPayload>;
                };
                aggregate: {
                    args: Prisma.ProductsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProducts>;
                };
                groupBy: {
                    args: Prisma.ProductsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProductsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductsCountAggregateOutputType> | number;
                };
            };
        };
        Reviews: {
            payload: Prisma.$ReviewsPayload<ExtArgs>;
            fields: Prisma.ReviewsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ReviewsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ReviewsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewsPayload>;
                };
                findFirst: {
                    args: Prisma.ReviewsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ReviewsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewsPayload>;
                };
                findMany: {
                    args: Prisma.ReviewsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewsPayload>[];
                };
                create: {
                    args: Prisma.ReviewsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewsPayload>;
                };
                createMany: {
                    args: Prisma.ReviewsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ReviewsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewsPayload>;
                };
                update: {
                    args: Prisma.ReviewsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewsPayload>;
                };
                deleteMany: {
                    args: Prisma.ReviewsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ReviewsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ReviewsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewsPayload>;
                };
                aggregate: {
                    args: Prisma.ReviewsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReviews>;
                };
                groupBy: {
                    args: Prisma.ReviewsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReviewsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ReviewsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReviewsCountAggregateOutputType> | number;
                };
            };
        };
        Wishlist: {
            payload: Prisma.$WishlistPayload<ExtArgs>;
            fields: Prisma.WishlistFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WishlistFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WishlistPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WishlistFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WishlistPayload>;
                };
                findFirst: {
                    args: Prisma.WishlistFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WishlistPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WishlistFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WishlistPayload>;
                };
                findMany: {
                    args: Prisma.WishlistFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WishlistPayload>[];
                };
                create: {
                    args: Prisma.WishlistCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WishlistPayload>;
                };
                createMany: {
                    args: Prisma.WishlistCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.WishlistDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WishlistPayload>;
                };
                update: {
                    args: Prisma.WishlistUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WishlistPayload>;
                };
                deleteMany: {
                    args: Prisma.WishlistDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WishlistUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.WishlistUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WishlistPayload>;
                };
                aggregate: {
                    args: Prisma.WishlistAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWishlist>;
                };
                groupBy: {
                    args: Prisma.WishlistGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WishlistGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WishlistCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WishlistCountAggregateOutputType> | number;
                };
            };
        };
        RecentlyViewed: {
            payload: Prisma.$RecentlyViewedPayload<ExtArgs>;
            fields: Prisma.RecentlyViewedFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RecentlyViewedFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecentlyViewedPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RecentlyViewedFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>;
                };
                findFirst: {
                    args: Prisma.RecentlyViewedFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecentlyViewedPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RecentlyViewedFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>;
                };
                findMany: {
                    args: Prisma.RecentlyViewedFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>[];
                };
                create: {
                    args: Prisma.RecentlyViewedCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>;
                };
                createMany: {
                    args: Prisma.RecentlyViewedCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.RecentlyViewedDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>;
                };
                update: {
                    args: Prisma.RecentlyViewedUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>;
                };
                deleteMany: {
                    args: Prisma.RecentlyViewedDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RecentlyViewedUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.RecentlyViewedUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>;
                };
                aggregate: {
                    args: Prisma.RecentlyViewedAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRecentlyViewed>;
                };
                groupBy: {
                    args: Prisma.RecentlyViewedGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RecentlyViewedGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RecentlyViewedCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RecentlyViewedCountAggregateOutputType> | number;
                };
            };
        };
        CompareItems: {
            payload: Prisma.$CompareItemsPayload<ExtArgs>;
            fields: Prisma.CompareItemsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CompareItemsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompareItemsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CompareItemsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompareItemsPayload>;
                };
                findFirst: {
                    args: Prisma.CompareItemsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompareItemsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CompareItemsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompareItemsPayload>;
                };
                findMany: {
                    args: Prisma.CompareItemsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompareItemsPayload>[];
                };
                create: {
                    args: Prisma.CompareItemsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompareItemsPayload>;
                };
                createMany: {
                    args: Prisma.CompareItemsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.CompareItemsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompareItemsPayload>;
                };
                update: {
                    args: Prisma.CompareItemsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompareItemsPayload>;
                };
                deleteMany: {
                    args: Prisma.CompareItemsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CompareItemsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.CompareItemsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompareItemsPayload>;
                };
                aggregate: {
                    args: Prisma.CompareItemsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCompareItems>;
                };
                groupBy: {
                    args: Prisma.CompareItemsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompareItemsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CompareItemsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompareItemsCountAggregateOutputType> | number;
                };
            };
        };
        Orders: {
            payload: Prisma.$OrdersPayload<ExtArgs>;
            fields: Prisma.OrdersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrdersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrdersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrdersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrdersPayload>;
                };
                findFirst: {
                    args: Prisma.OrdersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrdersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrdersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrdersPayload>;
                };
                findMany: {
                    args: Prisma.OrdersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrdersPayload>[];
                };
                create: {
                    args: Prisma.OrdersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrdersPayload>;
                };
                createMany: {
                    args: Prisma.OrdersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.OrdersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrdersPayload>;
                };
                update: {
                    args: Prisma.OrdersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrdersPayload>;
                };
                deleteMany: {
                    args: Prisma.OrdersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrdersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.OrdersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrdersPayload>;
                };
                aggregate: {
                    args: Prisma.OrdersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrders>;
                };
                groupBy: {
                    args: Prisma.OrdersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrdersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrdersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrdersCountAggregateOutputType> | number;
                };
            };
        };
        OrderItems: {
            payload: Prisma.$OrderItemsPayload<ExtArgs>;
            fields: Prisma.OrderItemsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrderItemsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrderItemsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemsPayload>;
                };
                findFirst: {
                    args: Prisma.OrderItemsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrderItemsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemsPayload>;
                };
                findMany: {
                    args: Prisma.OrderItemsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemsPayload>[];
                };
                create: {
                    args: Prisma.OrderItemsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemsPayload>;
                };
                createMany: {
                    args: Prisma.OrderItemsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.OrderItemsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemsPayload>;
                };
                update: {
                    args: Prisma.OrderItemsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemsPayload>;
                };
                deleteMany: {
                    args: Prisma.OrderItemsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrderItemsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.OrderItemsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemsPayload>;
                };
                aggregate: {
                    args: Prisma.OrderItemsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrderItems>;
                };
                groupBy: {
                    args: Prisma.OrderItemsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderItemsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrderItemsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderItemsCountAggregateOutputType> | number;
                };
            };
        };
        Address: {
            payload: Prisma.$AddressPayload<ExtArgs>;
            fields: Prisma.AddressFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AddressFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AddressPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AddressFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AddressPayload>;
                };
                findFirst: {
                    args: Prisma.AddressFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AddressPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AddressFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AddressPayload>;
                };
                findMany: {
                    args: Prisma.AddressFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AddressPayload>[];
                };
                create: {
                    args: Prisma.AddressCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AddressPayload>;
                };
                createMany: {
                    args: Prisma.AddressCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.AddressDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AddressPayload>;
                };
                update: {
                    args: Prisma.AddressUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AddressPayload>;
                };
                deleteMany: {
                    args: Prisma.AddressDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AddressUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.AddressUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AddressPayload>;
                };
                aggregate: {
                    args: Prisma.AddressAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAddress>;
                };
                groupBy: {
                    args: Prisma.AddressGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AddressGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AddressCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AddressCountAggregateOutputType> | number;
                };
            };
        };
        Translation: {
            payload: Prisma.$TranslationPayload<ExtArgs>;
            fields: Prisma.TranslationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TranslationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TranslationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TranslationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TranslationPayload>;
                };
                findFirst: {
                    args: Prisma.TranslationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TranslationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TranslationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TranslationPayload>;
                };
                findMany: {
                    args: Prisma.TranslationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TranslationPayload>[];
                };
                create: {
                    args: Prisma.TranslationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TranslationPayload>;
                };
                createMany: {
                    args: Prisma.TranslationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TranslationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TranslationPayload>;
                };
                update: {
                    args: Prisma.TranslationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TranslationPayload>;
                };
                deleteMany: {
                    args: Prisma.TranslationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TranslationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TranslationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TranslationPayload>;
                };
                aggregate: {
                    args: Prisma.TranslationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTranslation>;
                };
                groupBy: {
                    args: Prisma.TranslationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TranslationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TranslationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TranslationCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
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
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>;
export type EnumCourierServiceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CourierService'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type EnumSupportedLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SupportedLanguage'>;
export type BatchPayload = {
    count: number;
};
export type Datasource = {
    url?: string;
};
export type Datasources = {
    db?: Datasource;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientOptions {
    datasources?: Datasources;
    datasourceUrl?: string;
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    adapter?: runtime.SqlDriverAdapterFactory | null;
    omit?: GlobalOmitConfig;
}
export type GlobalOmitConfig = {
    users?: Prisma.UsersOmit;
    products?: Prisma.ProductsOmit;
    reviews?: Prisma.ReviewsOmit;
    wishlist?: Prisma.WishlistOmit;
    recentlyViewed?: Prisma.RecentlyViewedOmit;
    compareItems?: Prisma.CompareItemsOmit;
    orders?: Prisma.OrdersOmit;
    orderItems?: Prisma.OrderItemsOmit;
    address?: Prisma.AddressOmit;
    translation?: Prisma.TranslationOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
