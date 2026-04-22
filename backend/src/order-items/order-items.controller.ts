import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('order-items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  private assertAdmin(req: any) {
    if (req?.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Create an order item' })
  @ApiBody({ type: CreateOrderItemDto })
  @ApiOkResponse({ description: 'Order item created successfully.' })
  create(@Body() createOrderItemDto: CreateOrderItemDto, @Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'List order items' })
  @ApiOkResponse({ description: 'Order item list.' })
  findAll(@Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Get an order item by ID' })
  @ApiParam({ name: 'id', example: 690001 })
  @ApiOkResponse({ description: 'Order item details.' })
  findOne(@Param('id') id: string, @Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Update an order item' })
  @ApiParam({ name: 'id', example: 690001 })
  @ApiBody({ type: UpdateOrderItemDto })
  @ApiOkResponse({ description: 'Order item updated successfully.' })
  update(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto, @Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiParam({ name: 'id', example: 690001 })
  @ApiOkResponse({ description: 'Order item deleted successfully.' })
  remove(@Param('id') id: string, @Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.remove(+id);
  }
}
