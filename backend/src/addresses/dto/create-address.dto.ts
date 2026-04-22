import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 240027 })
  userId: number;
  @ApiProperty({ example: 'Home' })
  label: string;
  @ApiProperty({ example: 'Alice Example' })
  fullName: string;
  @ApiProperty({ example: '72 Kirstin Ferry' })
  street: string;
  @ApiProperty({ example: 'Debrecen' })
  city: string;
  @ApiProperty({ example: 'Nebraska' })
  state: string;
  @ApiProperty({ example: '07230-3540' })
  zipCode: string;
  @ApiPropertyOptional({ example: 'Hungary', default: 'Hungary' })
  country?: string;
  @ApiPropertyOptional({ example: true, default: false })
  isDefault?: boolean;
}
