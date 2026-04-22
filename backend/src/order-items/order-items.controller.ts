import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { AuthGuard } from '@nestjs/passport';

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
  create(@Body() createOrderItemDto: CreateOrderItemDto, @Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto, @Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: any) {
    this.assertAdmin(req);
    return this.orderItemsService.remove(+id);
  }
}
