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
    constructor(prisma: PrismaService, translateService: LibreTranslateService);
    private normalizeLanguage;
    private getFromCache;
    private setCache;
    private clearProductCaches;
    findAll(language?: string): Promise<any[]>;
    create(createProductDto: CreateProductDto): Promise<{
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }>;
    findOne(id: number, language?: string): Promise<any>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<{
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }>;
    remove(id: number): Promise<{
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }>;
}
