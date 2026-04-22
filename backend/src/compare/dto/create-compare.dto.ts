import { IsInt } from 'class-validator';

export class CreateCompareDto {
  @IsInt()
  userId: number;

  @IsInt()
  productId: number;
}
