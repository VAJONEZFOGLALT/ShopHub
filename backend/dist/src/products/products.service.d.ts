import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): import("../../generated/prisma/models").Prisma__ProductsClient<{
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
    update(id: number, updateProductDto: UpdateProductDto): import("../../generated/prisma/models").Prisma__ProductsClient<{
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
    remove(id: number): import("../../generated/prisma/models").Prisma__ProductsClient<{
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
