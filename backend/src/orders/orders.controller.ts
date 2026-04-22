import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private isAdmin(req: any) {
    return req?.user?.role === 'ADMIN';
  }

  private assertSelfOrAdmin(req: any, targetUserId: number, message = 'Forbidden') {
    if (this.isAdmin(req)) {
      return;
    }
    if (Number(req?.user?.id) !== Number(targetUserId)) {
      throw new ForbiddenException(message);
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Create an order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiOkResponse({ description: 'Order created successfully.' })
  @ApiForbiddenResponse({ description: 'You can only create orders for your own account.' })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    this.assertSelfOrAdmin(req, Number(createOrderDto.userId), 'You can only create orders for your own account');
    return this.ordersService.create({
      ...createOrderDto,
      userId: this.isAdmin(req) ? createOrderDto.userId : Number(req.user.id),
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'List orders' })
  @ApiOkResponse({ description: 'Order list.' })
  findAll(@Req() req: any) {
    if (!this.isAdmin(req)) {
      return this.ordersService.findByUser(Number(req.user.id));
    }
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'List orders by user' })
  @ApiParam({ name: 'userId', example: 240027 })
  @ApiOkResponse({ description: 'Order list for one user.' })
  findByUser(@Param('userId') userId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access these orders');
    return this.ordersService.findByUser(targetUserId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', example: 690001 })
  @ApiOkResponse({ description: 'Order details.' })
  @ApiNotFoundResponse({ description: 'Order not found.' })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', example: 690001 })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({ description: 'Order updated successfully.' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Req() req: any) {
    if (!this.isAdmin(req)) {
      throw new ForbiddenException('Admin access required');
    }
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', example: 690001 })
  @ApiBody({ schema: { example: { status: 'SHIPPED' } } })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Req() req: any) {
    if (!this.isAdmin(req)) {
      throw new ForbiddenException('Admin access required');
    }
    return this.ordersService.update(+id, { status: body.status as any });
  }

  @Patch(':id/fulfill')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Mark order fulfilled' })
  @ApiParam({ name: 'id', example: 690001 })
  @ApiBody({ schema: { example: { teljesitve: true } } })
  fulfillOrder(@Param('id') id: string, @Body() body: { teljesitve?: boolean }, @Req() req: any) {
    if (!this.isAdmin(req)) {
      throw new ForbiddenException('Admin access required');
    }
    return this.ordersService.update(+id, { teljesitve: typeof body.teljesitve === 'boolean' ? body.teljesitve : true });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', example: 690001 })
  @ApiOkResponse({ description: 'Order deleted successfully.' })
  remove(@Param('id') id: string, @Req() req: any) {
    if (!this.isAdmin(req)) {
      throw new ForbiddenException('Admin access required');
    }
    return this.ordersService.remove(+id);
  }
}
