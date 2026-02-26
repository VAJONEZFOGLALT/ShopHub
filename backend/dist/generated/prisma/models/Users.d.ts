import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UsersModel = runtime.Types.Result.DefaultSelection<Prisma.$UsersPayload>;
export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null;
    _avg: UsersAvgAggregateOutputType | null;
    _sum: UsersSumAggregateOutputType | null;
    _min: UsersMinAggregateOutputType | null;
    _max: UsersMaxAggregateOutputType | null;
};
export type UsersAvgAggregateOutputType = {
    id: number | null;
};
export type UsersSumAggregateOutputType = {
    id: number | null;
};
export type UsersMinAggregateOutputType = {
    id: number | null;
    username: string | null;
    email: string | null;
    password_hash: string | null;
    name: string | null;
    avatar: string | null;
    role: string | null;
};
export type UsersMaxAggregateOutputType = {
    id: number | null;
    username: string | null;
    email: string | null;
    password_hash: string | null;
    name: string | null;
    avatar: string | null;
    role: string | null;
};
export type UsersCountAggregateOutputType = {
    id: number;
    username: number;
    email: number;
    password_hash: number;
    name: number;
    avatar: number;
    role: number;
    _all: number;
};
export type UsersAvgAggregateInputType = {
    id?: true;
};
export type UsersSumAggregateInputType = {
    id?: true;
};
export type UsersMinAggregateInputType = {
    id?: true;
    username?: true;
    email?: true;
    password_hash?: true;
    name?: true;
    avatar?: true;
    role?: true;
};
export type UsersMaxAggregateInputType = {
    id?: true;
    username?: true;
    email?: true;
    password_hash?: true;
    name?: true;
    avatar?: true;
    role?: true;
};
export type UsersCountAggregateInputType = {
    id?: true;
    username?: true;
    email?: true;
    password_hash?: true;
    name?: true;
    avatar?: true;
    role?: true;
    _all?: true;
};
export type UsersAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput | Prisma.UsersOrderByWithRelationInput[];
    cursor?: Prisma.UsersWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UsersCountAggregateInputType;
    _avg?: UsersAvgAggregateInputType;
    _sum?: UsersSumAggregateInputType;
    _min?: UsersMinAggregateInputType;
    _max?: UsersMaxAggregateInputType;
};
export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
    [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUsers[P]> : Prisma.GetScalarType<T[P], AggregateUsers[P]>;
};
export type UsersGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithAggregationInput | Prisma.UsersOrderByWithAggregationInput[];
    by: Prisma.UsersScalarFieldEnum[] | Prisma.UsersScalarFieldEnum;
    having?: Prisma.UsersScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UsersCountAggregateInputType | true;
    _avg?: UsersAvgAggregateInputType;
    _sum?: UsersSumAggregateInputType;
    _min?: UsersMinAggregateInputType;
    _max?: UsersMaxAggregateInputType;
};
export type UsersGroupByOutputType = {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    name: string;
    avatar: string | null;
    role: string;
    _count: UsersCountAggregateOutputType | null;
    _avg: UsersAvgAggregateOutputType | null;
    _sum: UsersSumAggregateOutputType | null;
    _min: UsersMinAggregateOutputType | null;
    _max: UsersMaxAggregateOutputType | null;
};
type GetUsersGroupByPayload<T extends UsersGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UsersGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UsersGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UsersGroupByOutputType[P]>;
}>>;
export type UsersWhereInput = {
    AND?: Prisma.UsersWhereInput | Prisma.UsersWhereInput[];
    OR?: Prisma.UsersWhereInput[];
    NOT?: Prisma.UsersWhereInput | Prisma.UsersWhereInput[];
    id?: Prisma.IntFilter<"Users"> | number;
    username?: Prisma.StringFilter<"Users"> | string;
    email?: Prisma.StringFilter<"Users"> | string;
    password_hash?: Prisma.StringFilter<"Users"> | string;
    name?: Prisma.StringFilter<"Users"> | string;
    avatar?: Prisma.StringNullableFilter<"Users"> | string | null;
    role?: Prisma.StringFilter<"Users"> | string;
    orders?: Prisma.OrdersListRelationFilter;
    reviews?: Prisma.ReviewsListRelationFilter;
    wishlist?: Prisma.WishlistListRelationFilter;
    recentlyViewed?: Prisma.RecentlyViewedListRelationFilter;
    compareItems?: Prisma.CompareItemsListRelationFilter;
    addresses?: Prisma.AddressListRelationFilter;
};
export type UsersOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatar?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrder;
    orders?: Prisma.OrdersOrderByRelationAggregateInput;
    reviews?: Prisma.ReviewsOrderByRelationAggregateInput;
    wishlist?: Prisma.WishlistOrderByRelationAggregateInput;
    recentlyViewed?: Prisma.RecentlyViewedOrderByRelationAggregateInput;
    compareItems?: Prisma.CompareItemsOrderByRelationAggregateInput;
    addresses?: Prisma.AddressOrderByRelationAggregateInput;
    _relevance?: Prisma.UsersOrderByRelevanceInput;
};
export type UsersWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    username?: string;
    email?: string;
    AND?: Prisma.UsersWhereInput | Prisma.UsersWhereInput[];
    OR?: Prisma.UsersWhereInput[];
    NOT?: Prisma.UsersWhereInput | Prisma.UsersWhereInput[];
    password_hash?: Prisma.StringFilter<"Users"> | string;
    name?: Prisma.StringFilter<"Users"> | string;
    avatar?: Prisma.StringNullableFilter<"Users"> | string | null;
    role?: Prisma.StringFilter<"Users"> | string;
    orders?: Prisma.OrdersListRelationFilter;
    reviews?: Prisma.ReviewsListRelationFilter;
    wishlist?: Prisma.WishlistListRelationFilter;
    recentlyViewed?: Prisma.RecentlyViewedListRelationFilter;
    compareItems?: Prisma.CompareItemsListRelationFilter;
    addresses?: Prisma.AddressListRelationFilter;
}, "id" | "username" | "email">;
export type UsersOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatar?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrder;
    _count?: Prisma.UsersCountOrderByAggregateInput;
    _avg?: Prisma.UsersAvgOrderByAggregateInput;
    _max?: Prisma.UsersMaxOrderByAggregateInput;
    _min?: Prisma.UsersMinOrderByAggregateInput;
    _sum?: Prisma.UsersSumOrderByAggregateInput;
};
export type UsersScalarWhereWithAggregatesInput = {
    AND?: Prisma.UsersScalarWhereWithAggregatesInput | Prisma.UsersScalarWhereWithAggregatesInput[];
    OR?: Prisma.UsersScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UsersScalarWhereWithAggregatesInput | Prisma.UsersScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Users"> | number;
    username?: Prisma.StringWithAggregatesFilter<"Users"> | string;
    email?: Prisma.StringWithAggregatesFilter<"Users"> | string;
    password_hash?: Prisma.StringWithAggregatesFilter<"Users"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Users"> | string;
    avatar?: Prisma.StringNullableWithAggregatesFilter<"Users"> | string | null;
    role?: Prisma.StringWithAggregatesFilter<"Users"> | string;
};
export type UsersCreateInput = {
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressCreateNestedManyWithoutUserInput;
};
export type UsersUncheckedCreateInput = {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersUncheckedCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsUncheckedCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistUncheckedCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsUncheckedCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressUncheckedCreateNestedManyWithoutUserInput;
};
export type UsersUpdateInput = {
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUpdateManyWithoutUserNestedInput;
};
export type UsersUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUncheckedUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUncheckedUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUncheckedUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUncheckedUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUncheckedUpdateManyWithoutUserNestedInput;
};
export type UsersCreateManyInput = {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
};
export type UsersUpdateManyMutationInput = {
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UsersUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UsersOrderByRelevanceInput = {
    fields: Prisma.UsersOrderByRelevanceFieldEnum | Prisma.UsersOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type UsersCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatar?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
};
export type UsersAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type UsersMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatar?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
};
export type UsersMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatar?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
};
export type UsersSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type UsersScalarRelationFilter = {
    is?: Prisma.UsersWhereInput;
    isNot?: Prisma.UsersWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type UsersCreateNestedOneWithoutReviewsInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutReviewsInput, Prisma.UsersUncheckedCreateWithoutReviewsInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutReviewsInput;
    connect?: Prisma.UsersWhereUniqueInput;
};
export type UsersUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutReviewsInput, Prisma.UsersUncheckedCreateWithoutReviewsInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutReviewsInput;
    upsert?: Prisma.UsersUpsertWithoutReviewsInput;
    connect?: Prisma.UsersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UsersUpdateToOneWithWhereWithoutReviewsInput, Prisma.UsersUpdateWithoutReviewsInput>, Prisma.UsersUncheckedUpdateWithoutReviewsInput>;
};
export type UsersCreateNestedOneWithoutWishlistInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutWishlistInput, Prisma.UsersUncheckedCreateWithoutWishlistInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutWishlistInput;
    connect?: Prisma.UsersWhereUniqueInput;
};
export type UsersUpdateOneRequiredWithoutWishlistNestedInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutWishlistInput, Prisma.UsersUncheckedCreateWithoutWishlistInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutWishlistInput;
    upsert?: Prisma.UsersUpsertWithoutWishlistInput;
    connect?: Prisma.UsersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UsersUpdateToOneWithWhereWithoutWishlistInput, Prisma.UsersUpdateWithoutWishlistInput>, Prisma.UsersUncheckedUpdateWithoutWishlistInput>;
};
export type UsersCreateNestedOneWithoutRecentlyViewedInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutRecentlyViewedInput, Prisma.UsersUncheckedCreateWithoutRecentlyViewedInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutRecentlyViewedInput;
    connect?: Prisma.UsersWhereUniqueInput;
};
export type UsersUpdateOneRequiredWithoutRecentlyViewedNestedInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutRecentlyViewedInput, Prisma.UsersUncheckedCreateWithoutRecentlyViewedInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutRecentlyViewedInput;
    upsert?: Prisma.UsersUpsertWithoutRecentlyViewedInput;
    connect?: Prisma.UsersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UsersUpdateToOneWithWhereWithoutRecentlyViewedInput, Prisma.UsersUpdateWithoutRecentlyViewedInput>, Prisma.UsersUncheckedUpdateWithoutRecentlyViewedInput>;
};
export type UsersCreateNestedOneWithoutCompareItemsInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutCompareItemsInput, Prisma.UsersUncheckedCreateWithoutCompareItemsInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutCompareItemsInput;
    connect?: Prisma.UsersWhereUniqueInput;
};
export type UsersUpdateOneRequiredWithoutCompareItemsNestedInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutCompareItemsInput, Prisma.UsersUncheckedCreateWithoutCompareItemsInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutCompareItemsInput;
    upsert?: Prisma.UsersUpsertWithoutCompareItemsInput;
    connect?: Prisma.UsersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UsersUpdateToOneWithWhereWithoutCompareItemsInput, Prisma.UsersUpdateWithoutCompareItemsInput>, Prisma.UsersUncheckedUpdateWithoutCompareItemsInput>;
};
export type UsersCreateNestedOneWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutOrdersInput, Prisma.UsersUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutOrdersInput;
    connect?: Prisma.UsersWhereUniqueInput;
};
export type UsersUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutOrdersInput, Prisma.UsersUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutOrdersInput;
    upsert?: Prisma.UsersUpsertWithoutOrdersInput;
    connect?: Prisma.UsersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UsersUpdateToOneWithWhereWithoutOrdersInput, Prisma.UsersUpdateWithoutOrdersInput>, Prisma.UsersUncheckedUpdateWithoutOrdersInput>;
};
export type UsersCreateNestedOneWithoutAddressesInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutAddressesInput, Prisma.UsersUncheckedCreateWithoutAddressesInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutAddressesInput;
    connect?: Prisma.UsersWhereUniqueInput;
};
export type UsersUpdateOneRequiredWithoutAddressesNestedInput = {
    create?: Prisma.XOR<Prisma.UsersCreateWithoutAddressesInput, Prisma.UsersUncheckedCreateWithoutAddressesInput>;
    connectOrCreate?: Prisma.UsersCreateOrConnectWithoutAddressesInput;
    upsert?: Prisma.UsersUpsertWithoutAddressesInput;
    connect?: Prisma.UsersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UsersUpdateToOneWithWhereWithoutAddressesInput, Prisma.UsersUpdateWithoutAddressesInput>, Prisma.UsersUncheckedUpdateWithoutAddressesInput>;
};
export type UsersCreateWithoutReviewsInput = {
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressCreateNestedManyWithoutUserInput;
};
export type UsersUncheckedCreateWithoutReviewsInput = {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersUncheckedCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistUncheckedCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsUncheckedCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressUncheckedCreateNestedManyWithoutUserInput;
};
export type UsersCreateOrConnectWithoutReviewsInput = {
    where: Prisma.UsersWhereUniqueInput;
    create: Prisma.XOR<Prisma.UsersCreateWithoutReviewsInput, Prisma.UsersUncheckedCreateWithoutReviewsInput>;
};
export type UsersUpsertWithoutReviewsInput = {
    update: Prisma.XOR<Prisma.UsersUpdateWithoutReviewsInput, Prisma.UsersUncheckedUpdateWithoutReviewsInput>;
    create: Prisma.XOR<Prisma.UsersCreateWithoutReviewsInput, Prisma.UsersUncheckedCreateWithoutReviewsInput>;
    where?: Prisma.UsersWhereInput;
};
export type UsersUpdateToOneWithWhereWithoutReviewsInput = {
    where?: Prisma.UsersWhereInput;
    data: Prisma.XOR<Prisma.UsersUpdateWithoutReviewsInput, Prisma.UsersUncheckedUpdateWithoutReviewsInput>;
};
export type UsersUpdateWithoutReviewsInput = {
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUpdateManyWithoutUserNestedInput;
};
export type UsersUncheckedUpdateWithoutReviewsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUncheckedUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUncheckedUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUncheckedUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUncheckedUpdateManyWithoutUserNestedInput;
};
export type UsersCreateWithoutWishlistInput = {
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressCreateNestedManyWithoutUserInput;
};
export type UsersUncheckedCreateWithoutWishlistInput = {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersUncheckedCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsUncheckedCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsUncheckedCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressUncheckedCreateNestedManyWithoutUserInput;
};
export type UsersCreateOrConnectWithoutWishlistInput = {
    where: Prisma.UsersWhereUniqueInput;
    create: Prisma.XOR<Prisma.UsersCreateWithoutWishlistInput, Prisma.UsersUncheckedCreateWithoutWishlistInput>;
};
export type UsersUpsertWithoutWishlistInput = {
    update: Prisma.XOR<Prisma.UsersUpdateWithoutWishlistInput, Prisma.UsersUncheckedUpdateWithoutWishlistInput>;
    create: Prisma.XOR<Prisma.UsersCreateWithoutWishlistInput, Prisma.UsersUncheckedCreateWithoutWishlistInput>;
    where?: Prisma.UsersWhereInput;
};
export type UsersUpdateToOneWithWhereWithoutWishlistInput = {
    where?: Prisma.UsersWhereInput;
    data: Prisma.XOR<Prisma.UsersUpdateWithoutWishlistInput, Prisma.UsersUncheckedUpdateWithoutWishlistInput>;
};
export type UsersUpdateWithoutWishlistInput = {
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUpdateManyWithoutUserNestedInput;
};
export type UsersUncheckedUpdateWithoutWishlistInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUncheckedUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUncheckedUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUncheckedUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUncheckedUpdateManyWithoutUserNestedInput;
};
export type UsersCreateWithoutRecentlyViewedInput = {
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressCreateNestedManyWithoutUserInput;
};
export type UsersUncheckedCreateWithoutRecentlyViewedInput = {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersUncheckedCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsUncheckedCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistUncheckedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsUncheckedCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressUncheckedCreateNestedManyWithoutUserInput;
};
export type UsersCreateOrConnectWithoutRecentlyViewedInput = {
    where: Prisma.UsersWhereUniqueInput;
    create: Prisma.XOR<Prisma.UsersCreateWithoutRecentlyViewedInput, Prisma.UsersUncheckedCreateWithoutRecentlyViewedInput>;
};
export type UsersUpsertWithoutRecentlyViewedInput = {
    update: Prisma.XOR<Prisma.UsersUpdateWithoutRecentlyViewedInput, Prisma.UsersUncheckedUpdateWithoutRecentlyViewedInput>;
    create: Prisma.XOR<Prisma.UsersCreateWithoutRecentlyViewedInput, Prisma.UsersUncheckedCreateWithoutRecentlyViewedInput>;
    where?: Prisma.UsersWhereInput;
};
export type UsersUpdateToOneWithWhereWithoutRecentlyViewedInput = {
    where?: Prisma.UsersWhereInput;
    data: Prisma.XOR<Prisma.UsersUpdateWithoutRecentlyViewedInput, Prisma.UsersUncheckedUpdateWithoutRecentlyViewedInput>;
};
export type UsersUpdateWithoutRecentlyViewedInput = {
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUpdateManyWithoutUserNestedInput;
};
export type UsersUncheckedUpdateWithoutRecentlyViewedInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUncheckedUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUncheckedUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUncheckedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUncheckedUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUncheckedUpdateManyWithoutUserNestedInput;
};
export type UsersCreateWithoutCompareItemsInput = {
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressCreateNestedManyWithoutUserInput;
};
export type UsersUncheckedCreateWithoutCompareItemsInput = {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersUncheckedCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsUncheckedCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistUncheckedCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressUncheckedCreateNestedManyWithoutUserInput;
};
export type UsersCreateOrConnectWithoutCompareItemsInput = {
    where: Prisma.UsersWhereUniqueInput;
    create: Prisma.XOR<Prisma.UsersCreateWithoutCompareItemsInput, Prisma.UsersUncheckedCreateWithoutCompareItemsInput>;
};
export type UsersUpsertWithoutCompareItemsInput = {
    update: Prisma.XOR<Prisma.UsersUpdateWithoutCompareItemsInput, Prisma.UsersUncheckedUpdateWithoutCompareItemsInput>;
    create: Prisma.XOR<Prisma.UsersCreateWithoutCompareItemsInput, Prisma.UsersUncheckedCreateWithoutCompareItemsInput>;
    where?: Prisma.UsersWhereInput;
};
export type UsersUpdateToOneWithWhereWithoutCompareItemsInput = {
    where?: Prisma.UsersWhereInput;
    data: Prisma.XOR<Prisma.UsersUpdateWithoutCompareItemsInput, Prisma.UsersUncheckedUpdateWithoutCompareItemsInput>;
};
export type UsersUpdateWithoutCompareItemsInput = {
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUpdateManyWithoutUserNestedInput;
};
export type UsersUncheckedUpdateWithoutCompareItemsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUncheckedUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUncheckedUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUncheckedUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUncheckedUpdateManyWithoutUserNestedInput;
};
export type UsersCreateWithoutOrdersInput = {
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    reviews?: Prisma.ReviewsCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressCreateNestedManyWithoutUserInput;
};
export type UsersUncheckedCreateWithoutOrdersInput = {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    reviews?: Prisma.ReviewsUncheckedCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistUncheckedCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsUncheckedCreateNestedManyWithoutUserInput;
    addresses?: Prisma.AddressUncheckedCreateNestedManyWithoutUserInput;
};
export type UsersCreateOrConnectWithoutOrdersInput = {
    where: Prisma.UsersWhereUniqueInput;
    create: Prisma.XOR<Prisma.UsersCreateWithoutOrdersInput, Prisma.UsersUncheckedCreateWithoutOrdersInput>;
};
export type UsersUpsertWithoutOrdersInput = {
    update: Prisma.XOR<Prisma.UsersUpdateWithoutOrdersInput, Prisma.UsersUncheckedUpdateWithoutOrdersInput>;
    create: Prisma.XOR<Prisma.UsersCreateWithoutOrdersInput, Prisma.UsersUncheckedCreateWithoutOrdersInput>;
    where?: Prisma.UsersWhereInput;
};
export type UsersUpdateToOneWithWhereWithoutOrdersInput = {
    where?: Prisma.UsersWhereInput;
    data: Prisma.XOR<Prisma.UsersUpdateWithoutOrdersInput, Prisma.UsersUncheckedUpdateWithoutOrdersInput>;
};
export type UsersUpdateWithoutOrdersInput = {
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    reviews?: Prisma.ReviewsUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUpdateManyWithoutUserNestedInput;
};
export type UsersUncheckedUpdateWithoutOrdersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    reviews?: Prisma.ReviewsUncheckedUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUncheckedUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUncheckedUpdateManyWithoutUserNestedInput;
    addresses?: Prisma.AddressUncheckedUpdateManyWithoutUserNestedInput;
};
export type UsersCreateWithoutAddressesInput = {
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsCreateNestedManyWithoutUserInput;
};
export type UsersUncheckedCreateWithoutAddressesInput = {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    name?: string;
    avatar?: string | null;
    role?: string;
    orders?: Prisma.OrdersUncheckedCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewsUncheckedCreateNestedManyWithoutUserInput;
    wishlist?: Prisma.WishlistUncheckedCreateNestedManyWithoutUserInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedCreateNestedManyWithoutUserInput;
    compareItems?: Prisma.CompareItemsUncheckedCreateNestedManyWithoutUserInput;
};
export type UsersCreateOrConnectWithoutAddressesInput = {
    where: Prisma.UsersWhereUniqueInput;
    create: Prisma.XOR<Prisma.UsersCreateWithoutAddressesInput, Prisma.UsersUncheckedCreateWithoutAddressesInput>;
};
export type UsersUpsertWithoutAddressesInput = {
    update: Prisma.XOR<Prisma.UsersUpdateWithoutAddressesInput, Prisma.UsersUncheckedUpdateWithoutAddressesInput>;
    create: Prisma.XOR<Prisma.UsersCreateWithoutAddressesInput, Prisma.UsersUncheckedCreateWithoutAddressesInput>;
    where?: Prisma.UsersWhereInput;
};
export type UsersUpdateToOneWithWhereWithoutAddressesInput = {
    where?: Prisma.UsersWhereInput;
    data: Prisma.XOR<Prisma.UsersUpdateWithoutAddressesInput, Prisma.UsersUncheckedUpdateWithoutAddressesInput>;
};
export type UsersUpdateWithoutAddressesInput = {
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUpdateManyWithoutUserNestedInput;
};
export type UsersUncheckedUpdateWithoutAddressesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    orders?: Prisma.OrdersUncheckedUpdateManyWithoutUserNestedInput;
    reviews?: Prisma.ReviewsUncheckedUpdateManyWithoutUserNestedInput;
    wishlist?: Prisma.WishlistUncheckedUpdateManyWithoutUserNestedInput;
    recentlyViewed?: Prisma.RecentlyViewedUncheckedUpdateManyWithoutUserNestedInput;
    compareItems?: Prisma.CompareItemsUncheckedUpdateManyWithoutUserNestedInput;
};
export type UsersCountOutputType = {
    orders: number;
    reviews: number;
    wishlist: number;
    recentlyViewed: number;
    compareItems: number;
    addresses: number;
};
export type UsersCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orders?: boolean | UsersCountOutputTypeCountOrdersArgs;
    reviews?: boolean | UsersCountOutputTypeCountReviewsArgs;
    wishlist?: boolean | UsersCountOutputTypeCountWishlistArgs;
    recentlyViewed?: boolean | UsersCountOutputTypeCountRecentlyViewedArgs;
    compareItems?: boolean | UsersCountOutputTypeCountCompareItemsArgs;
    addresses?: boolean | UsersCountOutputTypeCountAddressesArgs;
};
export type UsersCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersCountOutputTypeSelect<ExtArgs> | null;
};
export type UsersCountOutputTypeCountOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrdersWhereInput;
};
export type UsersCountOutputTypeCountReviewsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReviewsWhereInput;
};
export type UsersCountOutputTypeCountWishlistArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WishlistWhereInput;
};
export type UsersCountOutputTypeCountRecentlyViewedArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RecentlyViewedWhereInput;
};
export type UsersCountOutputTypeCountCompareItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CompareItemsWhereInput;
};
export type UsersCountOutputTypeCountAddressesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AddressWhereInput;
};
export type UsersSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    username?: boolean;
    email?: boolean;
    password_hash?: boolean;
    name?: boolean;
    avatar?: boolean;
    role?: boolean;
    orders?: boolean | Prisma.Users$ordersArgs<ExtArgs>;
    reviews?: boolean | Prisma.Users$reviewsArgs<ExtArgs>;
    wishlist?: boolean | Prisma.Users$wishlistArgs<ExtArgs>;
    recentlyViewed?: boolean | Prisma.Users$recentlyViewedArgs<ExtArgs>;
    compareItems?: boolean | Prisma.Users$compareItemsArgs<ExtArgs>;
    addresses?: boolean | Prisma.Users$addressesArgs<ExtArgs>;
    _count?: boolean | Prisma.UsersCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["users"]>;
export type UsersSelectScalar = {
    id?: boolean;
    username?: boolean;
    email?: boolean;
    password_hash?: boolean;
    name?: boolean;
    avatar?: boolean;
    role?: boolean;
};
export type UsersOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "username" | "email" | "password_hash" | "name" | "avatar" | "role", ExtArgs["result"]["users"]>;
export type UsersInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orders?: boolean | Prisma.Users$ordersArgs<ExtArgs>;
    reviews?: boolean | Prisma.Users$reviewsArgs<ExtArgs>;
    wishlist?: boolean | Prisma.Users$wishlistArgs<ExtArgs>;
    recentlyViewed?: boolean | Prisma.Users$recentlyViewedArgs<ExtArgs>;
    compareItems?: boolean | Prisma.Users$compareItemsArgs<ExtArgs>;
    addresses?: boolean | Prisma.Users$addressesArgs<ExtArgs>;
    _count?: boolean | Prisma.UsersCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $UsersPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Users";
    objects: {
        orders: Prisma.$OrdersPayload<ExtArgs>[];
        reviews: Prisma.$ReviewsPayload<ExtArgs>[];
        wishlist: Prisma.$WishlistPayload<ExtArgs>[];
        recentlyViewed: Prisma.$RecentlyViewedPayload<ExtArgs>[];
        compareItems: Prisma.$CompareItemsPayload<ExtArgs>[];
        addresses: Prisma.$AddressPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        username: string;
        email: string;
        password_hash: string;
        name: string;
        avatar: string | null;
        role: string;
    }, ExtArgs["result"]["users"]>;
    composites: {};
};
export type UsersGetPayload<S extends boolean | null | undefined | UsersDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UsersPayload, S>;
export type UsersCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UsersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UsersCountAggregateInputType | true;
};
export interface UsersDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Users'];
        meta: {
            name: 'Users';
        };
    };
    findUnique<T extends UsersFindUniqueArgs>(args: Prisma.SelectSubset<T, UsersFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UsersClient<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UsersFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UsersFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UsersClient<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UsersFindFirstArgs>(args?: Prisma.SelectSubset<T, UsersFindFirstArgs<ExtArgs>>): Prisma.Prisma__UsersClient<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UsersFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UsersFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UsersClient<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UsersFindManyArgs>(args?: Prisma.SelectSubset<T, UsersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UsersCreateArgs>(args: Prisma.SelectSubset<T, UsersCreateArgs<ExtArgs>>): Prisma.Prisma__UsersClient<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UsersCreateManyArgs>(args?: Prisma.SelectSubset<T, UsersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends UsersDeleteArgs>(args: Prisma.SelectSubset<T, UsersDeleteArgs<ExtArgs>>): Prisma.Prisma__UsersClient<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UsersUpdateArgs>(args: Prisma.SelectSubset<T, UsersUpdateArgs<ExtArgs>>): Prisma.Prisma__UsersClient<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UsersDeleteManyArgs>(args?: Prisma.SelectSubset<T, UsersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UsersUpdateManyArgs>(args: Prisma.SelectSubset<T, UsersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends UsersUpsertArgs>(args: Prisma.SelectSubset<T, UsersUpsertArgs<ExtArgs>>): Prisma.Prisma__UsersClient<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UsersCountArgs>(args?: Prisma.Subset<T, UsersCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UsersCountAggregateOutputType> : number>;
    aggregate<T extends UsersAggregateArgs>(args: Prisma.Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>;
    groupBy<T extends UsersGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UsersGroupByArgs['orderBy'];
    } : {
        orderBy?: UsersGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UsersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UsersFieldRefs;
}
export interface Prisma__UsersClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    orders<T extends Prisma.Users$ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Users$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    reviews<T extends Prisma.Users$reviewsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Users$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReviewsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    wishlist<T extends Prisma.Users$wishlistArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Users$wishlistArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    recentlyViewed<T extends Prisma.Users$recentlyViewedArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Users$recentlyViewedArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    compareItems<T extends Prisma.Users$compareItemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Users$compareItemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CompareItemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    addresses<T extends Prisma.Users$addressesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Users$addressesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UsersFieldRefs {
    readonly id: Prisma.FieldRef<"Users", 'Int'>;
    readonly username: Prisma.FieldRef<"Users", 'String'>;
    readonly email: Prisma.FieldRef<"Users", 'String'>;
    readonly password_hash: Prisma.FieldRef<"Users", 'String'>;
    readonly name: Prisma.FieldRef<"Users", 'String'>;
    readonly avatar: Prisma.FieldRef<"Users", 'String'>;
    readonly role: Prisma.FieldRef<"Users", 'String'>;
}
export type UsersFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
    where: Prisma.UsersWhereUniqueInput;
};
export type UsersFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
    where: Prisma.UsersWhereUniqueInput;
};
export type UsersFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput | Prisma.UsersOrderByWithRelationInput[];
    cursor?: Prisma.UsersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UsersScalarFieldEnum | Prisma.UsersScalarFieldEnum[];
};
export type UsersFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput | Prisma.UsersOrderByWithRelationInput[];
    cursor?: Prisma.UsersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UsersScalarFieldEnum | Prisma.UsersScalarFieldEnum[];
};
export type UsersFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput | Prisma.UsersOrderByWithRelationInput[];
    cursor?: Prisma.UsersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UsersScalarFieldEnum | Prisma.UsersScalarFieldEnum[];
};
export type UsersCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UsersCreateInput, Prisma.UsersUncheckedCreateInput>;
};
export type UsersCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UsersCreateManyInput | Prisma.UsersCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UsersUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UsersUpdateInput, Prisma.UsersUncheckedUpdateInput>;
    where: Prisma.UsersWhereUniqueInput;
};
export type UsersUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UsersUpdateManyMutationInput, Prisma.UsersUncheckedUpdateManyInput>;
    where?: Prisma.UsersWhereInput;
    limit?: number;
};
export type UsersUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
    where: Prisma.UsersWhereUniqueInput;
    create: Prisma.XOR<Prisma.UsersCreateInput, Prisma.UsersUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UsersUpdateInput, Prisma.UsersUncheckedUpdateInput>;
};
export type UsersDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
    where: Prisma.UsersWhereUniqueInput;
};
export type UsersDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UsersWhereInput;
    limit?: number;
};
export type Users$ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrdersSelect<ExtArgs> | null;
    omit?: Prisma.OrdersOmit<ExtArgs> | null;
    include?: Prisma.OrdersInclude<ExtArgs> | null;
    where?: Prisma.OrdersWhereInput;
    orderBy?: Prisma.OrdersOrderByWithRelationInput | Prisma.OrdersOrderByWithRelationInput[];
    cursor?: Prisma.OrdersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrdersScalarFieldEnum | Prisma.OrdersScalarFieldEnum[];
};
export type Users$reviewsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewsSelect<ExtArgs> | null;
    omit?: Prisma.ReviewsOmit<ExtArgs> | null;
    include?: Prisma.ReviewsInclude<ExtArgs> | null;
    where?: Prisma.ReviewsWhereInput;
    orderBy?: Prisma.ReviewsOrderByWithRelationInput | Prisma.ReviewsOrderByWithRelationInput[];
    cursor?: Prisma.ReviewsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReviewsScalarFieldEnum | Prisma.ReviewsScalarFieldEnum[];
};
export type Users$wishlistArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WishlistSelect<ExtArgs> | null;
    omit?: Prisma.WishlistOmit<ExtArgs> | null;
    include?: Prisma.WishlistInclude<ExtArgs> | null;
    where?: Prisma.WishlistWhereInput;
    orderBy?: Prisma.WishlistOrderByWithRelationInput | Prisma.WishlistOrderByWithRelationInput[];
    cursor?: Prisma.WishlistWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WishlistScalarFieldEnum | Prisma.WishlistScalarFieldEnum[];
};
export type Users$recentlyViewedArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecentlyViewedSelect<ExtArgs> | null;
    omit?: Prisma.RecentlyViewedOmit<ExtArgs> | null;
    include?: Prisma.RecentlyViewedInclude<ExtArgs> | null;
    where?: Prisma.RecentlyViewedWhereInput;
    orderBy?: Prisma.RecentlyViewedOrderByWithRelationInput | Prisma.RecentlyViewedOrderByWithRelationInput[];
    cursor?: Prisma.RecentlyViewedWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RecentlyViewedScalarFieldEnum | Prisma.RecentlyViewedScalarFieldEnum[];
};
export type Users$compareItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompareItemsSelect<ExtArgs> | null;
    omit?: Prisma.CompareItemsOmit<ExtArgs> | null;
    include?: Prisma.CompareItemsInclude<ExtArgs> | null;
    where?: Prisma.CompareItemsWhereInput;
    orderBy?: Prisma.CompareItemsOrderByWithRelationInput | Prisma.CompareItemsOrderByWithRelationInput[];
    cursor?: Prisma.CompareItemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompareItemsScalarFieldEnum | Prisma.CompareItemsScalarFieldEnum[];
};
export type Users$addressesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AddressSelect<ExtArgs> | null;
    omit?: Prisma.AddressOmit<ExtArgs> | null;
    include?: Prisma.AddressInclude<ExtArgs> | null;
    where?: Prisma.AddressWhereInput;
    orderBy?: Prisma.AddressOrderByWithRelationInput | Prisma.AddressOrderByWithRelationInput[];
    cursor?: Prisma.AddressWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AddressScalarFieldEnum | Prisma.AddressScalarFieldEnum[];
};
export type UsersDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersSelect<ExtArgs> | null;
    omit?: Prisma.UsersOmit<ExtArgs> | null;
    include?: Prisma.UsersInclude<ExtArgs> | null;
};
export {};
