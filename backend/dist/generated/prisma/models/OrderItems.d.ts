import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type OrderItemsModel = runtime.Types.Result.DefaultSelection<Prisma.$OrderItemsPayload>;
export type AggregateOrderItems = {
    _count: OrderItemsCountAggregateOutputType | null;
    _avg: OrderItemsAvgAggregateOutputType | null;
    _sum: OrderItemsSumAggregateOutputType | null;
    _min: OrderItemsMinAggregateOutputType | null;
    _max: OrderItemsMaxAggregateOutputType | null;
};
export type OrderItemsAvgAggregateOutputType = {
    id: number | null;
    orderId: number | null;
    productId: number | null;
    quantity: number | null;
    price: number | null;
};
export type OrderItemsSumAggregateOutputType = {
    id: number | null;
    orderId: number | null;
    productId: number | null;
    quantity: number | null;
    price: number | null;
};
export type OrderItemsMinAggregateOutputType = {
    id: number | null;
    orderId: number | null;
    productId: number | null;
    quantity: number | null;
    price: number | null;
};
export type OrderItemsMaxAggregateOutputType = {
    id: number | null;
    orderId: number | null;
    productId: number | null;
    quantity: number | null;
    price: number | null;
};
export type OrderItemsCountAggregateOutputType = {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    _all: number;
};
export type OrderItemsAvgAggregateInputType = {
    id?: true;
    orderId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
};
export type OrderItemsSumAggregateInputType = {
    id?: true;
    orderId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
};
export type OrderItemsMinAggregateInputType = {
    id?: true;
    orderId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
};
export type OrderItemsMaxAggregateInputType = {
    id?: true;
    orderId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
};
export type OrderItemsCountAggregateInputType = {
    id?: true;
    orderId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
    _all?: true;
};
export type OrderItemsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemsWhereInput;
    orderBy?: Prisma.OrderItemsOrderByWithRelationInput | Prisma.OrderItemsOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrderItemsCountAggregateInputType;
    _avg?: OrderItemsAvgAggregateInputType;
    _sum?: OrderItemsSumAggregateInputType;
    _min?: OrderItemsMinAggregateInputType;
    _max?: OrderItemsMaxAggregateInputType;
};
export type GetOrderItemsAggregateType<T extends OrderItemsAggregateArgs> = {
    [P in keyof T & keyof AggregateOrderItems]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrderItems[P]> : Prisma.GetScalarType<T[P], AggregateOrderItems[P]>;
};
export type OrderItemsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemsWhereInput;
    orderBy?: Prisma.OrderItemsOrderByWithAggregationInput | Prisma.OrderItemsOrderByWithAggregationInput[];
    by: Prisma.OrderItemsScalarFieldEnum[] | Prisma.OrderItemsScalarFieldEnum;
    having?: Prisma.OrderItemsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderItemsCountAggregateInputType | true;
    _avg?: OrderItemsAvgAggregateInputType;
    _sum?: OrderItemsSumAggregateInputType;
    _min?: OrderItemsMinAggregateInputType;
    _max?: OrderItemsMaxAggregateInputType;
};
export type OrderItemsGroupByOutputType = {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    _count: OrderItemsCountAggregateOutputType | null;
    _avg: OrderItemsAvgAggregateOutputType | null;
    _sum: OrderItemsSumAggregateOutputType | null;
    _min: OrderItemsMinAggregateOutputType | null;
    _max: OrderItemsMaxAggregateOutputType | null;
};
type GetOrderItemsGroupByPayload<T extends OrderItemsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrderItemsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrderItemsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrderItemsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrderItemsGroupByOutputType[P]>;
}>>;
export type OrderItemsWhereInput = {
    AND?: Prisma.OrderItemsWhereInput | Prisma.OrderItemsWhereInput[];
    OR?: Prisma.OrderItemsWhereInput[];
    NOT?: Prisma.OrderItemsWhereInput | Prisma.OrderItemsWhereInput[];
    id?: Prisma.IntFilter<"OrderItems"> | number;
    orderId?: Prisma.IntFilter<"OrderItems"> | number;
    productId?: Prisma.IntFilter<"OrderItems"> | number;
    quantity?: Prisma.IntFilter<"OrderItems"> | number;
    price?: Prisma.FloatFilter<"OrderItems"> | number;
    order?: Prisma.XOR<Prisma.OrdersScalarRelationFilter, Prisma.OrdersWhereInput>;
    product?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.ProductsWhereInput>;
};
export type OrderItemsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    order?: Prisma.OrdersOrderByWithRelationInput;
    product?: Prisma.ProductsOrderByWithRelationInput;
};
export type OrderItemsWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.OrderItemsWhereInput | Prisma.OrderItemsWhereInput[];
    OR?: Prisma.OrderItemsWhereInput[];
    NOT?: Prisma.OrderItemsWhereInput | Prisma.OrderItemsWhereInput[];
    orderId?: Prisma.IntFilter<"OrderItems"> | number;
    productId?: Prisma.IntFilter<"OrderItems"> | number;
    quantity?: Prisma.IntFilter<"OrderItems"> | number;
    price?: Prisma.FloatFilter<"OrderItems"> | number;
    order?: Prisma.XOR<Prisma.OrdersScalarRelationFilter, Prisma.OrdersWhereInput>;
    product?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.ProductsWhereInput>;
}, "id">;
export type OrderItemsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    _count?: Prisma.OrderItemsCountOrderByAggregateInput;
    _avg?: Prisma.OrderItemsAvgOrderByAggregateInput;
    _max?: Prisma.OrderItemsMaxOrderByAggregateInput;
    _min?: Prisma.OrderItemsMinOrderByAggregateInput;
    _sum?: Prisma.OrderItemsSumOrderByAggregateInput;
};
export type OrderItemsScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrderItemsScalarWhereWithAggregatesInput | Prisma.OrderItemsScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrderItemsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrderItemsScalarWhereWithAggregatesInput | Prisma.OrderItemsScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"OrderItems"> | number;
    orderId?: Prisma.IntWithAggregatesFilter<"OrderItems"> | number;
    productId?: Prisma.IntWithAggregatesFilter<"OrderItems"> | number;
    quantity?: Prisma.IntWithAggregatesFilter<"OrderItems"> | number;
    price?: Prisma.FloatWithAggregatesFilter<"OrderItems"> | number;
};
export type OrderItemsCreateInput = {
    quantity: number;
    price: number;
    order: Prisma.OrdersCreateNestedOneWithoutOrderItemsInput;
    product: Prisma.ProductsCreateNestedOneWithoutOrderItemsInput;
};
export type OrderItemsUncheckedCreateInput = {
    id?: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
};
export type OrderItemsUpdateInput = {
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    order?: Prisma.OrdersUpdateOneRequiredWithoutOrderItemsNestedInput;
    product?: Prisma.ProductsUpdateOneRequiredWithoutOrderItemsNestedInput;
};
export type OrderItemsUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    orderId?: Prisma.IntFieldUpdateOperationsInput | number;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemsCreateManyInput = {
    id?: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
};
export type OrderItemsUpdateManyMutationInput = {
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemsUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    orderId?: Prisma.IntFieldUpdateOperationsInput | number;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemsListRelationFilter = {
    every?: Prisma.OrderItemsWhereInput;
    some?: Prisma.OrderItemsWhereInput;
    none?: Prisma.OrderItemsWhereInput;
};
export type OrderItemsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OrderItemsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemsAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemsSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemsCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.OrderItemsCreateWithoutProductInput, Prisma.OrderItemsUncheckedCreateWithoutProductInput> | Prisma.OrderItemsCreateWithoutProductInput[] | Prisma.OrderItemsUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.OrderItemsCreateOrConnectWithoutProductInput | Prisma.OrderItemsCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.OrderItemsCreateManyProductInputEnvelope;
    connect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
};
export type OrderItemsUncheckedCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.OrderItemsCreateWithoutProductInput, Prisma.OrderItemsUncheckedCreateWithoutProductInput> | Prisma.OrderItemsCreateWithoutProductInput[] | Prisma.OrderItemsUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.OrderItemsCreateOrConnectWithoutProductInput | Prisma.OrderItemsCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.OrderItemsCreateManyProductInputEnvelope;
    connect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
};
export type OrderItemsUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemsCreateWithoutProductInput, Prisma.OrderItemsUncheckedCreateWithoutProductInput> | Prisma.OrderItemsCreateWithoutProductInput[] | Prisma.OrderItemsUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.OrderItemsCreateOrConnectWithoutProductInput | Prisma.OrderItemsCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.OrderItemsUpsertWithWhereUniqueWithoutProductInput | Prisma.OrderItemsUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.OrderItemsCreateManyProductInputEnvelope;
    set?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    disconnect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    delete?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    connect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    update?: Prisma.OrderItemsUpdateWithWhereUniqueWithoutProductInput | Prisma.OrderItemsUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.OrderItemsUpdateManyWithWhereWithoutProductInput | Prisma.OrderItemsUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.OrderItemsScalarWhereInput | Prisma.OrderItemsScalarWhereInput[];
};
export type OrderItemsUncheckedUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemsCreateWithoutProductInput, Prisma.OrderItemsUncheckedCreateWithoutProductInput> | Prisma.OrderItemsCreateWithoutProductInput[] | Prisma.OrderItemsUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.OrderItemsCreateOrConnectWithoutProductInput | Prisma.OrderItemsCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.OrderItemsUpsertWithWhereUniqueWithoutProductInput | Prisma.OrderItemsUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.OrderItemsCreateManyProductInputEnvelope;
    set?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    disconnect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    delete?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    connect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    update?: Prisma.OrderItemsUpdateWithWhereUniqueWithoutProductInput | Prisma.OrderItemsUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.OrderItemsUpdateManyWithWhereWithoutProductInput | Prisma.OrderItemsUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.OrderItemsScalarWhereInput | Prisma.OrderItemsScalarWhereInput[];
};
export type OrderItemsCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.OrderItemsCreateWithoutOrderInput, Prisma.OrderItemsUncheckedCreateWithoutOrderInput> | Prisma.OrderItemsCreateWithoutOrderInput[] | Prisma.OrderItemsUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderItemsCreateOrConnectWithoutOrderInput | Prisma.OrderItemsCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.OrderItemsCreateManyOrderInputEnvelope;
    connect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
};
export type OrderItemsUncheckedCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.OrderItemsCreateWithoutOrderInput, Prisma.OrderItemsUncheckedCreateWithoutOrderInput> | Prisma.OrderItemsCreateWithoutOrderInput[] | Prisma.OrderItemsUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderItemsCreateOrConnectWithoutOrderInput | Prisma.OrderItemsCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.OrderItemsCreateManyOrderInputEnvelope;
    connect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
};
export type OrderItemsUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemsCreateWithoutOrderInput, Prisma.OrderItemsUncheckedCreateWithoutOrderInput> | Prisma.OrderItemsCreateWithoutOrderInput[] | Prisma.OrderItemsUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderItemsCreateOrConnectWithoutOrderInput | Prisma.OrderItemsCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.OrderItemsUpsertWithWhereUniqueWithoutOrderInput | Prisma.OrderItemsUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.OrderItemsCreateManyOrderInputEnvelope;
    set?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    disconnect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    delete?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    connect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    update?: Prisma.OrderItemsUpdateWithWhereUniqueWithoutOrderInput | Prisma.OrderItemsUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.OrderItemsUpdateManyWithWhereWithoutOrderInput | Prisma.OrderItemsUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.OrderItemsScalarWhereInput | Prisma.OrderItemsScalarWhereInput[];
};
export type OrderItemsUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemsCreateWithoutOrderInput, Prisma.OrderItemsUncheckedCreateWithoutOrderInput> | Prisma.OrderItemsCreateWithoutOrderInput[] | Prisma.OrderItemsUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderItemsCreateOrConnectWithoutOrderInput | Prisma.OrderItemsCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.OrderItemsUpsertWithWhereUniqueWithoutOrderInput | Prisma.OrderItemsUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.OrderItemsCreateManyOrderInputEnvelope;
    set?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    disconnect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    delete?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    connect?: Prisma.OrderItemsWhereUniqueInput | Prisma.OrderItemsWhereUniqueInput[];
    update?: Prisma.OrderItemsUpdateWithWhereUniqueWithoutOrderInput | Prisma.OrderItemsUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.OrderItemsUpdateManyWithWhereWithoutOrderInput | Prisma.OrderItemsUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.OrderItemsScalarWhereInput | Prisma.OrderItemsScalarWhereInput[];
};
export type OrderItemsCreateWithoutProductInput = {
    quantity: number;
    price: number;
    order: Prisma.OrdersCreateNestedOneWithoutOrderItemsInput;
};
export type OrderItemsUncheckedCreateWithoutProductInput = {
    id?: number;
    orderId: number;
    quantity: number;
    price: number;
};
export type OrderItemsCreateOrConnectWithoutProductInput = {
    where: Prisma.OrderItemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderItemsCreateWithoutProductInput, Prisma.OrderItemsUncheckedCreateWithoutProductInput>;
};
export type OrderItemsCreateManyProductInputEnvelope = {
    data: Prisma.OrderItemsCreateManyProductInput | Prisma.OrderItemsCreateManyProductInput[];
    skipDuplicates?: boolean;
};
export type OrderItemsUpsertWithWhereUniqueWithoutProductInput = {
    where: Prisma.OrderItemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderItemsUpdateWithoutProductInput, Prisma.OrderItemsUncheckedUpdateWithoutProductInput>;
    create: Prisma.XOR<Prisma.OrderItemsCreateWithoutProductInput, Prisma.OrderItemsUncheckedCreateWithoutProductInput>;
};
export type OrderItemsUpdateWithWhereUniqueWithoutProductInput = {
    where: Prisma.OrderItemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderItemsUpdateWithoutProductInput, Prisma.OrderItemsUncheckedUpdateWithoutProductInput>;
};
export type OrderItemsUpdateManyWithWhereWithoutProductInput = {
    where: Prisma.OrderItemsScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderItemsUpdateManyMutationInput, Prisma.OrderItemsUncheckedUpdateManyWithoutProductInput>;
};
export type OrderItemsScalarWhereInput = {
    AND?: Prisma.OrderItemsScalarWhereInput | Prisma.OrderItemsScalarWhereInput[];
    OR?: Prisma.OrderItemsScalarWhereInput[];
    NOT?: Prisma.OrderItemsScalarWhereInput | Prisma.OrderItemsScalarWhereInput[];
    id?: Prisma.IntFilter<"OrderItems"> | number;
    orderId?: Prisma.IntFilter<"OrderItems"> | number;
    productId?: Prisma.IntFilter<"OrderItems"> | number;
    quantity?: Prisma.IntFilter<"OrderItems"> | number;
    price?: Prisma.FloatFilter<"OrderItems"> | number;
};
export type OrderItemsCreateWithoutOrderInput = {
    quantity: number;
    price: number;
    product: Prisma.ProductsCreateNestedOneWithoutOrderItemsInput;
};
export type OrderItemsUncheckedCreateWithoutOrderInput = {
    id?: number;
    productId: number;
    quantity: number;
    price: number;
};
export type OrderItemsCreateOrConnectWithoutOrderInput = {
    where: Prisma.OrderItemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderItemsCreateWithoutOrderInput, Prisma.OrderItemsUncheckedCreateWithoutOrderInput>;
};
export type OrderItemsCreateManyOrderInputEnvelope = {
    data: Prisma.OrderItemsCreateManyOrderInput | Prisma.OrderItemsCreateManyOrderInput[];
    skipDuplicates?: boolean;
};
export type OrderItemsUpsertWithWhereUniqueWithoutOrderInput = {
    where: Prisma.OrderItemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderItemsUpdateWithoutOrderInput, Prisma.OrderItemsUncheckedUpdateWithoutOrderInput>;
    create: Prisma.XOR<Prisma.OrderItemsCreateWithoutOrderInput, Prisma.OrderItemsUncheckedCreateWithoutOrderInput>;
};
export type OrderItemsUpdateWithWhereUniqueWithoutOrderInput = {
    where: Prisma.OrderItemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderItemsUpdateWithoutOrderInput, Prisma.OrderItemsUncheckedUpdateWithoutOrderInput>;
};
export type OrderItemsUpdateManyWithWhereWithoutOrderInput = {
    where: Prisma.OrderItemsScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderItemsUpdateManyMutationInput, Prisma.OrderItemsUncheckedUpdateManyWithoutOrderInput>;
};
export type OrderItemsCreateManyProductInput = {
    id?: number;
    orderId: number;
    quantity: number;
    price: number;
};
export type OrderItemsUpdateWithoutProductInput = {
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    order?: Prisma.OrdersUpdateOneRequiredWithoutOrderItemsNestedInput;
};
export type OrderItemsUncheckedUpdateWithoutProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    orderId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemsUncheckedUpdateManyWithoutProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    orderId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemsCreateManyOrderInput = {
    id?: number;
    productId: number;
    quantity: number;
    price: number;
};
export type OrderItemsUpdateWithoutOrderInput = {
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    product?: Prisma.ProductsUpdateOneRequiredWithoutOrderItemsNestedInput;
};
export type OrderItemsUncheckedUpdateWithoutOrderInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemsUncheckedUpdateManyWithoutOrderInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    productId?: boolean;
    quantity?: boolean;
    price?: boolean;
    order?: boolean | Prisma.OrdersDefaultArgs<ExtArgs>;
    product?: boolean | Prisma.ProductsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderItems"]>;
export type OrderItemsSelectScalar = {
    id?: boolean;
    orderId?: boolean;
    productId?: boolean;
    quantity?: boolean;
    price?: boolean;
};
export type OrderItemsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orderId" | "productId" | "quantity" | "price", ExtArgs["result"]["orderItems"]>;
export type OrderItemsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrdersDefaultArgs<ExtArgs>;
    product?: boolean | Prisma.ProductsDefaultArgs<ExtArgs>;
};
export type $OrderItemsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OrderItems";
    objects: {
        order: Prisma.$OrdersPayload<ExtArgs>;
        product: Prisma.$ProductsPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        orderId: number;
        productId: number;
        quantity: number;
        price: number;
    }, ExtArgs["result"]["orderItems"]>;
    composites: {};
};
export type OrderItemsGetPayload<S extends boolean | null | undefined | OrderItemsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload, S>;
export type OrderItemsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrderItemsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrderItemsCountAggregateInputType | true;
};
export interface OrderItemsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OrderItems'];
        meta: {
            name: 'OrderItems';
        };
    };
    findUnique<T extends OrderItemsFindUniqueArgs>(args: Prisma.SelectSubset<T, OrderItemsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrderItemsClient<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrderItemsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrderItemsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderItemsClient<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrderItemsFindFirstArgs>(args?: Prisma.SelectSubset<T, OrderItemsFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrderItemsClient<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrderItemsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrderItemsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderItemsClient<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrderItemsFindManyArgs>(args?: Prisma.SelectSubset<T, OrderItemsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrderItemsCreateArgs>(args: Prisma.SelectSubset<T, OrderItemsCreateArgs<ExtArgs>>): Prisma.Prisma__OrderItemsClient<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrderItemsCreateManyArgs>(args?: Prisma.SelectSubset<T, OrderItemsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends OrderItemsDeleteArgs>(args: Prisma.SelectSubset<T, OrderItemsDeleteArgs<ExtArgs>>): Prisma.Prisma__OrderItemsClient<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrderItemsUpdateArgs>(args: Prisma.SelectSubset<T, OrderItemsUpdateArgs<ExtArgs>>): Prisma.Prisma__OrderItemsClient<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrderItemsDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrderItemsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrderItemsUpdateManyArgs>(args: Prisma.SelectSubset<T, OrderItemsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends OrderItemsUpsertArgs>(args: Prisma.SelectSubset<T, OrderItemsUpsertArgs<ExtArgs>>): Prisma.Prisma__OrderItemsClient<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrderItemsCountArgs>(args?: Prisma.Subset<T, OrderItemsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrderItemsCountAggregateOutputType> : number>;
    aggregate<T extends OrderItemsAggregateArgs>(args: Prisma.Subset<T, OrderItemsAggregateArgs>): Prisma.PrismaPromise<GetOrderItemsAggregateType<T>>;
    groupBy<T extends OrderItemsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrderItemsGroupByArgs['orderBy'];
    } : {
        orderBy?: OrderItemsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrderItemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderItemsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrderItemsFieldRefs;
}
export interface Prisma__OrderItemsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    order<T extends Prisma.OrdersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrdersDefaultArgs<ExtArgs>>): Prisma.Prisma__OrdersClient<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    product<T extends Prisma.ProductsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProductsDefaultArgs<ExtArgs>>): Prisma.Prisma__ProductsClient<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrderItemsFieldRefs {
    readonly id: Prisma.FieldRef<"OrderItems", 'Int'>;
    readonly orderId: Prisma.FieldRef<"OrderItems", 'Int'>;
    readonly productId: Prisma.FieldRef<"OrderItems", 'Int'>;
    readonly quantity: Prisma.FieldRef<"OrderItems", 'Int'>;
    readonly price: Prisma.FieldRef<"OrderItems", 'Float'>;
}
export type OrderItemsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
    where: Prisma.OrderItemsWhereUniqueInput;
};
export type OrderItemsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
    where: Prisma.OrderItemsWhereUniqueInput;
};
export type OrderItemsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
    where?: Prisma.OrderItemsWhereInput;
    orderBy?: Prisma.OrderItemsOrderByWithRelationInput | Prisma.OrderItemsOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderItemsScalarFieldEnum | Prisma.OrderItemsScalarFieldEnum[];
};
export type OrderItemsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
    where?: Prisma.OrderItemsWhereInput;
    orderBy?: Prisma.OrderItemsOrderByWithRelationInput | Prisma.OrderItemsOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderItemsScalarFieldEnum | Prisma.OrderItemsScalarFieldEnum[];
};
export type OrderItemsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
    where?: Prisma.OrderItemsWhereInput;
    orderBy?: Prisma.OrderItemsOrderByWithRelationInput | Prisma.OrderItemsOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderItemsScalarFieldEnum | Prisma.OrderItemsScalarFieldEnum[];
};
export type OrderItemsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderItemsCreateInput, Prisma.OrderItemsUncheckedCreateInput>;
};
export type OrderItemsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrderItemsCreateManyInput | Prisma.OrderItemsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrderItemsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderItemsUpdateInput, Prisma.OrderItemsUncheckedUpdateInput>;
    where: Prisma.OrderItemsWhereUniqueInput;
};
export type OrderItemsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrderItemsUpdateManyMutationInput, Prisma.OrderItemsUncheckedUpdateManyInput>;
    where?: Prisma.OrderItemsWhereInput;
    limit?: number;
};
export type OrderItemsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
    where: Prisma.OrderItemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderItemsCreateInput, Prisma.OrderItemsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrderItemsUpdateInput, Prisma.OrderItemsUncheckedUpdateInput>;
};
export type OrderItemsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
    where: Prisma.OrderItemsWhereUniqueInput;
};
export type OrderItemsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemsWhereInput;
    limit?: number;
};
export type OrderItemsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemsSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemsOmit<ExtArgs> | null;
    include?: Prisma.OrderItemsInclude<ExtArgs> | null;
};
export {};
