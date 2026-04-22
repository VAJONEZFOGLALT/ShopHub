import { IsArray, IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum CourierService {
  UPS = 'UPS',
  PACKETA = 'PACKETA',
  DPD = 'DPD',
  INPOST = 'INPOST',
}

export class CreateOrderDto {
  @IsInt()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @IsOptional()
  @IsEnum(CourierService)
  courier?: CourierService;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsIn(['hu', 'en'])
  language?: 'hu' | 'en';
}

export class OrderItemInput {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
