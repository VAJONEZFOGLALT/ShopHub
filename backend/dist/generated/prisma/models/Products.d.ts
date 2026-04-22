import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProductsModel = runtime.Types.Result.DefaultSelection<Prisma.$ProductsPayload>;
export type AggregateProducts = {
    _count: ProductsCountAggregateOutputType | null;
    _avg: ProductsAvgAggregateOutputType | null;
    _sum: ProductsSumAggregateOutputType | null;
    _min: ProductsMinAggregateOutputType | null;
    _max: ProductsMaxAggregateOutputType | null;
};
export type ProductsAvgAggregateOutputType = {
    id: number | null;
    price: number | null;
    stock: number | null;
};
export type ProductsSumAggregateOutputType = {
    id: number | null;
    price: number | null;
    stock: number | null;
};
export type ProductsMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    description: string | null;
    category: string | null;
    price: number | null;
    stock: number | null;
    image: string | null;
};
export type ProductsMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    description: string | null;
    category: string | null;
    price: number | null;
    stock: number | null;
    image: string | null;
};
export type ProductsCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    category: number;
    price: number;
    stock: number;
    image: number;
    _all: number;
};
export type ProductsAvgAggregateInputType = {
    id?: true;
    price?: true;
    stock?: true;
};
export type ProductsSumAggregateInputType = {
    id?: true;
    price?: true;
    stock?: true;
};
export type ProductsMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    category?: true;
    price?: true;
    stock?: true;
    image?: true;
};
export type ProductsMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    category?: true;
    price?: true;
    stock?: true;
    image?: true;
};
export type ProductsCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    category?: true;
    price?: true;
    stock?: true;
    image?: true;
    _all?: true;
};
export type ProductsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductsWhereInput;
    orderBy?: Prisma.ProductsOrderByWithRelationInput | Prisma.ProductsOrderByWithRelationInput[];
    cursor?: Prisma.ProductsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProductsCountAggregateInputType;
    _avg?: ProductsAvgAggregateInputType;
    _sum?: ProductsSumAggregateInputType;
    _min?: ProductsMinAggregateInputType;
    _max?: ProductsMaxAggregateInputType;
};
export type GetProductsAggregateType<T extends ProductsAggregateArgs> = {
    [P in keyof T & keyof AggregateProducts]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProducts[P]> : Prisma.GetScalarType<T[P], AggregateProducts[P]>;
};
export type ProductsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductsWhereInput;
    orderBy?: Prisma.ProductsOrderByWithAggregationInput | Prisma.ProductsOrderByWithAggregationInput[];
    by: Prisma.ProductsScalarFieldEnum[] | Prisma.ProductsScalarFieldEnum;
    having?: Prisma.ProductsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductsCountAggregateInputType | true;
    _avg?: ProductsAvgAggregateInputType;
    _sum?: ProductsSumAggregateInputType;
    _min?: ProductsMinAggregateInputType;
    _max?: ProductsMaxAggregateInputType;
};
export type ProductsGroupByOutputType = {
    id: number;
    name: string;
    description: string | null;
    category: string;
    price: number;
    stock: number;
    image: string | null;
    _count: ProductsCountAggregateOutputType | null;
    _avg: ProductsAvgAggregateOutputType | null;
    _sum: ProductsSumAggregateOutputType | null;
    _min: ProductsMinAggregateOutputType | null;
    _max: ProductsMaxAggregateOutputType | null;
};
type GetProductsGroupByPayload<T extends ProductsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProductsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProductsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProductsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProductsGroupByOutputType[P]>;
}>>;
export type ProductsWhereInput = {
    AND?: Prisma.ProductsWhereInput | Prisma.ProductsWhereInput[];
    OR?: Prisma.ProductsWhereInput[];
    NOT?: Prisma.ProductsWhereInput | Prisma.ProductsWhereInput[];
    id?: Prisma.IntFilter<"Products"> | number;
    name?: Prisma.StringFilter<"Products"> | string;
    description?: Prisma.StringNullableFilter<"Products"> | string | null;
    category?: Prisma.StringFilter<"Products"> | string;
    price?: Prisma.FloatFilter<"Products"> | number;
    stock?: Prisma.IntFilter<"Products"> | number;
    image?: Prisma.StringNullableFilter<"Products"> | string | null;
    orderItems?: Prisma.OrderItemsListRelationFilter;
};
export type ProductsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    category?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    orderItems?: Prisma.OrderItemsOrderByRelationAggregateInput;
    _relevance?: Prisma.ProductsOrderByRelevanceInput;
};
export type ProductsWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.ProductsWhereInput | Prisma.ProductsWhereInput[];
    OR?: Prisma.ProductsWhereInput[];
    NOT?: Prisma.ProductsWhereInput | Prisma.ProductsWhereInput[];
    name?: Prisma.StringFilter<"Products"> | string;
    description?: Prisma.StringNullableFilter<"Products"> | string | null;
    category?: Prisma.StringFilter<"Products"> | string;
    price?: Prisma.FloatFilter<"Products"> | number;
    stock?: Prisma.IntFilter<"Products"> | number;
    image?: Prisma.StringNullableFilter<"Products"> | string | null;
    orderItems?: Prisma.OrderItemsListRelationFilter;
}, "id">;
export type ProductsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    category?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ProductsCountOrderByAggregateInput;
    _avg?: Prisma.ProductsAvgOrderByAggregateInput;
    _max?: Prisma.ProductsMaxOrderByAggregateInput;
    _min?: Prisma.ProductsMinOrderByAggregateInput;
    _sum?: Prisma.ProductsSumOrderByAggregateInput;
};
export type ProductsScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProductsScalarWhereWithAggregatesInput | Prisma.ProductsScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProductsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProductsScalarWhereWithAggregatesInput | Prisma.ProductsScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Products"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Products"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Products"> | string | null;
    category?: Prisma.StringWithAggregatesFilter<"Products"> | string;
    price?: Prisma.FloatWithAggregatesFilter<"Products"> | number;
    stock?: Prisma.IntWithAggregatesFilter<"Products"> | number;
    image?: Prisma.StringNullableWithAggregatesFilter<"Products"> | string | null;
};
export type ProductsCreateInput = {
    name: string;
    description?: string | null;
    category: string;
    price: number;
    stock?: number;
    image?: string | null;
    orderItems?: Prisma.OrderItemsCreateNestedManyWithoutProductInput;
};
export type ProductsUncheckedCreateInput = {
    id?: number;
    name: string;
    description?: string | null;
    category: string;
    price: number;
    stock?: number;
    image?: string | null;
    orderItems?: Prisma.OrderItemsUncheckedCreateNestedManyWithoutProductInput;
};
export type ProductsUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderItems?: Prisma.OrderItemsUpdateManyWithoutProductNestedInput;
};
export type ProductsUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderItems?: Prisma.OrderItemsUncheckedUpdateManyWithoutProductNestedInput;
};
export type ProductsCreateManyInput = {
    id?: number;
    name: string;
    description?: string | null;
    category: string;
    price: number;
    stock?: number;
    image?: string | null;
};
export type ProductsUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProductsUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProductsOrderByRelevanceInput = {
    fields: Prisma.ProductsOrderByRelevanceFieldEnum | Prisma.ProductsOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type ProductsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
};
export type ProductsAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
};
export type ProductsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
};
export type ProductsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
};
export type ProductsSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
};
export type ProductsScalarRelationFilter = {
    is?: Prisma.ProductsWhereInput;
    isNot?: Prisma.ProductsWhereInput;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type ProductsCreateNestedOneWithoutOrderItemsInput = {
    create?: Prisma.XOR<Prisma.ProductsCreateWithoutOrderItemsInput, Prisma.ProductsUncheckedCreateWithoutOrderItemsInput>;
    connectOrCreate?: Prisma.ProductsCreateOrConnectWithoutOrderItemsInput;
    connect?: Prisma.ProductsWhereUniqueInput;
};
export type ProductsUpdateOneRequiredWithoutOrderItemsNestedInput = {
    create?: Prisma.XOR<Prisma.ProductsCreateWithoutOrderItemsInput, Prisma.ProductsUncheckedCreateWithoutOrderItemsInput>;
    connectOrCreate?: Prisma.ProductsCreateOrConnectWithoutOrderItemsInput;
    upsert?: Prisma.ProductsUpsertWithoutOrderItemsInput;
    connect?: Prisma.ProductsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProductsUpdateToOneWithWhereWithoutOrderItemsInput, Prisma.ProductsUpdateWithoutOrderItemsInput>, Prisma.ProductsUncheckedUpdateWithoutOrderItemsInput>;
};
export type ProductsCreateWithoutOrderItemsInput = {
    name: string;
    description?: string | null;
    category: string;
    price: number;
    stock?: number;
    image?: string | null;
};
export type ProductsUncheckedCreateWithoutOrderItemsInput = {
    id?: number;
    name: string;
    description?: string | null;
    category: string;
    price: number;
    stock?: number;
    image?: string | null;
};
export type ProductsCreateOrConnectWithoutOrderItemsInput = {
    where: Prisma.ProductsWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductsCreateWithoutOrderItemsInput, Prisma.ProductsUncheckedCreateWithoutOrderItemsInput>;
};
export type ProductsUpsertWithoutOrderItemsInput = {
    update: Prisma.XOR<Prisma.ProductsUpdateWithoutOrderItemsInput, Prisma.ProductsUncheckedUpdateWithoutOrderItemsInput>;
    create: Prisma.XOR<Prisma.ProductsCreateWithoutOrderItemsInput, Prisma.ProductsUncheckedCreateWithoutOrderItemsInput>;
    where?: Prisma.ProductsWhereInput;
};
export type ProductsUpdateToOneWithWhereWithoutOrderItemsInput = {
    where?: Prisma.ProductsWhereInput;
    data: Prisma.XOR<Prisma.ProductsUpdateWithoutOrderItemsInput, Prisma.ProductsUncheckedUpdateWithoutOrderItemsInput>;
};
export type ProductsUpdateWithoutOrderItemsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProductsUncheckedUpdateWithoutOrderItemsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProductsCountOutputType = {
    orderItems: number;
};
export type ProductsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orderItems?: boolean | ProductsCountOutputTypeCountOrderItemsArgs;
};
export type ProductsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsCountOutputTypeSelect<ExtArgs> | null;
};
export type ProductsCountOutputTypeCountOrderItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemsWhereInput;
};
export type ProductsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    category?: boolean;
    price?: boolean;
    stock?: boolean;
    image?: boolean;
    orderItems?: boolean | Prisma.Products$orderItemsArgs<ExtArgs>;
    _count?: boolean | Prisma.ProductsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["products"]>;
export type ProductsSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    category?: boolean;
    price?: boolean;
    stock?: boolean;
    image?: boolean;
};
export type ProductsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "description" | "category" | "price" | "stock" | "image", ExtArgs["result"]["products"]>;
export type ProductsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orderItems?: boolean | Prisma.Products$orderItemsArgs<ExtArgs>;
    _count?: boolean | Prisma.ProductsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $ProductsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Products";
    objects: {
        orderItems: Prisma.$OrderItemsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }, ExtArgs["result"]["products"]>;
    composites: {};
};
export type ProductsGetPayload<S extends boolean | null | undefined | ProductsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProductsPayload, S>;
export type ProductsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProductsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProductsCountAggregateInputType | true;
};
export interface ProductsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Products'];
        meta: {
            name: 'Products';
        };
    };
    findUnique<T extends ProductsFindUniqueArgs>(args: Prisma.SelectSubset<T, ProductsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProductsClient<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProductsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProductsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductsClient<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProductsFindFirstArgs>(args?: Prisma.SelectSubset<T, ProductsFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProductsClient<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProductsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProductsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductsClient<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProductsFindManyArgs>(args?: Prisma.SelectSubset<T, ProductsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProductsCreateArgs>(args: Prisma.SelectSubset<T, ProductsCreateArgs<ExtArgs>>): Prisma.Prisma__ProductsClient<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProductsCreateManyArgs>(args?: Prisma.SelectSubset<T, ProductsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends ProductsDeleteArgs>(args: Prisma.SelectSubset<T, ProductsDeleteArgs<ExtArgs>>): Prisma.Prisma__ProductsClient<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProductsUpdateArgs>(args: Prisma.SelectSubset<T, ProductsUpdateArgs<ExtArgs>>): Prisma.Prisma__ProductsClient<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProductsDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProductsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProductsUpdateManyArgs>(args: Prisma.SelectSubset<T, ProductsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends ProductsUpsertArgs>(args: Prisma.SelectSubset<T, ProductsUpsertArgs<ExtArgs>>): Prisma.Prisma__ProductsClient<runtime.Types.Result.GetResult<Prisma.$ProductsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProductsCountArgs>(args?: Prisma.Subset<T, ProductsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProductsCountAggregateOutputType> : number>;
    aggregate<T extends ProductsAggregateArgs>(args: Prisma.Subset<T, ProductsAggregateArgs>): Prisma.PrismaPromise<GetProductsAggregateType<T>>;
    groupBy<T extends ProductsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProductsGroupByArgs['orderBy'];
    } : {
        orderBy?: ProductsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProductsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProductsFieldRefs;
}
export interface Prisma__ProductsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    orderItems<T extends Prisma.Products$orderItemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Products$orderItemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProductsFieldRefs {
    readonly id: Prisma.FieldRef<"Products", 'Int'>;
    readonly name: Prisma.FieldRef<"Products", 'String'>;
    readonly description: Prisma.FieldRef<"Products", 'String'>;
    readonly category: Prisma.FieldRef<"Products", 'String'>;
    readonly price: Prisma.FieldRef<"Products", 'Float'>;
    readonly stock: Prisma.FieldRef<"Products", 'Int'>;
    readonly image: Prisma.FieldRef<"Products", 'String'>;
}
export type ProductsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
    where: Prisma.ProductsWhereUniqueInput;
};
export type ProductsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
    where: Prisma.ProductsWhereUniqueInput;
};
export type ProductsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
    where?: Prisma.ProductsWhereInput;
    orderBy?: Prisma.ProductsOrderByWithRelationInput | Prisma.ProductsOrderByWithRelationInput[];
    cursor?: Prisma.ProductsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
export type ProductsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
    where?: Prisma.ProductsWhereInput;
    orderBy?: Prisma.ProductsOrderByWithRelationInput | Prisma.ProductsOrderByWithRelationInput[];
    cursor?: Prisma.ProductsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
export type ProductsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
    where?: Prisma.ProductsWhereInput;
    orderBy?: Prisma.ProductsOrderByWithRelationInput | Prisma.ProductsOrderByWithRelationInput[];
    cursor?: Prisma.ProductsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
export type ProductsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductsCreateInput, Prisma.ProductsUncheckedCreateInput>;
};
export type ProductsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProductsCreateManyInput | Prisma.ProductsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProductsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductsUpdateInput, Prisma.ProductsUncheckedUpdateInput>;
    where: Prisma.ProductsWhereUniqueInput;
};
export type ProductsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProductsUpdateManyMutationInput, Prisma.ProductsUncheckedUpdateManyInput>;
    where?: Prisma.ProductsWhereInput;
    limit?: number;
};
export type ProductsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
    where: Prisma.ProductsWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductsCreateInput, Prisma.ProductsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProductsUpdateInput, Prisma.ProductsUncheckedUpdateInput>;
};
export type ProductsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
    where: Prisma.ProductsWhereUniqueInput;
};
export type ProductsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductsWhereInput;
    limit?: number;
};
export type Products$orderItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProductsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsSelect<ExtArgs> | null;
    omit?: Prisma.ProductsOmit<ExtArgs> | null;
    include?: Prisma.ProductsInclude<ExtArgs> | null;
};
export {};
