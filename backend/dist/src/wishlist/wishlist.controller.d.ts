import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    private isAdmin;
    private assertSelfOrAdmin;
    findByUser(userId: string, req: any): runtime.Types.Public.PrismaPromise<T>;
    add(body: {
        userId: number;
        productId: number;
    }, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$WishlistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>>;
    remove(id: string, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$WishlistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>>;
    removeByUserProduct(userId: string, productId: string, req: any): Promise<any>;
    isInWishlist(userId: string, productId: string, req: any): Promise<boolean>;
}
