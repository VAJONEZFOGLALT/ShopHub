import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    orderId: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    productId: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price: number;
}
