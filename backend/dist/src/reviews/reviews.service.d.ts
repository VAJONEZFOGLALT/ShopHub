import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): runtime.Types.Public.PrismaPromise<T>;
    findByProduct(productId: number): runtime.Types.Public.PrismaPromise<T>;
    findOne(id: number): import("../../generated/prisma/models").Prisma__ReviewsClient<any, null, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    getAverage(productId: number): Promise<{
        average: any;
        count: any;
    }>;
    create(data: CreateReviewDto): runtime.Types.Utils.JsPromise<R>;
    update(id: number, data: UpdateReviewDto): import("../../generated/prisma/models").Prisma__ReviewsClient<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ReviewsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(id: number): import("../../generated/prisma/models").Prisma__ReviewsClient<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ReviewsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
