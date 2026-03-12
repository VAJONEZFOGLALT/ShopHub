import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly cloudinaryService;
    constructor(productsService: ProductsService, cloudinaryService: CloudinaryService);
    create(createProductDto: CreateProductDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        deletedAt: Date | null;
    }>;
    findAll(lang?: string): Promise<any[]>;
    findOne(id: string, lang?: string): Promise<any>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        deletedAt: Date | null;
    }>;
    uploadImage(id: string, file: Express.Multer.File): Promise<{
        id: number;
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
        deletedAt: Date | null;
    }>;
}
