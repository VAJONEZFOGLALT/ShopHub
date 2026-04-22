import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  userId: number;

  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
