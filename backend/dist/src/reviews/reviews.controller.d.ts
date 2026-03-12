import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
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
            deletedAt: Date | null;
        };
    } & {
        id: number;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
        createdAt: Date;
    })[]>;
    findByProduct(productId: string): import("@prisma/client").Prisma.PrismaPromise<({
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
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
        createdAt: Date;
    })[]>;
    getAverage(productId: string): Promise<{
        average: number;
        count: number;
    }>;
    create(body: CreateReviewDto): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: UpdateReviewDto): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
