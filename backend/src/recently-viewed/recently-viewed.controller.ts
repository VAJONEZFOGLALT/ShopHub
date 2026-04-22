import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RecentlyViewedService } from './recently-viewed.service';
import { CreateRecentlyViewedDto } from './dto/create-recently-viewed.dto';

@Controller('recently-viewed')
export class RecentlyViewedController {
  constructor(private readonly recentlyViewedService: RecentlyViewedService) {}

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.recentlyViewedService.findByUser(Number(userId));
  }

  @Post()
  upsert(@Body() body: CreateRecentlyViewedDto) {
    return this.recentlyViewedService.upsert(body);
  }

  @Delete('user/:userId')
  clear(@Param('userId') userId: string) {
    return this.recentlyViewedService.clear(Number(userId));
  }
}
