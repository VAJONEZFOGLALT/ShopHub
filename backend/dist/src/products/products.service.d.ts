import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
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
    findOne(id: number): Promise<{
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
