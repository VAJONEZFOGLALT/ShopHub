import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.products.findMany();
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

  async findOne(id: number) {
    try {
      return await this.prisma.products.findUnique({ where: { id } });
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
