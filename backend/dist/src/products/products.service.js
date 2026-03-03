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
const libretranslate_service_1 = require("../translations/libretranslate.service");
let ProductsService = class ProductsService {
    prisma;
    translateService;
    constructor(prisma, translateService) {
        this.prisma = prisma;
        this.translateService = translateService;
    }
    normalizeLanguage(lang) {
        return lang.toLowerCase().split('-')[0];
    }
    async findAll(language) {
        try {
            const products = await this.prisma.products.findMany();
            if (!language || this.normalizeLanguage(language) === 'hu') {
                return products.map((product) => ({
                    ...product,
                    categoryLabel: product.category,
                }));
            }
            const normalizedLang = this.normalizeLanguage(language);
            const names = products.map((p) => p.name || '');
            const descriptions = products.map((p) => p.description || '');
            const categories = products.map((p) => p.category || '');
            const [translatedNames, translatedDescriptions, translatedCategories] = await Promise.all([
                this.translateService.translateBatch(names, 'hu', normalizedLang),
                this.translateService.translateBatch(descriptions, 'hu', normalizedLang),
                this.translateService.translateBatch(categories, 'hu', normalizedLang),
            ]);
            return products.map((product, index) => ({
                ...product,
                name: translatedNames[index] || product.name,
                description: translatedDescriptions[index] || product.description,
                category: product.category,
                categoryLabel: translatedCategories[index] || product.category,
            }));
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
    async findOne(id, language) {
        try {
            const product = await this.prisma.products.findUnique({ where: { id } });
            if (!product) {
                return null;
            }
            if (!language || this.normalizeLanguage(language) === 'hu') {
                return {
                    ...product,
                    categoryLabel: product.category,
                };
            }
            const normalizedLang = this.normalizeLanguage(language);
            const [translatedName, translatedDescription, translatedCategory] = await Promise.all([
                this.translateService.translate(product.name || '', 'hu', normalizedLang),
                this.translateService.translate(product.description || '', 'hu', normalizedLang),
                this.translateService.translate(product.category || '', 'hu', normalizedLang),
            ]);
            return {
                ...product,
                name: translatedName.translatedText || product.name,
                description: translatedDescription.translatedText || product.description,
                category: product.category,
                categoryLabel: translatedCategory.translatedText || product.category,
            };
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        libretranslate_service_1.LibreTranslateService])
], ProductsService);
//# sourceMappingURL=products.service.js.map