import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    private isAdmin;
    private assertSelfOrAdmin;
    findAll(): runtime.Types.Public.PrismaPromise<T>;
    findByProduct(productId: string): runtime.Types.Public.PrismaPromise<T>;
    getAverage(productId: string): Promise<{
        average: any;
        count: any;
    }>;
    create(body: CreateReviewDto, req: any): runtime.Types.Utils.JsPromise<R>;
    update(id: string, body: UpdateReviewDto, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ReviewsPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    remove(id: string, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ReviewsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>>;
}
