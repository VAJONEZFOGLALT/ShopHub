import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('addresses')
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
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Create an address' })
  @ApiBody({ type: CreateAddressDto })
  @ApiOkResponse({ description: 'Address created successfully.' })
  create(@Body() createAddressDto: CreateAddressDto, @Req() req: any) {
    this.assertSelfOrAdmin(req, Number(createAddressDto.userId), 'You can only create addresses for your own account');
    return this.addressesService.create({
      ...createAddressDto,
      userId: this.isAdmin(req) ? createAddressDto.userId : Number(req.user.id),
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'List addresses by user' })
  @ApiQuery({ name: 'userId', example: 240027 })
  @ApiOkResponse({ description: 'Address list.' })
  findByUser(@Query('userId') userId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access these addresses');
    return this.addressesService.findByUser(targetUserId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Get an address by ID' })
  @ApiParam({ name: 'id', example: 300001 })
  @ApiOkResponse({ description: 'Address details.' })
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
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Update an address' })
  @ApiParam({ name: 'id', example: 300001 })
  @ApiBody({ type: UpdateAddressDto })
  @ApiOkResponse({ description: 'Address updated successfully.' })
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
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiParam({ name: 'id', example: 300001 })
  @ApiOkResponse({ description: 'Address deleted successfully.' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const existing = await this.addressesService.findOne(+id);
    if (!existing) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
    this.assertSelfOrAdmin(req, Number(existing.userId), 'You are not allowed to delete this address');
    return this.addressesService.remove(+id);
  }
}
