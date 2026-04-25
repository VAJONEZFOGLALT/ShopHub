import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(+userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Req() req: any) {
    const order = await this.ordersService.findOne(+id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    const currentUser = req.user;
    const isAdmin = currentUser?.role === 'ADMIN';
    if (!isAdmin && Number(order.userId) !== Number(currentUser?.id)) {
      throw new ForbiddenException('You are not allowed to view this order');
    }

    return order;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.update(+id, { status: body.status as any });
  }

  @Patch(':id/fulfill')
  fulfillOrder(@Param('id') id: string, @Body() body: { teljesitve?: boolean }) {
    return this.ordersService.update(+id, { teljesitve: typeof body.teljesitve === 'boolean' ? body.teljesitve : true });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
