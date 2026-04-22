import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        user: {
            id: number;
            username: string;
            email: string;
            password_hash: string;
            name: string;
            avatar: string | null;
            role: string;
        };
        product: {
            id: number;
            name: string;
            description: string | null;
            category: string;
            price: number;
            stock: number;
            image: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
    })[]>;
    findByProduct(productId: number): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        user: {
            id: number;
            username: string;
            email: string;
            password_hash: string;
            name: string;
            avatar: string | null;
            role: string;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
    })[]>;
    getAverage(productId: number): Promise<{
        average: number;
        count: number;
    }>;
    create(data: CreateReviewDto): import("../../generated/prisma/models").Prisma__ReviewsClient<{
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: number, data: UpdateReviewDto): import("../../generated/prisma/models").Prisma__ReviewsClient<{
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(id: number): import("../../generated/prisma/models").Prisma__ReviewsClient<{
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
