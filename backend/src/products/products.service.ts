import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LibreTranslateService } from '../translations/libretranslate.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly listCache = new Map<string, { expiresAt: number; data: any[] }>();
  private readonly itemCache = new Map<string, { expiresAt: number; data: any }>();
  private readonly cacheTtlMs = 60 * 1000;
  private readonly categoryTranslationOverrides: Record<string, Record<string, string>> = {
    en: {
      otthon: 'Home',
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly translateService: LibreTranslateService,
  ) {}

  private normalizeLanguage(lang: string): string {
    return lang.toLowerCase().split('-')[0];
  }

  private getFromCache<T>(cache: Map<string, { expiresAt: number; data: T }>, key: string): T | null {
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

  private setCache<T>(cache: Map<string, { expiresAt: number; data: T }>, key: string, data: T) {
    cache.set(key, {
      expiresAt: Date.now() + this.cacheTtlMs,
      data,
    });
  }

  private clearProductCaches() {
    this.listCache.clear();
    this.itemCache.clear();
  }

  private resolveCategoryLabel(
    originalCategory: string,
    translatedCategory: string | undefined,
    normalizedLang: string,
  ): string {
    const normalizedCategory = (originalCategory || '').trim().toLowerCase();
    const langOverrides = this.categoryTranslationOverrides[normalizedLang] || {};
    const overridden = langOverrides[normalizedCategory];
    if (overridden) {
      return overridden;
    }
    return translatedCategory || originalCategory;
  }

  async findAll(language?: string) {
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
        this.translateService.translateBatch(names, 'hu', normalizedLang),
        this.translateService.translateBatch(descriptions, 'hu', normalizedLang),
        this.translateService.translateBatch(categories, 'hu', normalizedLang),
      ]);

      const translatedProducts = products.map((product, index) => ({
        ...product,
        name: translatedNames[index] || product.name,
        description: translatedDescriptions[index] || product.description,
        category: product.category,
        categoryLabel: this.resolveCategoryLabel(
          product.category,
          translatedCategories[index],
          normalizedLang,
        ),
      }));
      this.setCache(this.listCache, listCacheKey, translatedProducts);
      return translatedProducts;
    } catch (error) {
      console.error('Products findAll error:', error);
      throw new BadRequestException(
        `Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const created = await this.prisma.products.create({ data: createProductDto });
      this.clearProductCaches();
      return created;
    } catch (error) {
      console.error('Products create error:', error);
      throw new BadRequestException(
        `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findOne(id: number, language?: string) {
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
        this.translateService.translate(product.name || '', 'hu', normalizedLang),
        this.translateService.translate(product.description || '', 'hu', normalizedLang),
        this.translateService.translate(product.category || '', 'hu', normalizedLang),
      ]);

      const translatedProduct = {
        ...product,
        name: translatedName.translatedText || product.name,
        description: translatedDescription.translatedText || product.description,
        category: product.category,
        categoryLabel: this.resolveCategoryLabel(
          product.category,
          translatedCategory.translatedText,
          normalizedLang,
        ),
      };
      this.setCache(this.itemCache, itemCacheKey, translatedProduct);
      return translatedProduct;
    } catch (error) {
      console.error('Products findOne error:', error);
      throw new BadRequestException(
        `Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const updated = await this.prisma.products.update({ where: { id }, data: updateProductDto });
      this.clearProductCaches();
      return updated;
    } catch (error) {
      console.error('Products update error:', error);
      throw new BadRequestException(
        `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async remove(id: number) {
    try {
      const product = await this.prisma.products.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      const deleted = await this.prisma.products.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      this.clearProductCaches();
      return deleted;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Products remove error:', error);
      throw new BadRequestException(
        `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
