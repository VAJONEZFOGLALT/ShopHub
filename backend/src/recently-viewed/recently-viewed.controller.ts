import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RecentlyViewedService } from './recently-viewed.service';
import { CreateRecentlyViewedDto } from './dto/create-recently-viewed.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('recently-viewed')
@Controller('recently-viewed')
export class RecentlyViewedController {
  constructor(private readonly recentlyViewedService: RecentlyViewedService) {}

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
  @ApiOperation({ summary: 'List recently viewed items by user' })
  @ApiParam({ name: 'userId', example: 240027 })
  @ApiOkResponse({ description: 'Recently viewed items.' })
  findByUser(@Param('userId') userId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access recently viewed items for this user');
    return this.recentlyViewedService.findByUser(targetUserId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Track a recently viewed product' })
  @ApiBody({ type: CreateRecentlyViewedDto })
  @ApiOkResponse({ description: 'Recently viewed item stored.' })
  upsert(@Body() body: CreateRecentlyViewedDto, @Req() req: any) {
    this.assertSelfOrAdmin(req, Number(body.userId), 'You can only modify your own recently viewed items');
    return this.recentlyViewedService.upsert({
      ...body,
      userId: this.isAdmin(req) ? body.userId : Number(req.user.id),
    });
  }

  @Delete('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Clear recently viewed items' })
  @ApiParam({ name: 'userId', example: 240027 })
  @ApiOkResponse({ description: 'Recently viewed list cleared.' })
  clear(@Param('userId') userId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You can only modify your own recently viewed items');
    return this.recentlyViewedService.clear(targetUserId);
  }
}
