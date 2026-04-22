import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.users.create({ data: { ...rest, password_hash: hashedPassword } });
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findOne(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      return this.prisma.users.update({ where: { id }, data: { ...rest, password_hash: hashedPassword } });
    }
    return this.prisma.users.update({ where: { id }, data: rest });
  }

  async remove(id: number) {
    try {
      const existing = await this.prisma.users.findUnique({ where: { id }, select: { id: true } });
      if (!existing) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return await this.prisma.$transaction(async (tx) => {
        await tx.orderItems.deleteMany({ where: { order: { userId: id } } });
        await tx.orders.deleteMany({ where: { userId: id } });
        await tx.reviews.deleteMany({ where: { userId: id } });
        await tx.wishlist.deleteMany({ where: { userId: id } });
        await tx.recentlyViewed.deleteMany({ where: { userId: id } });
        await tx.compareItems.deleteMany({ where: { userId: id } });
        await tx.address.deleteMany({ where: { userId: id } });
        return tx.users.delete({ where: { id } });
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
