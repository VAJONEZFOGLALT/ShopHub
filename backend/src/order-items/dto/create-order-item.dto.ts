import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
    @ApiProperty({ example: 690001 })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    orderId: number;

    @ApiProperty({ example: 240154 })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    productId: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 9787.07 })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price: number;
}
