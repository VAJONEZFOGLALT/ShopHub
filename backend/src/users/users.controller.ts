import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from '@nestjs/passport';

const sanitizeUser = (user: any) => {
  if (!user) return user;
  const { password_hash, ...safe } = user;
  return safe;
};

const sanitizeUsers = (users: any[]) => users.map(sanitizeUser);

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private isAdmin(req: any) {
    return req?.user?.role === 'ADMIN';
  }

  private assertSelfOrAdmin(req: any, targetUserId: number, message = 'Forbidden') {
    if (this.isAdmin(req)) {
      return;
    }
    if (Number(req?.user?.id) !== Number(targetUserId)) {
      throw new ForbiddenException(message);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const created = await this.usersService.create(createUserDto);
    return sanitizeUser(created);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req: any) {
    if (!this.isAdmin(req)) {
      throw new ForbiddenException('Admin access required');
    }
    const users = await this.usersService.findAll();
    return sanitizeUsers(users);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Req() req: any) {
    const targetUserId = Number(id);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to view this user');
    const user = await this.usersService.findOne(targetUserId);
    return sanitizeUser(user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const targetUserId = Number(id);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to update this user');

    if (!this.isAdmin(req) && Object.prototype.hasOwnProperty.call(updateUserDto, 'role')) {
      throw new ForbiddenException('You are not allowed to change roles');
    }

    const updated = await this.usersService.update(targetUserId, updateUserDto);
    return sanitizeUser(updated);
  }

  @Post(':id/avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const targetUserId = Number(id);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to update this avatar');

    const upload = await this.cloudinaryService.uploadImage(file, 'avatars');
    const updated = await this.usersService.update(targetUserId, { avatar: upload.url });
    return sanitizeUser(updated);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req: any) {
    const targetUserId = Number(id);
    this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to delete this user');
    const removed = await this.usersService.remove(targetUserId);
    return sanitizeUser(removed);
  }
}
