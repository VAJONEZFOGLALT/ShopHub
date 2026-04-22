import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'alice@example.com', description: 'Email address or username.' })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Account password.' })
  @IsNotEmpty()
  @IsString()
  password: string;
}