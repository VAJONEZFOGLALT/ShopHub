import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

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
  create(@Body() createAddressDto: CreateAddressDto, @Req() req: any) {
    this.assertSelfOrAdmin(req, Number(createAddressDto.userId), 'You can only create addresses for your own account');
    return this.addressesService.create({
      ...createAddressDto,
      userId: this.isAdmin(req) ? createAddressDto.userId : Number(req.user.id),
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findByUser(@Query('userId') userId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access these addresses');
    return this.addressesService.findByUser(targetUserId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Req() req: any) {
    const address = await this.addressesService.findOne(+id);
    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
    this.assertSelfOrAdmin(req, Number(address.userId), 'You are not allowed to access this address');
    return address;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto, @Req() req: any) {
    const existing = await this.addressesService.findOne(+id);
    if (!existing) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
    this.assertSelfOrAdmin(req, Number(existing.userId), 'You are not allowed to update this address');
    return this.addressesService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req: any) {
    const existing = await this.addressesService.findOne(+id);
    if (!existing) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
    this.assertSelfOrAdmin(req, Number(existing.userId), 'You are not allowed to delete this address');
    return this.addressesService.remove(+id);
  }
}
