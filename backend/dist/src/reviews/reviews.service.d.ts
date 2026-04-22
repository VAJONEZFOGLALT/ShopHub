import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findByProduct(productId: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    getAverage(productId: number): Promise<{
        average: number;
        count: number;
    }>;
    create(data: CreateReviewDto): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateReviewDto): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        rating: number;
        title: string;
        comment: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
