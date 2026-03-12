import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    findByUser(userId: string): import("@prisma/client").Prisma.PrismaPromise<({
        product: {
            id: number;
            name: string;
            description: string | null;
            category: string;
            price: number;
            stock: number;
            image: string | null;
            deletedAt: Date | null;
        };
    } & {
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
    })[]>;
    add(body: {
        userId: number;
        productId: number;
    }): Promise<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
    }>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__WishlistClient<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    removeByUserProduct(userId: string, productId: string): Promise<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
    } | null>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
}
