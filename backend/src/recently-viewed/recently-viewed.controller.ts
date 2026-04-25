import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { RecentlyViewedService } from './recently-viewed.service';
import { CreateRecentlyViewedDto } from './dto/create-recently-viewed.dto';
import { AuthGuard } from '@nestjs/passport';

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
  findByUser(@Param('userId') userId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to access recently viewed items for this user');
    return this.recentlyViewedService.findByUser(targetUserId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  upsert(@Body() body: CreateRecentlyViewedDto, @Req() req: any) {
    this.assertSelfOrAdmin(req, Number(body.userId), 'You can only modify your own recently viewed items');
    return this.recentlyViewedService.upsert({
      ...body,
      userId: this.isAdmin(req) ? body.userId : Number(req.user.id),
    });
  }

  @Delete('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  clear(@Param('userId') userId: string, @Req() req: any) {
    const targetUserId = Number(userId);
    this.assertSelfOrAdmin(req, targetUserId, 'You can only modify your own recently viewed items');
    return this.recentlyViewedService.clear(targetUserId);
  }
}
