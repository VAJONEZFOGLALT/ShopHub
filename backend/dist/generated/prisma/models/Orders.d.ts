import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type OrdersModel = runtime.Types.Result.DefaultSelection<Prisma.$OrdersPayload>;
export type AggregateOrders = {
    _count: OrdersCountAggregateOutputType | null;
    _avg: OrdersAvgAggregateOutputType | null;
    _sum: OrdersSumAggregateOutputType | null;
    _min: OrdersMinAggregateOutputType | null;
    _max: OrdersMaxAggregateOutputType | null;
};
export type OrdersAvgAggregateOutputType = {
    id: number | null;
    userId: number | null;
    totalPrice: number | null;
};
export type OrdersSumAggregateOutputType = {
    id: number | null;
    userId: number | null;
    totalPrice: number | null;
};
export type OrdersMinAggregateOutputType = {
    id: number | null;
    userId: number | null;
    totalPrice: number | null;
    createdAt: Date | null;
    status: boolean | null;
};
export type OrdersMaxAggregateOutputType = {
    id: number | null;
    userId: number | null;
    totalPrice: number | null;
    createdAt: Date | null;
    status: boolean | null;
};
export type OrdersCountAggregateOutputType = {
    id: number;
    userId: number;
    totalPrice: number;
    createdAt: number;
    status: number;
    _all: number;
};
export type OrdersAvgAggregateInputType = {
    id?: true;
    userId?: true;
    totalPrice?: true;
};
export type OrdersSumAggregateInputType = {
    id?: true;
    userId?: true;
    totalPrice?: true;
};
export type OrdersMinAggregateInputType = {
    id?: true;
    userId?: true;
    totalPrice?: true;
    createdAt?: true;
    status?: true;
};
export type OrdersMaxAggregateInputType = {
    id?: true;
    userId?: true;
    totalPrice?: true;
    createdAt?: true;
    status?: true;
};
export type OrdersCountAggregateInputType = {
    id?: true;
    userId?: true;
    totalPrice?: true;
    createdAt?: true;
    status?: true;
    _all?: true;
};
export type OrdersAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrdersWhereInput;
    orderBy?: Prisma.OrdersOrderByWithRelationInput | Prisma.OrdersOrderByWithRelationInput[];
    cursor?: Prisma.OrdersWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrdersCountAggregateInputType;
    _avg?: OrdersAvgAggregateInputType;
    _sum?: OrdersSumAggregateInputType;
    _min?: OrdersMinAggregateInputType;
    _max?: OrdersMaxAggregateInputType;
};
export type GetOrdersAggregateType<T extends OrdersAggregateArgs> = {
    [P in keyof T & keyof AggregateOrders]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrders[P]> : Prisma.GetScalarType<T[P], AggregateOrders[P]>;
};
export type OrdersGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrdersWhereInput;
    orderBy?: Prisma.OrdersOrderByWithAggregationInput | Prisma.OrdersOrderByWithAggregationInput[];
    by: Prisma.OrdersScalarFieldEnum[] | Prisma.OrdersScalarFieldEnum;
    having?: Prisma.OrdersScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrdersCountAggregateInputType | true;
    _avg?: OrdersAvgAggregateInputType;
    _sum?: OrdersSumAggregateInputType;
    _min?: OrdersMinAggregateInputType;
    _max?: OrdersMaxAggregateInputType;
};
export type OrdersGroupByOutputType = {
    id: number;
    userId: number;
    totalPrice: number;
    createdAt: Date;
    status: boolean;
    _count: OrdersCountAggregateOutputType | null;
    _avg: OrdersAvgAggregateOutputType | null;
    _sum: OrdersSumAggregateOutputType | null;
    _min: OrdersMinAggregateOutputType | null;
    _max: OrdersMaxAggregateOutputType | null;
};
type GetOrdersGroupByPayload<T extends OrdersGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrdersGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrdersGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrdersGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrdersGroupByOutputType[P]>;
}>>;
export type OrdersWhereInput = {
    AND?: Prisma.OrdersWhereInput | Prisma.OrdersWhereInput[];
    OR?: Prisma.OrdersWhereInput[];
    NOT?: Prisma.OrdersWhereInput | Prisma.OrdersWhereInput[];
    id?: Prisma.IntFilter<"Orders"> | number;
    userId?: Prisma.IntFilter<"Orders"> | number;
    totalPrice?: Prisma.FloatFilter<"Orders"> | number;
    createdAt?: Prisma.DateTimeFilter<"Orders"> | Date | string;
    status?: Prisma.BoolFilter<"Orders"> | boolean;
    user?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.UsersWhereInput>;
    orderItems?: Prisma.OrderItemsListRelationFilter;
};
export type OrdersOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    totalPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    user?: Prisma.UsersOrderByWithRelationInput;
    orderItems?: Prisma.OrderItemsOrderByRelationAggregateInput;
};
export type OrdersWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.OrdersWhereInput | Prisma.OrdersWhereInput[];
    OR?: Prisma.OrdersWhereInput[];
    NOT?: Prisma.OrdersWhereInput | Prisma.OrdersWhereInput[];
    userId?: Prisma.IntFilter<"Orders"> | number;
    totalPrice?: Prisma.FloatFilter<"Orders"> | number;
    createdAt?: Prisma.DateTimeFilter<"Orders"> | Date | string;
    status?: Prisma.BoolFilter<"Orders"> | boolean;
    user?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.UsersWhereInput>;
    orderItems?: Prisma.OrderItemsListRelationFilter;
}, "id">;
export type OrdersOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    totalPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    _count?: Prisma.OrdersCountOrderByAggregateInput;
    _avg?: Prisma.OrdersAvgOrderByAggregateInput;
    _max?: Prisma.OrdersMaxOrderByAggregateInput;
    _min?: Prisma.OrdersMinOrderByAggregateInput;
    _sum?: Prisma.OrdersSumOrderByAggregateInput;
};
export type OrdersScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrdersScalarWhereWithAggregatesInput | Prisma.OrdersScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrdersScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrdersScalarWhereWithAggregatesInput | Prisma.OrdersScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Orders"> | number;
    userId?: Prisma.IntWithAggregatesFilter<"Orders"> | number;
    totalPrice?: Prisma.FloatWithAggregatesFilter<"Orders"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Orders"> | Date | string;
    status?: Prisma.BoolWithAggregatesFilter<"Orders"> | boolean;
};
export type OrdersCreateInput = {
    totalPrice: number;
    createdAt?: Date | string;
    status?: boolean;
    user: Prisma.UsersCreateNestedOneWithoutOrdersInput;
    orderItems?: Prisma.OrderItemsCreateNestedManyWithoutOrderInput;
};
export type OrdersUncheckedCreateInput = {
    id?: number;
    userId: number;
    totalPrice: number;
    createdAt?: Date | string;
    status?: boolean;
    orderItems?: Prisma.OrderItemsUncheckedCreateNestedManyWithoutOrderInput;
};
export type OrdersUpdateInput = {
    totalPrice?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    user?: Prisma.UsersUpdateOneRequiredWithoutOrdersNestedInput;
    orderItems?: Prisma.OrderItemsUpdateManyWithoutOrderNestedInput;
};
export type OrdersUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    totalPrice?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    orderItems?: Prisma.OrderItemsUncheckedUpdateManyWithoutOrderNestedInput;
};
export type OrdersCreateManyInput = {
    id?: number;
    userId: number;
    totalPrice: number;
    createdAt?: Date | string;
    status?: boolean;
};
export type OrdersUpdateManyMutationInput = {
    totalPrice?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type OrdersUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    totalPrice?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type OrdersListRelationFilter = {
    every?: Prisma.OrdersWhereInput;
    some?: Prisma.OrdersWhereInput;
    none?: Prisma.OrdersWhereInput;
};
export type OrdersOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OrdersCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    totalPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type OrdersAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    totalPrice?: Prisma.SortOrder;
};
export type OrdersMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    totalPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type OrdersMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    totalPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type OrdersSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    totalPrice?: Prisma.SortOrder;
};
export type OrdersScalarRelationFilter = {
    is?: Prisma.OrdersWhereInput;
    isNot?: Prisma.OrdersWhereInput;
};
export type OrdersCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.OrdersCreateWithoutUserInput, Prisma.OrdersUncheckedCreateWithoutUserInput> | Prisma.OrdersCreateWithoutUserInput[] | Prisma.OrdersUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrdersCreateOrConnectWithoutUserInput | Prisma.OrdersCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.OrdersCreateManyUserInputEnvelope;
    connect?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
};
export type OrdersUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.OrdersCreateWithoutUserInput, Prisma.OrdersUncheckedCreateWithoutUserInput> | Prisma.OrdersCreateWithoutUserInput[] | Prisma.OrdersUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrdersCreateOrConnectWithoutUserInput | Prisma.OrdersCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.OrdersCreateManyUserInputEnvelope;
    connect?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
};
export type OrdersUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.OrdersCreateWithoutUserInput, Prisma.OrdersUncheckedCreateWithoutUserInput> | Prisma.OrdersCreateWithoutUserInput[] | Prisma.OrdersUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrdersCreateOrConnectWithoutUserInput | Prisma.OrdersCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.OrdersUpsertWithWhereUniqueWithoutUserInput | Prisma.OrdersUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.OrdersCreateManyUserInputEnvelope;
    set?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
    disconnect?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
    delete?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
    connect?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
    update?: Prisma.OrdersUpdateWithWhereUniqueWithoutUserInput | Prisma.OrdersUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.OrdersUpdateManyWithWhereWithoutUserInput | Prisma.OrdersUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.OrdersScalarWhereInput | Prisma.OrdersScalarWhereInput[];
};
export type OrdersUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.OrdersCreateWithoutUserInput, Prisma.OrdersUncheckedCreateWithoutUserInput> | Prisma.OrdersCreateWithoutUserInput[] | Prisma.OrdersUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrdersCreateOrConnectWithoutUserInput | Prisma.OrdersCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.OrdersUpsertWithWhereUniqueWithoutUserInput | Prisma.OrdersUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.OrdersCreateManyUserInputEnvelope;
    set?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
    disconnect?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
    delete?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
    connect?: Prisma.OrdersWhereUniqueInput | Prisma.OrdersWhereUniqueInput[];
    update?: Prisma.OrdersUpdateWithWhereUniqueWithoutUserInput | Prisma.OrdersUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.OrdersUpdateManyWithWhereWithoutUserInput | Prisma.OrdersUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.OrdersScalarWhereInput | Prisma.OrdersScalarWhereInput[];
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type OrdersCreateNestedOneWithoutOrderItemsInput = {
    create?: Prisma.XOR<Prisma.OrdersCreateWithoutOrderItemsInput, Prisma.OrdersUncheckedCreateWithoutOrderItemsInput>;
    connectOrCreate?: Prisma.OrdersCreateOrConnectWithoutOrderItemsInput;
    connect?: Prisma.OrdersWhereUniqueInput;
};
export type OrdersUpdateOneRequiredWithoutOrderItemsNestedInput = {
    create?: Prisma.XOR<Prisma.OrdersCreateWithoutOrderItemsInput, Prisma.OrdersUncheckedCreateWithoutOrderItemsInput>;
    connectOrCreate?: Prisma.OrdersCreateOrConnectWithoutOrderItemsInput;
    upsert?: Prisma.OrdersUpsertWithoutOrderItemsInput;
    connect?: Prisma.OrdersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrdersUpdateToOneWithWhereWithoutOrderItemsInput, Prisma.OrdersUpdateWithoutOrderItemsInput>, Prisma.OrdersUncheckedUpdateWithoutOrderItemsInput>;
};
export type OrdersCreateWithoutUserInput = {
    totalPrice: number;
    createdAt?: Date | string;
    status?: boolean;
    orderItems?: Prisma.OrderItemsCreateNestedManyWithoutOrderInput;
};
export type OrdersUncheckedCreateWithoutUserInput = {
    id?: number;
    totalPrice: number;
    createdAt?: Date | string;
    status?: boolean;
    orderItems?: Prisma.OrderItemsUncheckedCreateNestedManyWithoutOrderInput;
};
export type OrdersCreateOrConnectWithoutUserInput = {
    where: Prisma.OrdersWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrdersCreateWithoutUserInput, Prisma.OrdersUncheckedCreateWithoutUserInput>;
};
export type OrdersCreateManyUserInputEnvelope = {
    data: Prisma.OrdersCreateManyUserInput | Prisma.OrdersCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type OrdersUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.OrdersWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrdersUpdateWithoutUserInput, Prisma.OrdersUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.OrdersCreateWithoutUserInput, Prisma.OrdersUncheckedCreateWithoutUserInput>;
};
export type OrdersUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.OrdersWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrdersUpdateWithoutUserInput, Prisma.OrdersUncheckedUpdateWithoutUserInput>;
};
export type OrdersUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.OrdersScalarWhereInput;
    data: Prisma.XOR<Prisma.OrdersUpdateManyMutationInput, Prisma.OrdersUncheckedUpdateManyWithoutUserInput>;
};
export type OrdersScalarWhereInput = {
    AND?: Prisma.OrdersScalarWhereInput | Prisma.OrdersScalarWhereInput[];
    OR?: Prisma.OrdersScalarWhereInput[];
    NOT?: Prisma.OrdersScalarWhereInput | Prisma.OrdersScalarWhereInput[];
    id?: Prisma.IntFilter<"Orders"> | number;
    userId?: Prisma.IntFilter<"Orders"> | number;
    totalPrice?: Prisma.FloatFilter<"Orders"> | number;
    createdAt?: Prisma.DateTimeFilter<"Orders"> | Date | string;
    status?: Prisma.BoolFilter<"Orders"> | boolean;
};
export type OrdersCreateWithoutOrderItemsInput = {
    totalPrice: number;
    createdAt?: Date | string;
    status?: boolean;
    user: Prisma.UsersCreateNestedOneWithoutOrdersInput;
};
export type OrdersUncheckedCreateWithoutOrderItemsInput = {
    id?: number;
    userId: number;
    totalPrice: number;
    createdAt?: Date | string;
    status?: boolean;
};
export type OrdersCreateOrConnectWithoutOrderItemsInput = {
    where: Prisma.OrdersWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrdersCreateWithoutOrderItemsInput, Prisma.OrdersUncheckedCreateWithoutOrderItemsInput>;
};
export type OrdersUpsertWithoutOrderItemsInput = {
    update: Prisma.XOR<Prisma.OrdersUpdateWithoutOrderItemsInput, Prisma.OrdersUncheckedUpdateWithoutOrderItemsInput>;
    create: Prisma.XOR<Prisma.OrdersCreateWithoutOrderItemsInput, Prisma.OrdersUncheckedCreateWithoutOrderItemsInput>;
    where?: Prisma.OrdersWhereInput;
};
export type OrdersUpdateToOneWithWhereWithoutOrderItemsInput = {
    where?: Prisma.OrdersWhereInput;
    data: Prisma.XOR<Prisma.OrdersUpdateWithoutOrderItemsInput, Prisma.OrdersUncheckedUpdateWithoutOrderItemsInput>;
};
export type OrdersUpdateWithoutOrderItemsInput = {
    totalPrice?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    user?: Prisma.UsersUpdateOneRequiredWithoutOrdersNestedInput;
};
export type OrdersUncheckedUpdateWithoutOrderItemsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    totalPrice?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type OrdersCreateManyUserInput = {
    id?: number;
    totalPrice: number;
    createdAt?: Date | string;
    status?: boolean;
};
export type OrdersUpdateWithoutUserInput = {
    totalPrice?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    orderItems?: Prisma.OrderItemsUpdateManyWithoutOrderNestedInput;
};
export type OrdersUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    totalPrice?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    orderItems?: Prisma.OrderItemsUncheckedUpdateManyWithoutOrderNestedInput;
};
export type OrdersUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    totalPrice?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type OrdersCountOutputType = {
    orderItems: number;
};
export type OrdersCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orderItems?: boolean | OrdersCountOutputTypeCountOrderItemsArgs;
};
export type OrdersCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrdersCountOutputTypeSelect<ExtArgs> | null;
};
export type OrdersCountOutputTypeCountOrderItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemsWhereInput;
};
export type OrdersSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    totalPrice?: boolean;
    createdAt?: boolean;
    status?: boolean;
    user?: boolean | Prisma.UsersDefaultArgs<ExtArgs>;
    orderItems?: boolean | Prisma.Orders$orderItemsArgs<ExtArgs>;
    _count?: boolean | Prisma.OrdersCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orders"]>;
export type OrdersSelectScalar = {
    id?: boolean;
    userId?: boolean;
    totalPrice?: boolean;
    createdAt?: boolean;
    status?: boolean;
};
export type OrdersOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "totalPrice" | "createdAt" | "status", ExtArgs["result"]["orders"]>;
export type OrdersInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UsersDefaultArgs<ExtArgs>;
    orderItems?: boolean | Prisma.Orders$orderItemsArgs<ExtArgs>;
    _count?: boolean | Prisma.OrdersCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $OrdersPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Orders";
    objects: {
        user: Prisma.$UsersPayload<ExtArgs>;
        orderItems: Prisma.$OrderItemsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        userId: number;
        totalPrice: number;
        createdAt: Date;
        status: boolean;
    }, ExtArgs["result"]["orders"]>;
    composites: {};
};
export type OrdersGetPayload<S extends boolean | null | undefined | OrdersDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrdersPayload, S>;
export type OrdersCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrdersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrdersCountAggregateInputType | true;
};
export interface OrdersDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Orders'];
        meta: {
            name: 'Orders';
        };
    };
    findUnique<T extends OrdersFindUniqueArgs>(args: Prisma.SelectSubset<T, OrdersFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrdersClient<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrdersFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrdersFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrdersClient<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrdersFindFirstArgs>(args?: Prisma.SelectSubset<T, OrdersFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrdersClient<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrdersFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrdersFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrdersClient<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrdersFindManyArgs>(args?: Prisma.SelectSubset<T, OrdersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrdersCreateArgs>(args: Prisma.SelectSubset<T, OrdersCreateArgs<ExtArgs>>): Prisma.Prisma__OrdersClient<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrdersCreateManyArgs>(args?: Prisma.SelectSubset<T, OrdersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends OrdersDeleteArgs>(args: Prisma.SelectSubset<T, OrdersDeleteArgs<ExtArgs>>): Prisma.Prisma__OrdersClient<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrdersUpdateArgs>(args: Prisma.SelectSubset<T, OrdersUpdateArgs<ExtArgs>>): Prisma.Prisma__OrdersClient<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrdersDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrdersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrdersUpdateManyArgs>(args: Prisma.SelectSubset<T, OrdersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends OrdersUpsertArgs>(args: Prisma.SelectSubset<T, OrdersUpsertArgs<ExtArgs>>): Prisma.Prisma__OrdersClient<runtime.Types.Result.GetResult<Prisma.$OrdersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrdersCountArgs>(args?: Prisma.Subset<T, OrdersCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrdersCountAggregateOutputType> : number>;
    aggregate<T extends OrdersAggregateArgs>(args: Prisma.Subset<T, OrdersAggregateArgs>): Prisma.PrismaPromise<GetOrdersAggregateType<T>>;
    groupBy<T extends OrdersGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrdersGroupByArgs['orderBy'];
    } : {
        orderBy?: OrdersGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrdersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrdersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrdersFieldRefs;
}
export interface Prisma__OrdersClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UsersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UsersDefaultArgs<ExtArgs>>): Prisma.Prisma__UsersClient<runtime.Types.Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    orderItems<T extends Prisma.Orders$orderItemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Orders$orderItemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrdersFieldRefs {
    readonly id: Prisma.FieldRef<"Orders", 'Int'>;
    readonly userId: Prisma.FieldRef<"Orders", 'Int'>;
    readonly totalPrice: Prisma.FieldRef<"Orders", 'Float'>;
    readonly createdAt: Prisma.FieldRef<"Orders", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Orders", 'Boolean'>;
}
export type OrdersFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrdersSelect<ExtArgs> | null;
    omit?: Prisma.OrdersOmit<ExtArgs> | null;
    include?: Prisma.OrdersInclude<ExtArgs> | null;
    where: Prisma.OrdersWhereUniqueInput;
};
export type OrdersFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrdersSelect<ExtArgs> | null;
    omit?: Prisma.OrdersOmit<ExtArgs> | null;
    include?: Prisma.OrdersInclude<ExtArgs> | null;
    where: Prisma.OrdersWhereUniqueInput;
};
export type OrdersFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrdersFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrdersFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrdersCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrdersSelect<ExtArgs> | null;
    omit?: Prisma.OrdersOmit<ExtArgs> | null;
    include?: Prisma.OrdersInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrdersCreateInput, Prisma.OrdersUncheckedCreateInput>;
};
export type OrdersCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrdersCreateManyInput | Prisma.OrdersCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrdersUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrdersSelect<ExtArgs> | null;
    omit?: Prisma.OrdersOmit<ExtArgs> | null;
    include?: Prisma.OrdersInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrdersUpdateInput, Prisma.OrdersUncheckedUpdateInput>;
    where: Prisma.OrdersWhereUniqueInput;
};
export type OrdersUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrdersUpdateManyMutationInput, Prisma.OrdersUncheckedUpdateManyInput>;
    where?: Prisma.OrdersWhereInput;
    limit?: number;
};
export type OrdersUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrdersSelect<ExtArgs> | null;
    omit?: Prisma.OrdersOmit<ExtArgs> | null;
    include?: Prisma.OrdersInclude<ExtArgs> | null;
    where: Prisma.OrdersWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrdersCreateInput, Prisma.OrdersUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrdersUpdateInput, Prisma.OrdersUncheckedUpdateInput>;
};
export type OrdersDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrdersSelect<ExtArgs> | null;
    omit?: Prisma.OrdersOmit<ExtArgs> | null;
    include?: Prisma.OrdersInclude<ExtArgs> | null;
    where: Prisma.OrdersWhereUniqueInput;
};
export type OrdersDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrdersWhereInput;
    limit?: number;
};
export type Orders$orderItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrdersDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrdersSelect<ExtArgs> | null;
    omit?: Prisma.OrdersOmit<ExtArgs> | null;
    include?: Prisma.OrdersInclude<ExtArgs> | null;
};
export {};
