import { PrismaService } from '../prisma.service';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUser(userId: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    add(userId: number, productId: number): Promise<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
    }>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__WishlistClient<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    removeByUserProduct(userId: number, productId: number): Promise<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
    } | null>;
    isInWishlist(userId: number, productId: number): Promise<boolean>;
}
