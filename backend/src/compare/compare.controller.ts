import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CompareService } from './compare.service';
import { CreateCompareDto } from './dto/create-compare.dto';

@Controller('compare')
export class CompareController {
  constructor(private readonly compareService: CompareService) {}

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.compareService.findByUser(Number(userId));
  }

  @Post()
  add(@Body() body: CreateCompareDto) {
    return this.compareService.add(body);
  }

  @Delete('user/:userId/product/:productId')
  removeByUserProduct(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.compareService.removeByUserProduct(Number(userId), Number(productId));
  }

  @Delete('user/:userId')
  clear(@Param('userId') userId: string) {
    return this.compareService.clear(Number(userId));
  }
}
