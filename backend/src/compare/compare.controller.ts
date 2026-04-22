import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CompareService } from './compare.service';
import { CreateCompareDto } from './dto/create-compare.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('compare')
@Controller('compare')
export class CompareController {
  constructor(private readonly compareService: CompareService) {}

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

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'List compare items by user' })
  @ApiParam({ name: 'userId', example: 240027 })
  @ApiOkResponse({ description: 'Compare items.' })
  findByUser(@Param('userId') userId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access this compare list');
    return this.compareService.findByUser(targetUserId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Add a compare item' })
  @ApiBody({ type: CreateCompareDto })
  @ApiOkResponse({ description: 'Compare item added.' })
  add(@Body() body: CreateCompareDto, @Req() req: any) {
    this.assertSelfOrAdmin(req, Number(body.userId), 'You can only modify your own compare list');
    return this.compareService.add({
      ...body,
      userId: this.isAdmin(req) ? body.userId : Number(req.user.id),
    });
  }

  @Delete('user/:userId/product/:productId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Remove a compare item' })
  @ApiParam({ name: 'userId', example: 240027 })
  @ApiParam({ name: 'productId', example: 240154 })
  @ApiOkResponse({ description: 'Compare item removed.' })
  removeByUserProduct(@Param('userId') userId: string, @Param('productId') productId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You can only modify your own compare list');
    return this.compareService.removeByUserProduct(targetUserId, Number(productId));
  }

  @Delete('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Clear compare list' })
  @ApiParam({ name: 'userId', example: 240027 })
  @ApiOkResponse({ description: 'Compare list cleared.' })
  clear(@Param('userId') userId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You can only modify your own compare list');
    return this.compareService.clear(targetUserId);
  }
}
