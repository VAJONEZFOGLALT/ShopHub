"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        try {
            return await this.prisma.products.findMany();
        }
        catch (error) {
            console.error('Products findAll error:', error);
            throw new common_1.BadRequestException(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async create(createProductDto) {
        try {
            return await this.prisma.products.create({ data: createProductDto });
        }
        catch (error) {
            console.error('Products create error:', error);
            throw new common_1.BadRequestException(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async findOne(id) {
        try {
            return await this.prisma.products.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Products findOne error:', error);
            throw new common_1.BadRequestException(`Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async update(id, updateProductDto) {
        try {
            return await this.prisma.products.update({ where: { id }, data: updateProductDto });
        }
        catch (error) {
            console.error('Products update error:', error);
            throw new common_1.BadRequestException(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.products.delete({ where: { id } });
        }
        catch (error) {
            console.error('Products remove error:', error);
            throw new common_1.BadRequestException(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map