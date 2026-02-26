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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

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

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const created = await this.usersService.create(createUserDto);
    return sanitizeUser(created);
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return sanitizeUsers(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return sanitizeUser(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updated = await this.usersService.update(+id, updateUserDto);
    return sanitizeUser(updated);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const upload = await this.cloudinaryService.uploadImage(file, 'avatars');
    const updated = await this.usersService.update(+id, { avatar: upload.url });
    return sanitizeUser(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removed = await this.usersService.remove(+id);
    return sanitizeUser(removed);
  }
}
