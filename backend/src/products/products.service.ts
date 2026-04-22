import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LibreTranslateService } from '../translations/libretranslate.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly translateService: LibreTranslateService,
  ) {}

  private normalizeLanguage(lang: string): string {
    return lang.toLowerCase().split('-')[0];
  }

  async findAll(language?: string) {
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
    } catch (error) {
      console.error('Products findAll error:', error);
      throw new BadRequestException(
        `Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prisma.products.create({ data: createProductDto });
    } catch (error) {
      console.error('Products create error:', error);
      throw new BadRequestException(
        `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findOne(id: number, language?: string) {
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
    } catch (error) {
      console.error('Products findOne error:', error);
      throw new BadRequestException(
        `Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return await this.prisma.products.update({ where: { id }, data: updateProductDto });
    } catch (error) {
      console.error('Products update error:', error);
      throw new BadRequestException(
        `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.products.delete({ where: { id } });
    } catch (error) {
      console.error('Products remove error:', error);
      throw new BadRequestException(
        `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
