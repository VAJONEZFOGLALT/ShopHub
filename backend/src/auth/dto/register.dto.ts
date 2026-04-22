import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'alice@example.com', description: 'Unique email address.' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Password must meet strength rules.' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'alice', description: 'Unique username.' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiPropertyOptional({ example: 'Alice Example', description: 'Display name shown in the app.' })
  @IsOptional()
  @IsString()
  name?: string;
}