import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findByProduct(productId: number): import("@prisma/client").Prisma.PrismaPromise<({
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
    getAverage(productId: number): Promise<{
        average: number;
        count: number;
    }>;
    create(data: CreateReviewDto): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
        rating: number;
        title: string;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateReviewDto): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
        rating: number;
        title: string;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__ReviewsClient<{
        id: number;
        userId: number;
        productId: number;
        createdAt: Date;
        rating: number;
        title: string;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
