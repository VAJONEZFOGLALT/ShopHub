import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateCompareDto {
  @ApiProperty({ example: 240027 })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 240154 })
  @IsInt()
  productId: number;
}
