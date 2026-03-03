import { PrismaService } from '../prisma.service';
import { LibreTranslateService } from '../translations/libretranslate.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    private readonly translateService;
    constructor(prisma: PrismaService, translateService: LibreTranslateService);
    private normalizeLanguage;
    findAll(language?: string): Promise<{
        categoryLabel: string;
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }[]>;
    create(createProductDto: CreateProductDto): Promise<{
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }>;
    findOne(id: number, language?: string): Promise<{
        categoryLabel: string;
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    } | null>;
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
