import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  Header,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private assertAdmin(req: any) {
    if (req?.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({ description: 'Product created successfully.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    this.assertAdmin(req);
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiQuery({ name: 'lang', required: false, example: 'hu' })
  @ApiOkResponse({ description: 'Array of products.' })
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  findAll(@Query('lang') lang?: string) {
    return this.productsService.findAll(lang);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured showcase' })
  @ApiQuery({ name: 'lang', required: false, example: 'en' })
  @ApiOkResponse({ description: 'Featured products and categories.' })
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  getFeatured(@Query('lang') lang?: string) {
    return this.productsService.getFeaturedShowcase(lang);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', example: 240085 })
  @ApiQuery({ name: 'lang', required: false, example: 'hu' })
  @ApiOkResponse({ description: 'Product details.' })
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  findOne(@Param('id') id: string, @Query('lang') lang?: string) {
    return this.productsService.findOne(+id, lang);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', example: 240085 })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ description: 'Product updated successfully.' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req: any) {
    this.assertAdmin(req);
    return this.productsService.update(+id, updateProductDto);
  }

  @Post(':id/image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Upload product image' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', example: 240085 })
  @ApiOkResponse({ description: 'Image uploaded successfully.' })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    this.assertAdmin(req);
    const upload = await this.cloudinaryService.uploadImage(file, 'products');
    return this.productsService.update(+id, { image: upload.url });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', example: 240085 })
  @ApiOkResponse({ description: 'Product deleted successfully.' })
  remove(@Param('id') id: string, @Req() req: any) {
    this.assertAdmin(req);
    return this.productsService.remove(+id);
  }
}
