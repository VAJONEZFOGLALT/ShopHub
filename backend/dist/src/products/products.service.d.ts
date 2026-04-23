import { PrismaService } from '../prisma.service';
import { LibreTranslateService } from '../translations/libretranslate.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    private readonly translateService;
    private readonly listCache;
    private readonly itemCache;
    private readonly cacheTtlMs;
    private readonly categoryTranslationOverrides;
    private readonly productNameTranslationContext;
    private readonly productDescriptionTranslationContext;
    private readonly categoryTranslationContext;
    constructor(prisma: PrismaService, translateService: LibreTranslateService);
    private normalizeLanguage;
    private getFromCache;
    private setCache;
    private clearProductCaches;
    private resolveCategoryLabel;
    findAll(language?: string): Promise<any>;
    getFeaturedShowcase(language?: string): Promise<{
        categories: {
            key: string;
            label: string;
            viewsCount: number;
            productCount: number;
        }[];
        products: any[];
    }>;
    create(createProductDto: CreateProductDto): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ProductsPayload<ExtArgs>, T, "create", GlobalOmitOptions>>;
    findOne(id: number, language?: string): Promise<any>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ProductsPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    remove(id: number): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ProductsPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
}
