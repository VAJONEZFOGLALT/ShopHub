import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            username: string;
            email: string;
            name: string;
            role: string;
            avatar: string | null;
            password_hash: string;
            id: number;
        };
        product: {
            name: string;
            id: number;
            description: string | null;
            category: string;
            price: number;
            stock: number;
            image: string | null;
        };
    } & {
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
        rating: number;
        title: string;
        comment: string;
    })[]>;
    findByProduct(productId: string): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            username: string;
            email: string;
            name: string;
            role: string;
            avatar: string | null;
            password_hash: string;
            id: number;
        };
    } & {
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
        rating: number;
        title: string;
        comment: string;
    })[]>;
    getAverage(productId: string): Promise<{
        average: number;
        count: number;
    }>;
    create(body: CreateReviewDto): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
        rating: number;
        title: string;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: UpdateReviewDto): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
        rating: number;
        title: string;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
        rating: number;
        title: string;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
