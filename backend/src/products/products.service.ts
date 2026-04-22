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
  private readonly productNameTranslationContext =
    'These are product names in a webshop. Keep them short, natural, and product-like. Do not turn them into sentences or verb phrases. Prefer conventional e-commerce naming for product titles.';
  private readonly productDescriptionTranslationContext =
    'These are product descriptions for an e-commerce store. Translate naturally and accurately. Keep marketing tone and technical meaning, but do not add extra claims or shorten meaningful details.';
  private readonly categoryTranslationContext =
    'These are website product category labels for an e-commerce store. Translate them as short category names, not verbs or sentences. Prefer common storefront category terms such as Home, Electronics, Clothing, Accessories, Shoes, Beauty, Toys, Furniture, Sports, Garden, Books, or Pet Supplies when appropriate.';

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
        this.translateService.translateBatch(names, 'hu', normalizedLang, this.productNameTranslationContext),
        this.translateService.translateBatch(descriptions, 'hu', normalizedLang, this.productDescriptionTranslationContext),
        this.translateService.translateBatch(categories, 'hu', normalizedLang, this.categoryTranslationContext),
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

  async getFeaturedShowcase(language?: string) {
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

    const viewCounts = new Map<number, number>();
    for (const row of recentViews) {
      viewCounts.set(row.productId, (viewCounts.get(row.productId) || 0) + 1);
    }

    const enrichedProducts = products.map((product) => ({
      ...product,
      viewsCount: viewCounts.get(product.id) || 0,
    }));

    const categories = new Map<string, { key: string; label: string; viewsCount: number; productCount: number }>();
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
        this.translateService.translate(product.name || '', 'hu', normalizedLang, this.productNameTranslationContext),
        this.translateService.translate(product.description || '', 'hu', normalizedLang, this.productDescriptionTranslationContext),
        this.translateService.translate(product.category || '', 'hu', normalizedLang, this.categoryTranslationContext),
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
