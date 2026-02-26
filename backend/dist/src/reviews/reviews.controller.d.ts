import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
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
    findByProduct(productId: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    getAverage(productId: string): Promise<{
        average: number;
        count: number;
    }>;
    create(body: CreateReviewDto): import("../../generated/prisma/models").Prisma__ReviewsClient<{
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
    update(id: string, body: UpdateReviewDto): import("../../generated/prisma/models").Prisma__ReviewsClient<{
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
    remove(id: string): import("../../generated/prisma/models").Prisma__ReviewsClient<{
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
