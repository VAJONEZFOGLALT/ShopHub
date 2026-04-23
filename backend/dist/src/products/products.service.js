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
    listCache = new Map();
    itemCache = new Map();
    cacheTtlMs = 60 * 1000;
    categoryTranslationOverrides = {
        en: {
            elektronika: 'Electronics',
            kiegeszitok: 'Accessories',
            iroda: 'Office',
            otthon: 'Home',
            divat: 'Fashion',
            sport: 'Sports',
            gaming: 'Gaming',
            audio: 'Audio',
        },
    };
    productNameTranslationContext = 'These are product names in a webshop. Keep them short, natural, and product-like. Do not turn them into sentences or verb phrases. Prefer conventional e-commerce naming for product titles.';
    productDescriptionTranslationContext = 'These are product descriptions for an e-commerce store. Translate naturally and accurately. Keep marketing tone and technical meaning, but do not add extra claims or shorten meaningful details.';
    categoryTranslationContext = 'These are website product category labels for an e-commerce store. Translate them as short category names, not verbs or sentences. Prefer common storefront category terms such as Home, Electronics, Clothing, Accessories, Shoes, Beauty, Toys, Furniture, Sports, Garden, Books, or Pet Supplies when appropriate.';
    constructor(prisma, translateService) {
        this.prisma = prisma;
        this.translateService = translateService;
    }
    normalizeLanguage(lang) {
        return lang.toLowerCase().split('-')[0];
    }
    getFromCache(cache, key) {
        const entry = cache.get(key);
        if (!entry) {
            return null;
        }
        if (Date.now() > entry.expiresAt) {
            cache.delete(key);
            return null;
        }
        return entry.data;
    }
    setCache(cache, key, data) {
        cache.set(key, {
            expiresAt: Date.now() + this.cacheTtlMs,
            data,
        });
    }
    clearProductCaches() {
        this.listCache.clear();
        this.itemCache.clear();
    }
    resolveCategoryLabel(originalCategory, translatedCategory, normalizedLang) {
        const normalizedCategory = (originalCategory || '').trim().toLowerCase();
        const langOverrides = this.categoryTranslationOverrides[normalizedLang] || {};
        const overridden = langOverrides[normalizedCategory];
        if (overridden) {
            return overridden;
        }
        return translatedCategory || originalCategory;
    }
    async findAll(language) {
        try {
            const normalizedLang = this.normalizeLanguage(language || 'hu');
            const listCacheKey = `list:${normalizedLang}`;
            const cachedList = this.getFromCache(this.listCache, listCacheKey);
            if (cachedList) {
                return cachedList;
            }
            const products = await this.prisma.products.findMany({
                where: { deletedAt: null },
            });
            if (normalizedLang === 'hu') {
                const originalProducts = products.map((product) => ({
                    ...product,
                    categoryLabel: product.category,
                }));
                this.setCache(this.listCache, listCacheKey, originalProducts);
                return originalProducts;
            }
            const names = products.map((p) => p.name || '');
            const descriptions = products.map((p) => p.description || '');
            const categories = products.map((p) => p.category || '');
            const [translatedNames, translatedDescriptions, translatedCategories] = await Promise.all([
                this.translateService.translateBatch(names, 'hu', normalizedLang, this.productNameTranslationContext),
                this.translateService.translateBatch(descriptions, 'hu', normalizedLang, this.productDescriptionTranslationContext),
                this.translateService.translateBatch(categories, 'hu', normalizedLang, this.categoryTranslationContext),
            ]);
            const translatedProducts = products.map((product, index) => ({
                ...product,
                name: translatedNames[index] || product.name,
                description: translatedDescriptions[index] || product.description,
                category: product.category,
                categoryLabel: this.resolveCategoryLabel(product.category, translatedCategories[index], normalizedLang),
            }));
            this.setCache(this.listCache, listCacheKey, translatedProducts);
            return translatedProducts;
        }
        catch (error) {
            console.error('Products findAll error:', error);
            throw new common_1.BadRequestException(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getFeaturedShowcase(language) {
        const products = await this.findAll(language);
        const recentViews = await this.prisma.recentlyViewed.findMany({
            where: {
                product: {
                    deletedAt: null,
                },
            },
            select: {
                productId: true,
            },
        });
        const viewCounts = new Map();
        for (const row of recentViews) {
            viewCounts.set(row.productId, (viewCounts.get(row.productId) || 0) + 1);
        }
        const enrichedProducts = products.map((product) => ({
            ...product,
            viewsCount: viewCounts.get(product.id) || 0,
        }));
        const categories = new Map();
        for (const product of enrichedProducts) {
            const key = (product.category || '').trim();
            if (!key) {
                continue;
            }
            const label = (product.categoryLabel || product.category || key).trim();
            const existing = categories.get(key);
            if (existing) {
                existing.viewsCount += product.viewsCount || 0;
                existing.productCount += 1;
                continue;
            }
            categories.set(key, {
                key,
                label,
                viewsCount: product.viewsCount || 0,
                productCount: 1,
            });
        }
        const featuredProducts = [...enrichedProducts]
            .sort((a, b) => {
            const viewDelta = (b.viewsCount || 0) - (a.viewsCount || 0);
            if (viewDelta !== 0) {
                return viewDelta;
            }
            return b.id - a.id;
        })
            .slice(0, 12);
        const featuredCategories = [...categories.values()]
            .sort((a, b) => {
            const viewDelta = b.viewsCount - a.viewsCount;
            if (viewDelta !== 0) {
                return viewDelta;
            }
            const labelDelta = a.label.localeCompare(b.label);
            if (labelDelta !== 0) {
                return labelDelta;
            }
            return b.productCount - a.productCount;
        })
            .slice(0, 6);
        return {
            categories: featuredCategories,
            products: featuredProducts,
        };
    }
    async create(createProductDto) {
        try {
            const created = await this.prisma.products.create({ data: createProductDto });
            this.clearProductCaches();
            return created;
        }
        catch (error) {
            console.error('Products create error:', error);
            throw new common_1.BadRequestException(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async findOne(id, language) {
        try {
            const normalizedLang = this.normalizeLanguage(language || 'hu');
            const itemCacheKey = `item:${id}:${normalizedLang}`;
            const cachedItem = this.getFromCache(this.itemCache, itemCacheKey);
            if (cachedItem) {
                return cachedItem;
            }
            const product = await this.prisma.products.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });
            if (!product) {
                return null;
            }
            if (normalizedLang === 'hu') {
                const originalProduct = {
                    ...product,
                    categoryLabel: product.category,
                };
                this.setCache(this.itemCache, itemCacheKey, originalProduct);
                return originalProduct;
            }
            const [translatedName, translatedDescription, translatedCategory] = await Promise.all([
                this.translateService.translate(product.name || '', 'hu', normalizedLang, this.productNameTranslationContext),
                this.translateService.translate(product.description || '', 'hu', normalizedLang, this.productDescriptionTranslationContext),
                this.translateService.translate(product.category || '', 'hu', normalizedLang, this.categoryTranslationContext),
            ]);
            const translatedProduct = {
                ...product,
                name: translatedName.translatedText || product.name,
                description: translatedDescription.translatedText || product.description,
                category: product.category,
                categoryLabel: this.resolveCategoryLabel(product.category, translatedCategory.translatedText, normalizedLang),
            };
            this.setCache(this.itemCache, itemCacheKey, translatedProduct);
            return translatedProduct;
        }
        catch (error) {
            console.error('Products findOne error:', error);
            throw new common_1.BadRequestException(`Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async update(id, updateProductDto) {
        try {
            const updated = await this.prisma.products.update({ where: { id }, data: updateProductDto });
            this.clearProductCaches();
            return updated;
        }
        catch (error) {
            console.error('Products update error:', error);
            throw new common_1.BadRequestException(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async remove(id) {
        try {
            const product = await this.prisma.products.findUnique({ where: { id } });
            if (!product) {
                throw new common_1.NotFoundException(`Product with id ${id} not found`);
            }
            const deleted = await this.prisma.products.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
            this.clearProductCaches();
            return deleted;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
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