import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly cloudinaryService;
    constructor(productsService: ProductsService, cloudinaryService: CloudinaryService);
    create(createProductDto: CreateProductDto): import("../../generated/prisma/models").Prisma__ProductsClient<{
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findAll(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        id: number;
    }[]>;
    findOne(id: string): import("../../generated/prisma/models").Prisma__ProductsClient<{
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): import("../../generated/prisma/models").Prisma__ProductsClient<{
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    uploadImage(id: string, file: Express.Multer.File): Promise<{
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        id: number;
    }>;
    remove(id: string): import("../../generated/prisma/models").Prisma__ProductsClient<{
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
