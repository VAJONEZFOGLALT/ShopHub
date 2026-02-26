import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto) {
    // If this is set as default, unset other defaults for this user
    if (createAddressDto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId: createAddressDto.userId },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.create({ data: createAddressDto });
  }

  findByUser(userId: number) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.address.findUnique({ where: { id } });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    // If setting as default, unset others
    if (updateAddressDto.isDefault) {
      const address = await this.prisma.address.findUnique({ where: { id } });
      if (address) {
        await this.prisma.address.updateMany({
          where: { userId: address.userId, id: { not: id } },
          data: { isDefault: false },
        });
      }
    }
    return this.prisma.address.update({ where: { id }, data: updateAddressDto });
  }

  remove(id: number) {
    return this.prisma.address.delete({ where: { id } });
  }
}
