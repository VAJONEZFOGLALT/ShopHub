import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly cloudinaryService;
    constructor(productsService: ProductsService, cloudinaryService: CloudinaryService);
    private assertAdmin;
    create(createProductDto: CreateProductDto, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ProductsPayload<ExtArgs>, T, "create", GlobalOmitOptions>>;
    findAll(lang?: string): Promise<any>;
    getFeatured(lang?: string): Promise<{
        categories: {
            key: string;
            label: string;
            viewsCount: number;
            productCount: number;
        }[];
        products: any[];
    }>;
    findOne(id: string, lang?: string): Promise<any>;
    update(id: string, updateProductDto: UpdateProductDto, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ProductsPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    uploadImage(id: string, file: Express.Multer.File, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ProductsPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    remove(id: string, req: any): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$ProductsPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
}
