import { IsInt } from 'class-validator';

export class CreateRecentlyViewedDto {
  @IsInt()
  userId: number;

  @IsInt()
  productId: number;
}
