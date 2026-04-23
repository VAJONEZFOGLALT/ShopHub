import { PrismaService } from '../prisma.service';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOne(id: number): import("../../generated/prisma/models").Prisma__WishlistClient<any, null, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findByUser(userId: number): runtime.Types.Public.PrismaPromise<T>;
    add(userId: number, productId: number): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$WishlistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>>;
    remove(id: number): import("../../generated/prisma/models").Prisma__WishlistClient<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$WishlistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    removeByUserProduct(userId: number, productId: number): Promise<any>;
    isInWishlist(userId: number, productId: number): Promise<boolean>;
}
