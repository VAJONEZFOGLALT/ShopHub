import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly cloudinaryService;
    constructor(productsService: ProductsService, cloudinaryService: CloudinaryService);
    create(createProductDto: CreateProductDto): Promise<{
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }>;
    findAll(lang?: string): Promise<{
        categoryLabel: string;
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }[]>;
    findOne(id: string, lang?: string): Promise<{
        categoryLabel: string;
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    } | null>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }>;
    uploadImage(id: string, file: Express.Multer.File): Promise<{
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: number;
        description: string | null;
        category: string;
        price: number;
        stock: number;
        image: string | null;
    }>;
}
